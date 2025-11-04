from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import CustomUserManager

class Language(models.Model):
    code = models.CharField(max_length=10, primary_key=True)  # 'en', 'fr', 'es'
    lang = models.CharField(max_length=50)  # e.g., 'English', 'French', 'Spanish'

    def __str__(self):
        return self.lang
        
class AppUser(AbstractBaseUser, PermissionsMixin):

    username = None

    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('banned', 'Banned'),
    ]
    DIFFICULTIES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    ]

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50, default="Guest")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    country = models.CharField(max_length=100, default="Canada")
    default_lang_id = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)  # on_delete=models.SET_NULL sets this FK to null if the referenced object is deleted.
    difficulty = models.CharField(max_length=10, choices=DIFFICULTIES, default='medium')
    created_at = models.DateTimeField(default=timezone.now)
    last_login_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.name

class Word(models.Model):
    label_en = models.CharField(max_length=255)
    meaning = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.label_en

class Translation(models.Model):
    target_lang_id = models.ForeignKey(Language, on_delete=models.CASCADE)
    word_id = models.ForeignKey(Word, on_delete=models.CASCADE)
    label_target = models.CharField(max_length=255)
    example_target_easy = models.TextField()
    example_en_easy = models.TextField()
    example_target_med = models.TextField()
    example_en_med = models.TextField()
    example_target_hard = models.TextField()
    example_en_hard = models.TextField()
    audio_name = models.CharField(max_length=255)
    audio_path = models.CharField(max_length=255)

    class Meta:
        unique_together = ('target_lang_id', 'word_id')

    def __str__(self):
        return f"{self.label_target} ({self.target_lang_id})"

class UserHistory(models.Model):
    user_id = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    translation_id = models.ForeignKey(Translation, on_delete=models.CASCADE)
    img_name = models.CharField(max_length=255)
    img_path = models.CharField(max_length=255)
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user_id} {self.translation_id}"

class Quiz(models.Model):
    user_id = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    target_lang_id = models.ForeignKey(Language, on_delete=models.CASCADE)
    quiz_name = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=timezone.now)
    last_reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user_id', 'quiz_name')

    def __str__(self):
        return f"{self.quiz_name} ({self.user_id})"

class QuizWord(models.Model):
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    translation_id = models.ForeignKey(Translation, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('quiz_id', 'translation_id')

    def __str__(self):
        return f"{self.quiz_id} - {self.translation_id}"