from fango.redis_client import redis_client
from fango.models import AppUser

class JWTRedisMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_paths = ["/api/login", "/api/register", "/api/logout"]

    def __call__(self, request):
        if request.path in self.exempt_paths:
            return self.get_response(request)

        token = request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['id']
            request.user_id = user_id
            if redis_client.get(f"user:{user_id}:jwt") == "revoked":
                raise InvalidTokenError("Token revoked")

            user = AppUser.objects.get(id=user_id)
            if user.status == "banned":
                raise InvalidTokenError("User account inactive or banned")

        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            raise AuthenticationFailed('Unauthenticated')

        return self.get_response(request)