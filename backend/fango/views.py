import os
from .serializers import AppUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
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
        
        # 60 minutes TTL
        ttl_seconds = 60 * 60
        redis_client.setex(f"user:{user.id}:jwt", ttl_seconds, token)

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            "jwt": token
        }

        return response
    
class UserView(APIView):
    def get(self, request):
        if not getattr(request, "user_id", None):
            raise AuthenticationFailed("Unauthenticated")

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
            ttl_seconds = int(payload['exp'] - datetime.datetime.utcnow().timestamp())
            redis_client.setex(f"user:{user_id}:jwt", ttl_seconds, "revoked")
        except jwt.ExpiredSignatureError:
            pass
        
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': "success"
        }
        return response
