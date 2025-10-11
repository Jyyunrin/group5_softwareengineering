import os
import jwt
from jwt import InvalidTokenError
from fango.redis_client import redis_client
from fango.models import AppUser
from rest_framework.exceptions import AuthenticationFailed

SECRET_KEY = os.getenv("TOKEN_SECRET", "secret")
class JWTRedisMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_paths = ["/api/login", "/api/register", "/api/logout"]

    def __call__(self, request):
        if request.path in self.exempt_paths:
            return self.get_response(request)
        # print("1\n")
        token = request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        # print("2\n")
        # print(f"{token}\n")
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['id']
            request.user_id = user_id
            session = redis_client.hgetall(f"user:{user_id}:session")

            if session and session.get(b"jwt") == b"revoked":
                raise InvalidTokenError("Token revoked")
            
            if session:
                request.user_info = dict(session)
            else:
                request.user_info = {}
            
            # print("3\n")

        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            raise AuthenticationFailed('Unauthenticated')
        # print("4\n")

        return self.get_response(request)