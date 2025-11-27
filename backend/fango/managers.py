from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def create_user(self, name, email, password, default_lang_id, **extra_fields):
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(name=name, email=email, default_lang_id=default_lang_id, **extra_fields)
        user.set_password(password)
        user.save()
        return user