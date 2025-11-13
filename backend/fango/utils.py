import jwt
from django.conf import settings
import os
from .models import AppUser

SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

def get_user_id_from_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload.get('id')
    except jwt.ExpiredSignatureError:
        return None
    
def get_user_by_id(user_id):
    try:
        return AppUser.objects.get(id=user_id)
    except AppUser.DoesNotExist:
        return None