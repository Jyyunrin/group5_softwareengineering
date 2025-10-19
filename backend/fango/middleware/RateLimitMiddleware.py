import os
import jwt
from jwt import InvalidTokenError
from jwt import InvalidSignatureError
from jwt import DecodeError
from fango.redis_client import redis_client
from fango.models import AppUser
from django.http import JsonResponse
from rest_framework.exceptions import Throttled

SECRET_KEY = os.getenv("TOKEN_SECRET", "secret")
class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limits = {
            "/api/register": (3, 600),   # 3/10min per IP
            "/api/login": (5, 60),       # 5/1min per IP
            "default": (100, 60)         # 100/1min per user
        }
        self.exempt_paths = ["/api/logout"]

    def __call__(self, request):
        try:
            if request.path in self.exempt_paths:
                return self.get_response(request)

            user_id = None
            # TODO: temp cookie fix
            auth_header = request.META.get("HTTP_AUTHORIZATION", "")
            token = None
            if auth_header.startswith("Bearer "):
                token = auth_header[7:]
            else:
                token = request.COOKIES.get('jwt')
            # ---
            # token = request.COOKIES.get('jwt')
            if token:
                try:
                    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                    user_id = payload['id']
                except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, jwt.DecodeError, jwt.InvalidSignatureError):
                    return JsonResponse({"detail": "Unauthorized"}, status=401)

            ip = self.get_client_ip(request)

            if request.path in self.rate_limits:
                limit, window = self.rate_limits[request.path]
                key = f"ratelimit:ip:{ip}:{request.path}"
            elif user_id:
                limit, window = self.rate_limits["default"]
                key = f"ratelimit:user:{user_id}"
            else:
                limit, window = self.rate_limits["default"]
                key = f"ratelimit:ip:{ip}"

            count = redis_client.incr(key)
            if count == 1:
                redis_client.expire(key, window)

            if count > limit:
                retry_after = redis_client.ttl(key)
                raise Throttled(
                    detail=f"Rate limit exceeded. Try again in {retry_after} seconds."
                )
        except Throttled as e:
            return JsonResponse(
                {"detail": "Rate limit exceeded", "retry_after": retry_after},
                status=429
            )     
        return self.get_response(request)

    def get_client_ip(self, request):
        http_x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if http_x_forwarded_for:
            return http_x_forwarded_for.split(",")[0]
        else:
            return request.META.get("REMOTE_ADDR")