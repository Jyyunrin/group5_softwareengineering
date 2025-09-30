import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status

class ImageTranslate(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get("file")
        if uploaded_file:
            return Response({
                "filename": uploaded_file.name,
                "translation": "Banana"
            }, status=status.HTTP_200_OK)
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)