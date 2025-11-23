from django.urls import path, include
from rest_framework import routers
from .views import RegisterView, LoginView, LogoutView, GetUserHistory, GetUserInfo, UpdateUserInfo, GetUserHistoryItem, UserLearningInfo, AuthCheck

router = routers.DefaultRouter()

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('get_user_history/', GetUserHistory.as_view(), name='get_user_history'),
    path('get_user_info/', GetUserInfo.as_view(), name='get_user_info'),
    path('update_user_info', UpdateUserInfo.as_view(), name='update_user_info'),
    path('', include('image_handling.urls')),
    path('get_user_history/<int:history_id>', GetUserHistoryItem.as_view(), name='get_user_history_item'),
    path('userlearninginfo', UserLearningInfo.as_view(), name='userlearninginfo'),
    path('auth', AuthCheck.as_view(), name='auth'),
]
