import os
import uuid
import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from django.conf import settings
from django.http import FileResponse
from fango.models import UserHistory, AppUser, Translation, Word, Language
from .services.openai_service import get_translation

class ImageTranslate(APIView):

     def post(self, request):

          uploaded_file = request.FILES.get("file")

          target_lang = request.POST.get("target_lang").lower()
          target_lang_code = request.POST.get("target_lang_code").lower()

          if not target_lang:
               return Response({"error":"Missing target language"}, status=status.HTTP_400_BAD_REQUEST)
        
          if not uploaded_file:
               return Response({"error":"No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
          elif not uploaded_file.content_type.startswith("image/"):
               return Response({"error":"Uploaded file is not an image"}, status=status.HTTP_400_BAD_REQUEST)
        
          user_id = self.get_current_user(request)
          if not user_id:
               return Response({"error":"Invalid or missing authentication token"}, status=status.HTTP_401_UNAUTHORIZED)

          # Get folder path
          save_folder = os.path.join(settings.MEDIA_ROOT, "images")

          try:
               os.makedirs(save_folder, exist_ok=True)

               # Save picture to volume
               filename = f"{uuid.uuid4().hex}_{uploaded_file.name}"
               save_path = os.path.join(save_folder, filename)
               with open(save_path, 'wb+') as destination:
                    for chunk in uploaded_file.chunks():
                         destination.write(chunk)
          
          except OSError as e:
               return Response({"error": f"Failed to save file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

          db_path = os.path.join("images", filename)

          # Get user and translation
          try:
               user = AppUser.objects.get(id=user_id)
          except AppUser.DoesNotExist:
               return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

          try:
               translation_data = get_translation(save_path, target_lang)
          except Exception as e:
               return Response({"error":f"Failed to get translation: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
          
          if not translation_data:
               return Response({"error":"No translation returned"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

          try:
               translation = self.store_word_and_translation(translation_data, target_lang_code)
          except Exception as e:
               return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

          # Save image to userhistory in database
          try:
               user_history = UserHistory.objects.create(
                    img_name = uploaded_file.name,
                    img_path = db_path,
                    translation_id = translation,
                    user_id = user
               )
          except Exception as e:
               return Response({"error": "Failed to save user history"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

          return Response({
               "user_history_id": user_history.id
          }, status=status.HTTP_201_CREATED)
    
     # Get current user id from jwt token in request header
     def get_current_user(self, request):
          SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')
          token = request.COOKIES.get("jwt")
          if not token:
               return None
          try:
               payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
               user_id = payload.get("id")

               return user_id
          except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
               return None
     
     # Store word row and translation row for the data and returns the newly saved translation object
     def store_word_and_translation(self, data, target_lang_code):

          # Check to see if all translations present
          data_keys = [
               "english", "meaning", "translated", "translated-sentence-easy", "english-sentence-easy",
               "translated-sentence-med", "english-sentence-med","translated-sentence-hard", "english-sentence-hard"
          ]

          missing_keys = [keys for keys in data_keys if keys not in data]
          if missing_keys:
               raise ValueError("Missing data keys")


          try: 
               word = Word.objects.create(
                    label_en = data["english"],
                    meaning = data["meaning"]
               )
               
               translation = Translation.objects.create(
                    label_target = data["translated"],
                    example_target_easy = data["translated-sentence-easy"],
                    example_en_easy = data["english-sentence-easy"],
                    example_target_med = data["translated-sentence-med"],
                    example_en_med = data["english-sentence-med"],
                    example_target_hard = data["translated-sentence-hard"],
                    example_en_hard = data["english-sentence-hard"],
                    target_lang_id = Language.objects.get(code=target_lang_code),
                    word_id = word
               )
          except Exception as e:
               raise ValueError("Failed to save translation")
          
          return translation
         
    

class ServeImage(APIView):
     def get(self, request, filename):
          file_path = os.path.join(settings.MEDIA_ROOT, "images", filename)
          if os.path.exists(file_path):
               return FileResponse(open(file_path, "rb"))
          return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
