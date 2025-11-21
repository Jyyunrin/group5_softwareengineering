import os
from django.test import TestCase
from .views import LoginView
from .models import AppUser, UserHistory, Language, Word, Translation, UserHistory
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.urls import reverse
from unittest.mock import patch
from .redis_client import redis_client
from rest_framework.test import APIClient


SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

class TestLoginUser(TestCase):
    def setUp(self):
        self.service = LoginView()

        self.user = AppUser.objects.create_user(
            email="test@example.com",
            password="correctpassword",
            status="active",
            name="John Doe",
            role="user",
            country="CA",
            difficulty="medium",
        )

        self.banned_user = AppUser.objects.create_user(
            email="banned@example.com",
            password="somepassword",
            status="banned"
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

class UpdateUserInfoTest(TestCase):
    def setUp(self):
        self.client = APIClient()
    
        self.user = AppUser.objects.create_user(
            email='email@test.com',
            password='password123',
            name='OldName',
            country='OldCountry'
        )

        self.login_url = reverse('login')
        self.update_url = reverse('update_user_info')
        self.get_info_url = reverse('get_user_info')

        login_payload = {
            'email': 'email@test.com',
            'password': 'password123'
        }

        login_response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('jwt', login_response.cookies)

        self.token = login_response.cookies['jwt'].value
        self.client.cookies['jwt'] = self.token

    def test_update_success(self):
        payload = {
            'new_username': 'Alice',
            'new_country': 'Canada'
        }

        response = self.client.post(self.update_url, payload, format='json')
        self.user.refresh_from_db()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Successfully updated information!')
        self.assertEqual(self.user.name, 'Alice')
        self.assertEqual(self.user.country, 'Canada')

    def test_get_user_info(self):
        response = self.client.get(self.get_info_url)

        self.assertEqual(response.data['name'], 'OldName')
        self.assertEqual(response.data['country'], 'OldCountry')

class UserHistoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            email="test@test.com",
            password="password123",
            name="tester"
        )

        self.lang = Language.objects.create(code="fr", lang="French")
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
        self.login_url = reverse('login')

        login_payload = {
            'email': 'test@test.com',
            'password': 'password123'
        }

        login_response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('jwt', login_response.cookies)

        self.token = login_response.cookies['jwt'].value
        self.client.cookies['jwt'] = self.token

    def test_paginate_history(self):
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
        
        self.assertEqual(len(history_list), 6) # just this page has 5 
        self.assertEqual(max_page, 2)

        self.assertIn("page=2", next_page_url)
        self.assertIn("page=1", previous_page_url)

        response = self.client.get(self.get_info_url + "?page=2")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        history_list = data["history"]
        next_page_url = data["next_page_url"]
        previous_page_url = data["previous_page_url"]

        self.assertEqual(len(history_list), 4)
        self.assertIn("page=1", previous_page_url)
        self.assertIn("page=None", next_page_url)

    def test_get_user_history(self):
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