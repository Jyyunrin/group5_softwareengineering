from django.urls import path, include
from rest_framework import routers
from .views import ImageTranslate

router = routers.DefaultRouter()

urlpatterns = [
    path('image-translate/', ImageTranslate.as_view(), name="image-translate")
]
