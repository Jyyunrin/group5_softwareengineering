import os
from .serializers import AppUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from django.utils import timezone
from .models import AppUser
from .redis_client import redis_client
import jwt, datetime

SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

class RegisterView(APIView):
    def post(self, request):
        serializer = AppUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = AppUser.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        
        if user.status == "banned":
            raise AuthenticationFailed("User account inactive or banned")

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')
        
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        
        current_time = timezone.now()
        # 60 minutes TTL
        ttl_seconds = 60 * 60
        redis_client.hset(f"user:{user.id}:session",
        mapping={
            "jwt": token,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "status": user.status,
            "country": user.country,
            "default_lang_id": user.default_lang_id.id if user.default_lang_id else "",
            "created_at": user.created_at.isoformat() if user.created_at else current_time.isoformat(),
            "last_login_at": current_time.isoformat()
        })

        redis_client.expire(f"user:{user.id}:session", ttl_seconds)

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True, secure=True, samesite='None', path='/')
        response.data = {
            "jwt": token,
            "success": True
        }

        user.last_login_at = current_time
        user.save(update_fields=["last_login_at"])

        return response
    
class UserView(APIView):
    def get(self, request):
        if not getattr(request, "user_id", None):
            raise AuthenticationFailed("Unauthenticated")

        # if getattr(request, "user_info", None):
            # return Response(request.user_info)
        # TODO: Above 2 lines working and returns a response of the current user's info, which was fetched from redis
        user = AppUser.objects.filter(id=request.user_id).first()
        if not user:
            raise AuthenticationFailed("User not found")

        serializer = AppUserSerializer(user)

        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['id']
            redis_client.hset(f"user:{user_id}:session", "jwt", "revoked")
        except jwt.ExpiredSignatureError:
            pass
        
        response = Response()
        print(response)
        response.delete_cookie('jwt')
        response.data = {
            'message': "success"
        }
        return response
