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
          print("Language", target_lang)

          target_lang_code = request.POST.get("target_lang_code").lower()
          print("Code", target_lang_code)

          if not target_lang:
               return Response({"error":"Missing target language"}, status=status.HTTP_400_BAD_REQUEST)
        
          if not uploaded_file:
               return Response({"error":"No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
          elif not uploaded_file.content_type.startswith("image/"):
               return Response({"error":"Uploaded file is not an image"}, status=status.HTTP_400_BAD_REQUEST)
        
          user_id = self.get_current_user(request)

          print("UserId", user_id)
        
          print("Received files:", uploaded_file.name)
          print("Content type:", uploaded_file.content_type)
          print("Size:", uploaded_file.size, "bytes")

          # Get folder path
          save_folder = os.path.join(settings.MEDIA_ROOT, "images")
          os.makedirs(save_folder, exist_ok=True)

          # Save picture to volume
          filename = f"{uuid.uuid4().hex}_{uploaded_file.name}"
          save_path = os.path.join(save_folder, filename)
          with open(save_path, 'wb+') as destination:
               for chunk in uploaded_file.chunks():
                    destination.write(chunk)

          db_path = os.path.join("images", filename)
          frontend_path = request.build_absolute_uri(settings.MEDIA_URL + db_path)

          # Get user and translation
          user = AppUser.objects.get(id=user_id)

          translation_data = get_translation(save_path, target_lang)

          translation = self.store_word_and_translation(translation_data, target_lang_code)

          # Save image to userhistory in database
          user_history = UserHistory.objects.create(
               img_name = uploaded_file.name,
               img_path = db_path,
               translation_id = translation,
               user_id = user
          )

          return Response({
               "user_history_id": user_history.id
          }, status=status.HTTP_201_CREATED)
    
     # Get current user id from jwt token in request header
     def get_current_user(self, request):
          SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')
          print("SECRET_KEY", SECRET_KEY)
          token = request.COOKIES.get("jwt")
          print(token)
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
          
          print(data)
          print(type(data))
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
     
          return translation
         
    

class ServeImage(APIView):
     def get(self, request, filename):
          file_path = os.path.join(settings.MEDIA_ROOT, "images", filename)
          if os.path.exists(file_path):
               return FileResponse(open(file_path, "rb"))
          return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
