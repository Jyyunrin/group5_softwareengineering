from django.urls import path, include
from rest_framework import routers
from .views import RegisterView, LoginView, UserView, LogoutView, GetUserHistory

router = routers.DefaultRouter()

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('user', UserView.as_view(), name='user'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('get_user_history/', GetUserHistory.as_view(), name='get_user_history'),
    path('', include('image_handling.urls')),
]
