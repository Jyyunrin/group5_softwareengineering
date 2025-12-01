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
from rest_framework.exceptions import AuthenticationFailed
import jwt
import datetime
import tempfile

SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

class TestLoginUser(TestCase):
    def setUp(self):
        self.service = LoginView()

        self.lang = Language.objects.create(code="fr", lang="French")
        self.user = AppUser.objects.create_user(
            email="test@example.com",
            password="correctpassword",
            status="active",
            name="John Doe",
            role="user",
            country="CA",
            difficulty="medium",
            default_lang_id=self.lang
        )

        self.banned_user = AppUser.objects.create_user(
            email="banned@example.com",
            name="Joan",
            password="somepassword",
            status="banned",
            default_lang_id=self.lang
        )

    def test_jwt_id(self):
        token = self.service.generate_JWT(self.user)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        self.assertEqual(decoded['id'], self.user.id)

    def test_user_not_found(self):
        with self.assertRaisesMessage(AuthenticationFailed, 'User not found!'):
            self.service.authenticate_user("doesnotexist@example.com", "password")

    def test_successful_authentication(self):
        user = self.service.authenticate_user("test@example.com", "correctpassword")
        self.assertEqual(user.email, "test@example.com")

    def test_incorrect_password(self):
        with self.assertRaisesMessage(AuthenticationFailed, 'Incorrect Password'):
            self.service.authenticate_user("test@example.com", "notpassword")

    def test_banned_user(self):
        with self.assertRaisesMessage(AuthenticationFailed, "User account inactive or banned"):
             self.service.authenticate_user("banned@example.com", "somepassword")

class LogoutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('logout')  
        self.valid_token = jwt.encode({'id': 1}, SECRET_KEY, algorithm='HS256')


    @patch('fango.views.redis_client')  
    def test_logout_success(self, mock_redis):
        self.client.cookies['jwt'] = self.valid_token
        response = self.client.post(self.url)

        self.assertEqual(response.cookies['jwt'].value, '')
        self.assertEqual(response.cookies['jwt']['max-age'], 0)

        self.assertEqual(response.data['message'], 'success')
        self.assertEqual(response.status_code, 200)

        mock_redis.hset.assert_called_once_with('user:1:session', 'jwt', 'revoked')

@override_settings(MIDDLEWARE=[])
class UpdateUserInfoTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.lang = Language.objects.create(code="fr", lang="French")
        self.user = AppUser.objects.create_user(
            email='email@test.com',
            password='password123',
            name='OldName',
            country='OldCountry',
            default_lang_id=self.lang
        )
        self.login_url = reverse('login')
        self.update_url = reverse('update_user_info')
        self.get_info_url = reverse('get_user_info')
        payload = {"id": self.user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}
        self.token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        self.client.cookies['jwt'] = self.token

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hset")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_update_success(self, mock_hgetall, mock_hset):
        mock_hgetall.return_value = {"id": str(self.user.id), "email": self.user.email, "jwt": self.token}
        mock_hset.return_value = True

        payload = {"new_username": "Alice", "new_country": "Canada"}
        response = self.client.post(self.update_url, payload, format="json")
        self.user.refresh_from_db()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Successfully updated information!')
        self.assertEqual(self.user.name, 'Alice')
        self.assertEqual(self.user.country, 'Canada')

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_get_user_info(self, mock_hgetall):
        mock_hgetall.return_value = {"id": str(self.user.id), "email": self.user.email, "jwt": self.token}
        response = self.client.get(self.get_info_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'OldName')
        self.assertEqual(response.data['country'], 'OldCountry')

@override_settings(MIDDLEWARE=[])
class UserHistoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.lang = Language.objects.create(code="fr", lang="French")
        self.user = AppUser.objects.create_user(
            email="test@test.com",
            password="password123",
            name="tester",
            default_lang_id=self.lang,
        )

        self.word = Word.objects.create(label_en="Apple", meaning="A fruit")

        self.translation = Translation.objects.create(
            target_lang_id=self.lang,
            word_id=self.word,
            label_target="pomme"
        )

        self.history = UserHistory.objects.create(
            user_id=self.user,
            translation_id=self.translation,
            img_name="apple.png",
            img_path="/app/images/apple.png",
            is_favorite=True
        )

        self.get_info_url = reverse('get_user_history')
        payload = {"id": self.user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}
        self.token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        self.client.cookies["jwt"] = self.token

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_paginate_history(self, mock_hgetall):
        mock_hgetall.return_value = {"id": str(self.user.id), "email": self.user.email, "jwt": self.token}

        for i in range(9):
            UserHistory.objects.create(
                user_id=self.user,
                translation_id=self.translation,
                img_name=f"img{i}.png",
                img_path=f"/app/images/img{i}.png",
                is_favorite=False
            )

        response = self.client.get(self.get_info_url + "?page=1")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        history_list = data["history"]
        next_page_url = data["next_page_url"]
        previous_page_url = data["previous_page_url"]
        max_page = data["max_page"]
        
        self.assertEqual(len(history_list), 6)
        self.assertEqual(max_page, 2)
        self.assertIn("page=2", next_page_url)
        self.assertTrue(previous_page_url in ('', None))

        response = self.client.get(self.get_info_url + "?page=2")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        history_list = data["history"]
        next_page_url = data["next_page_url"]
        previous_page_url = data["previous_page_url"]

        self.assertEqual(len(history_list), 4)
        self.assertIn("page=1", previous_page_url)
        self.assertTrue(next_page_url in ('', None))

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_get_user_history(self, mock_hgetall):
        mock_hgetall.return_value = {"id": str(self.user.id), "email": self.user.email, "jwt": self.token}

        response = self.client.get(self.get_info_url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        if "history" in data:
            history_list = data["history"]
        else:
            history_list = data

        self.assertEqual(history_list[0]['id'], self.history.id)
        self.assertEqual(history_list[0]['word_english'], self.history.translation_id.word_id.label_en)
        self.assertEqual(history_list[0]['language'], self.history.translation_id.target_lang_id.lang)
        self.assertEqual(history_list[0]['word_translated'], self.history.translation_id.label_target)
        self.assertEqual(history_list[0]['image_url'], self.history.img_path)
        self.assertEqual(history_list[0]['is_favorite'], self.history.is_favorite)



class AuthViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.language = Language.objects.create(code="en", lang="English")
        self.user = AppUser.objects.create_user(
            email="jane@test.com",
            password="123",
            name="Jane",
            default_lang_id=self.language
        )
        payload = {"id": self.user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}
        self.token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        self.client.cookies["jwt"] = self.token
        self.user_info_url = reverse('userlearninginfo')
        self.auth_check_url = reverse("auth")

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hset")
    def test_user_learning_info_post(self, mock_hset):
        mock_hset.return_value = True

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
        self.language = Language.objects.create(code="en", lang="English")
        self.user = AppUser.objects.create_user(
            email="test@test.com",
            password="123",
            name="Tester",
            default_lang_id=self.language
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
        self.language = Language.objects.create(code="en", lang="English")
        self.user = AppUser.objects.create_user(
            email="test@test.com",
            password="123",
            name="Tester",
            default_lang_id=self.language
        )
        payload = {"id": self.user.id}
        self.token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        self.client.cookies["jwt"] = self.token

        self.protected_url = reverse("userlearninginfo")
        self.login_url = reverse("login")
        self.register_url = "/api/register"

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

from django.test import override_settings
from rest_framework.test import APIClient
from django.conf import settings
import jwt
import datetime
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from PIL import Image
from fango.redis_client import redis_client
import json

SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

class ImageTranslationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.lang = Language.objects.create(code="fr", lang="French")

        self.user = AppUser.objects.create_user(
            email="test@test.com",
            password="123",
            name="Tester",
            default_lang_id=self.lang
        )

        payload = {
            "id": self.user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }

        self.token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        self.client.cookies["jwt"] = self.token
        self.url = reverse("image-translate")

    def mock_redis_user(self, mock_hgetall):
        mock_hgetall.return_value = {
        "id": str(self.user.id),
        "email": self.user.email,
        "jwt": self.token
        }

    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    @patch("image_handling.views.get_translation")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_image_translate_success(self, mock_hgetall, mock_translate):

        self.mock_redis_user(mock_hgetall)

        mock_translate.return_value = {
            "english": "apple",
            "meaning": "a fruit",
            "translated": "pomme",
            "translated-sentence-easy": "Je mange une pomme.",
            "english-sentence-easy": "I eat an apple.",
            "translated-sentence-med": "Il achète une pomme.",
            "english-sentence-med": "He buys an apple.",
            "translated-sentence-hard": "Elle prépare une tarte aux pommes.",
            "english-sentence-hard": "She is making an apple pie."
        }

        fake_img = Image.new("RGB", (100, 100), color="red")
        buf = io.BytesIO()
        fake_img.save(buf, format="JPEG")
        buf.seek(0)

        uploaded = SimpleUploadedFile("test.jpg", buf.read(), content_type="image/jpeg")

        url = reverse("image-translate")

        response = self.client.post(
            url,
            {
                "file":uploaded,
                "target_lang": "french",
                "target_lang_code":"fr"
            },
            format="multipart"
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("user_history_id", response.data)

    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_missing_file(self, mock_hgetall):
        self.mock_redis_user(mock_hgetall)

        response = self.client.post(
            self.url,
            {
                "target_lang": "french",
                "target_lang_code": "fr"
            },
            format="multipart"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "No file uploaded")

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_file_not_image(self, mock_hgetall):
        self.mock_redis_user(mock_hgetall)

        not_image = SimpleUploadedFile("test.txt", b"Not an image", content_type="text/plain")

        response = self.client.post(
            self.url,
            {
                "file": not_image,
                "target_lang": "french",
                "target_lang_code": "fr"
            },
            format="multipart"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Uploaded file is not an image")

    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    @patch("image_handling.views.get_translation")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_openai_service_failure(self, mock_hgetall, mock_translate):
        self.mock_redis_user(mock_hgetall)
        mock_translate.side_effect = Exception("OpenAI API error")
        fake_img = SimpleUploadedFile("test.jpg", b"fakeimage", content_type="image/jpeg")
        response = self.client.post(
            self.url,
            {"file": fake_img, "target_lang": "french", "target_lang_code": "fr"},
            format="multipart"
        )
        self.assertEqual(response.status_code, 500)
        self.assertIn("Failed to get translation", response.data["error"])

    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    @patch("image_handling.views.get_translation")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_translation_missing_keys(self, mock_hgetall, mock_translate):
        self.mock_redis_user(mock_hgetall)
        mock_translate.return_value = {"english": "apple"}
        fake_img = Image.new("RGB", (100, 100), color="red")
        buf = io.BytesIO()
        fake_img.save(buf, format="JPEG")
        buf.seek(0)
        uploaded = SimpleUploadedFile("test.jpg", buf.read(), content_type="image/jpeg")
        response = self.client.post(
            self.url,
            {"file": uploaded, "target_lang": "french", "target_lang_code": "fr"},
            format="multipart"
        )
        self.assertEqual(response.status_code, 500)
        self.assertIn("Missing data keys", response.data["error"])

    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    @patch("image_handling.views.get_translation")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_db_save_failure(self, mock_hgetall, mock_translate):
        self.mock_redis_user(mock_hgetall)
        mock_translate.return_value = {
            "english": "apple",
            "meaning": "fruit",
            "translated": "pomme",
            "translated-sentence-easy": "Easy",
            "english-sentence-easy": "Easy",
            "translated-sentence-med": "Med",
            "english-sentence-med": "Med",
            "translated-sentence-hard": "Hard",
            "english-sentence-hard": "Hard"
        }
        with patch("fango.models.Word.objects.create") as mock_word:
            mock_word.side_effect = Exception("DB error")
            fake_img = SimpleUploadedFile("test.jpg", b"fakeimage", content_type="image/jpeg")
            response = self.client.post(
                self.url,
                {"file": fake_img, "target_lang": "french", "target_lang_code": "fr"},
                format="multipart"
            )
            self.assertEqual(response.status_code, 500)
            self.assertIn("Failed to save translation", response.data["error"])


    # ServeImage endpoint
    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_serve_image_success(self, mock_hgetall):
        self.mock_redis_user(mock_hgetall)
        save_folder = os.path.join(settings.MEDIA_ROOT, "images")
        os.makedirs(save_folder, exist_ok=True)
        file_path = os.path.join(save_folder, "test.jpg")
        with open(file_path, "wb") as f:
            f.write(b"fakeimagecontent")

        url = f"/api/media/images/test.jpg"
        response = self.client.get(url)

        content_bytes = b"".join(response.streaming_content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(content_bytes, b"fakeimagecontent")

    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_serve_image_not_found(self, mock_hgetall):
        self.mock_redis_user(mock_hgetall)

        url = f"/api/media/images/nonexistent.jpg"
        response = self.client.get(url)

        self.assertEqual(response.status_code, 404)

        data = json.loads(response.content.decode())
        self.assertEqual(data["error"], "File not found")