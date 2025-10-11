import os
import jwt
from jwt import InvalidTokenError
from fango.redis_client import redis_client
from fango.models import AppUser
from django.http import JsonResponse
from rest_framework.exceptions import AuthenticationFailed

SECRET_KEY = os.getenv("TOKEN_SECRET", "secret")
class JWTRedisMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_paths = ["/api/login", "/api/register", "/api/logout"]

    def __call__(self, request):
        if request.path in self.exempt_paths:
            return self.get_response(request)
        token = request.COOKIES.get("jwt")
        if not token:
            return JsonResponse({"detail": "Unauthenticated"}, status=401)
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['id']
            request.user_id = user_id
            session = redis_client.hgetall(f"user:{user_id}:session")

            if session and session.get(b"jwt") == b"revoked":
                return JsonResponse({"detail": "Token revoked"}, status=401)
            
            if session:
                request.user_info = dict(session)
            else:
                request.user_info = {}
            
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return JsonResponse({"detail": "Unauthenticated"}, status=401)

        return self.get_response(request)