import os
from .serializers import AppUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import AppUser, UserHistory, Language
from .redis_client import redis_client
import jwt, datetime
from django.http import JsonResponse
from rest_framework import status
from .utils import authenticate_user

SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

class RegisterView(APIView):
    def post(self, request):
        serializer = AppUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = self.authenticate_user(email, password)
        token = self.generate_JWT(user)
        self.store_session_in_redis(user, token)
        self.update_last_time_logged_in(user)
        response = self.create_login_response(token)

        return response
        
    def authenticate_user(self, email, password):
        user = AppUser.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        
        if user.status == "banned":
            raise AuthenticationFailed("User account inactive or banned")

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')
        
        return user
    
    def generate_JWT(self, user):
        # payload for JWT token. Set to expire in 60 minutes
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        return jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    
    def store_session_in_redis(self, user, token):
        # create redis session mapped to unique ID
        current_time = timezone.now()
        ttl_seconds = 60 * 60   # 60 minutes TTL
        redis_client.hset(f"user:{user.id}:session",
        mapping={
            "jwt": token,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "status": user.status,
            "country": user.country,
            "default_lang_id": user.default_lang_id_id if user.default_lang_id_id else "",
            "difficulty": user.difficulty,
            "created_at": user.created_at.isoformat() if user.created_at else current_time.isoformat(),
            "last_login_at": current_time.isoformat()
        })
        redis_client.expire(f"user:{user.id}:session", ttl_seconds)

    def create_login_response(self, token):
        # create HTTP response
        response = Response()
        ttl_seconds = 60 * 60
        response.set_cookie(key='jwt', value=token, httponly=True, secure=True, samesite='None', path='/', max_age=ttl_seconds)
        response.data = {
            "jwt": token,
            "success": True
        }
        return response
    
    def update_last_time_logged_in(self, user):
        # updating last time logged in
        user.last_login_at = timezone.now()
        user.save(update_fields=["last_login_at"])

class LogoutView(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        self.revoke_reddis_session(token)
        response = self.create_logout_response()

        return response
    
    def revoke_reddis_session(self, token):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['id']
            redis_client.hset(f"user:{user_id}:session", "jwt", "revoked")
        except jwt.ExpiredSignatureError:
            pass
        
    def create_logout_response(self):    
        response = Response()
        response.delete_cookie('jwt') # cookie removed from browser
        response.data = {
            'message': "success"
        }
        return response

class UpdateUserInfo(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')
        user = authenticate_user(token)
        
        username = request.data.get('new_username')
        country = request.data.get('new_country')

        success = self.update_user_info(user, username, country)

        if success:
            data = {'message': 'Successfully updated information!'}
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            data = {'message': 'Failed to update data.'}
            return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
    def update_user_info(self, user, username, country):
        try:
            user.name = username
            user.country = country
            user.save()
            redis_client.hset(
                f"user:{user.id}:session",
                mapping={
                    "name": username,
                    "country": country
                }
            )
            return True
        except Exception as e:
            return False

class GetUserInfo(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        user = authenticate_user(token)

        default_lang = self.set_default_language(user)
        response = self.build_user_info_response(user, default_lang)
        return response
    
    def build_user_info_response(self, user, default_lang):
        response = Response()
        response.data = {
            'email': user.email,
            'default_language': default_lang,
            'country': user.country,
            'name': user.name,
        }
        return response
    
    def set_default_language(self, user):
        if user.default_lang_id is not None:
            default_lang = user.default_lang_id.lang
        else:
            default_lang = ""
        return default_lang
        
class GetUserHistory(APIView):
    # subject to change
    page_size = 6
    base_url = "http://localhost:8000/api/get_user_history/"

    def get(self, request):
        token = request.COOKIES.get('jwt')
        user = authenticate_user(token)

        # get query params from request
        language_filter = request.query_params.get('language_filter', None)
        page = request.query_params.get('page', 1)

        queryset = UserHistory.objects.filter(user_id=user) # gets all userhistory items for that user
        paginated_data, next_page_url, previous_page_url, max_page = self.paginate_history_item(queryset, page, language_filter)

        response = self.create_user_history_response(paginated_data, next_page_url, previous_page_url, max_page)
        return response
    
    def serialize_history(self, user_history):
        return {
            'id': user_history.id,
            'word_english': user_history.translation_id.word_id.label_en,
            'language': user_history.translation_id.target_lang_id.lang,
            'word_translated': user_history.translation_id.label_target,
            'created_at': user_history.created_at,
            'is_favorite': user_history.is_favorite,
            'image_url': user_history.img_path
        }
    
    def paginate_history_item(self, queryset, page, language_filter):
        if language_filter:
            queryset = queryset.filter(translation_id__target_lang_id__lang=language_filter)

        total_items = queryset.count()
        max_page = max((total_items - 1) // self.page_size + 1, 1)

        page = min(max(int(page), 1), max_page)
        lower_bound = (page - 1) * self.page_size
        upper_bound = lower_bound + self.page_size

        subset = queryset[lower_bound:upper_bound]   

        history_list = [self.serialize_history(item) for item in subset] 

        next_page = int(page) + 1 if page < max_page else None
        previous_page = max(int(page) - 1, 1)

        next_page_url = f"{self.base_url}?language_filter={language_filter}&page={next_page}"
        previous_page_url = f"{self.base_url}?language_filter={language_filter}&page={previous_page}"

        return history_list, next_page_url, previous_page_url, max_page
    
    def create_user_history_response(self, paginated_data, next_page_url, previous_page_url, max_page):
        response = Response()
        response.data = {
            'history': paginated_data,
            'next_page_url': next_page_url,
            'previous_page_url': previous_page_url,
            'max_page': max_page,
        }
        return response
    
class GetUserHistoryItem(APIView):
    def get(self, request, history_id):
        token = request.COOKIES.get('jwt')
        user = authenticate_user(token)

        user_history = get_object_or_404(UserHistory, id=history_id, user_id=user)
        translation = user_history.translation_id
        frontend_image_path = request.build_absolute_uri(settings.MEDIA_URL + user_history.img_path)
        userHistoryUser = user_history.user_id

        if user != userHistoryUser:
            raise PermissionDenied("Not authorized to view this item")

        data = {
            "url": frontend_image_path,
            "translation": translation.label_target.title(),
            "english": translation.word_id.label_en.title(),
            "translatedSentenceEasy": translation.example_target_easy,
            "englishSentenceEasy": translation.example_en_easy,
            "translatedSentenceMed": translation.example_target_med,
            "englishSentenceMed": translation.example_en_med,
            "translatedSentenceHard": translation.example_target_hard,
            "englishSentenceHard": translation.example_en_hard
        }
        return Response(data)

    
class UserLearningInfo(APIView):
    def get(self, request):
        lang_dict = self.get_all_languages()
        response = Response()
        response.data = {"languages": lang_dict}

        if getattr(request, "user_info", None):
            response.data["user_info"] = request.user_info
    
        return response
    
    def get_all_languages(self):
        languages = Language.objects.all()
        return {lang.code: lang.lang for lang in languages}

    def post(self, request):
        token = request.COOKIES.get('jwt')
        user = authenticate_user(token)
        
        # parse request
        default_lang_name = request.data.get("defaultLang")
        default_lang = Language.objects.get(lang=default_lang_name)
        difficulty = request.data.get("difficulty")

        self.update_user_settings(user, default_lang, difficulty)

        self.update_redis_info(user)

        response = self.build_learning_info_response()
        return response
    
    def build_learning_info_response(self):
        response = Response()
        response.data = {
            'message': "success"
        }
        return response
    
    def update_redis_info(self, user):
        redis_client.hset(
            f"user:{user.id}:session",
            mapping={
                "default_lang_id": user.default_lang_id_id if user.default_lang_id_id else "",
                "difficulty": user.difficulty,
            }
        )
    
    def update_user_settings(self, user, default_lang, difficulty):
        if default_lang:
            user.default_lang_id_id = default_lang.pk

        if difficulty:
            user.difficulty = difficulty

        user.save(update_fields=["default_lang_id_id", "difficulty"])

class AuthCheck(APIView):
    def get(self, request):
        response = Response()
        response.data = {
            'message': "success"
        }
        return response