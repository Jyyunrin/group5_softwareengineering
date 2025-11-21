import os
from .models import AppUser, UserHistory, Language, Word, Translation, UserHistory, Quiz, QuizWord
from .views import LoginView, LogoutView
from .redis_client import redis_client
from unittest.mock import patch
from django.urls import reverse
from django.utils import timezone
from django.test import TestCase
from django.test import override_settings
from rest_framework.test import APIClient
import jwt
import datetime

SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

# Create your tests here.
@override_settings(MIDDLEWARE=[])
class AuthViewsTests(TestCase):
    def setUp(self):
        self.language = Language.objects.create(code="en", lang="English")
        self.user = AppUser.objects.create_user(
            email="jane@test.com",
            password="123",
            name="Jane"
        )
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user_info_url = reverse('userlearninginfo')
        self.auth_check_url = reverse('auth')

    def test_register_success(self):
        data = {
            "email": "a@example.com",
            "password": "123",
            "name": "TestA"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["email"], data["email"])
        self.assertTrue(AppUser.objects.filter(email=data["email"]).exists())

    @patch("fango.views.jwt.encode")
    def test_login_success(
        self,
        mock_jwt # fango.views.jwt.encode
    ):
        mock_jwt.return_value = "mocked_jwt_token"

        data = {"email": self.user.email, "password": "123"}
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, 200)
        self.assertIn("jwt", response.data)
        self.assertEqual(response.data["jwt"], "mocked_jwt_token")
        self.assertIn("jwt", response.cookies)

    def test_login_user_not_found(self):
        data = {"email": "noone@test.com", "password": "123"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 403)

    def test_login_wrong_password(self):
        data = {"email": self.user.email, "password": "WRONG"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 403)

    def test_newuser_learning_info_get(self):
        response = self.client.get(self.user_info_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("languages", response.data)
        self.assertIsNone(response.data["languages"].get(""))

class AuthViewsWithMWTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.language = Language.objects.create(code="en", lang="English")
        self.user = AppUser.objects.create_user(
            email="jane@test.com",
            password="123",
            name="Jane"
        )
        self.user_info_url = reverse('userlearninginfo')
        self.login_url = reverse('login')
        self.auth_check_url = reverse('auth')

        payload = {"id": self.user.id}
        self.token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        self.client.cookies['jwt'] = self.token

    @patch("fango.middleware.JWTRedisMiddleware.redis_client")
    def test_user_learning_info_post(self, mock_redis):
        mock_redis.hgetall.return_value = {
            "id": str(self.user.id),
            "email": self.user.email,
            "jwt": "valid"  # not revoked
        }

        data = {"defaultLang": self.language.lang, "difficulty": "hard"}
        response = self.client.post(self.user_info_url, data, format="json")

        self.user.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("message"), "success")
        self.assertEqual(self.user.difficulty, "hard")
        self.assertEqual(self.user.default_lang_id.lang, "English")
        
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_auth_check(self, mock_hgetall):
        mock_hgetall.return_value = {
            "id": str(self.user.id),
            "email": self.user.email,
            "jwt": "valid"
        }
        response = self.client.get(self.auth_check_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "success")

class JWTRedisMiddlewareTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = AppUser.objects.create_user(
            email="test@test.com",
            password="123",
            name="Tester"
        )
        payload = {"id": self.user.id}
        self.token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        self.client.cookies["jwt"] = self.token

        self.protected_url = reverse("userlearninginfo") 

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_valid_token_and_session(self, mock_hgetall):
        mock_hgetall.return_value = {
            "id": str(self.user.id),
            "email": self.user.email,
            "jwt": self.token
        }
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, 200)

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_missing_session_returns_401(self, mock_hgetall):
        mock_hgetall.return_value = {}
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Unauthorized"})

    def test_missing_token_returns_401(self):
        self.client.cookies.clear()
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Unauthenticated"})
        
class RateLimitMiddlewareTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = AppUser.objects.create_user(
            email="test@test.com",
            password="123",
            name="Tester"
        )
        payload = {"id": self.user.id}
        self.token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        self.client.cookies["jwt"] = self.token

        self.protected_url = reverse("userlearninginfo")
        self.login_url = reverse("login")
        self.register_url = "/api/register"

    @patch("fango.middleware.RateLimitMiddleware.redis_client.incr")
    @patch("fango.middleware.RateLimitMiddleware.redis_client.expire")
    @patch("fango.middleware.RateLimitMiddleware.redis_client.ttl")
    def test_rate_limit_exceeded_returns_429(self, mock_ttl, mock_expire, mock_incr):
        mock_incr.return_value = 10  # above any small limit for test
        mock_expire.return_value = None
        mock_ttl.return_value = 30

        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.json()["detail"], "Rate limit exceeded")
        self.assertEqual(response.json()["retry_after"], 30)

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    @patch("fango.middleware.RateLimitMiddleware.redis_client.incr", return_value=1)
    @patch("fango.middleware.RateLimitMiddleware.redis_client.expire", return_value=None)
    @patch("fango.middleware.RateLimitMiddleware.redis_client.ttl", return_value=60)
    def test_rate_limit_under_limit(self, mock_ttl, mock_expire, mock_incr, mock_hgetall):
        mock_hgetall.return_value = {
            "id": str(self.user.id),
            "email": self.user.email,
            "jwt": "valid"
        }

        self.client.cookies["jwt"] = self.token
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, 200)
