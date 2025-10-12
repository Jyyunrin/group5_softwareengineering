import os
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from django.conf import settings
from django.http import FileResponse
from fango.models import UserHistory, AppUser, Translation

class ImageTranslate(APIView):

    def post(self, request):

        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"error":"No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        elif not uploaded_file.content_type.startswith("image/"):
                return Response({"error:Uploaded file is not an image"}, status=status.HTTP_400_BAD_REQUEST)
        
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
        user = AppUser.objects.get(id=1)
        translation = Translation.objects.get(id=1)
        

        # Save image to userhistory in database
        user_history = UserHistory.objects.create(
             img_name = uploaded_file.name,
             img_path = db_path,
             translation_id = translation,
             user_id = user
        )

        return Response({
             "filename": filename,
             "db_path": db_path,
             "url": frontend_path,
             "translation": "Banana"
        }, status=status.HTTP_200_OK)
    

class ServeImage(APIView):
    def get(self, request, filename):
        file_path = os.path.join(settings.MEDIA_ROOT, "images", filename)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, "rb"))
        return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
