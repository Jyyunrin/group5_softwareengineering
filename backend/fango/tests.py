from django.test import TestCase
from views import LoginView
from models import AppUser
from rest_framework.exceptions import AuthenticationFailed

# Create your tests here.
class CITest(TestCase):
    def test_ci_runs(self):
        self.assertEqual(1, 1)

class TestAuthenicateUser(TestCase):
    def setUp(self):
        self.service = LoginView()

        self.user = AppUser.objects.create_user(
            email="test@example.com",
            password="correctpassword",
            status="active"
        )

        self.banned_user = AppUser.objects.create_user(
            email="banned@example.com",
            password="somepassword",
            status="banned"
        )

    def test_user_not_found(self):
        with self.assertRaisesMessage(AuthenticationFailed, 'User not found!'):
            self.service.authenticate_user("doesnotexist@example.com", "password")