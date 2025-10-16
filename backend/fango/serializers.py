from rest_framework import serializers
from .models import AppUser, UserHistory

class AppUserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = AppUser
        fields = ['email', 'name', 'password', 'role', 'status', 'created_at', 'last_login_at'] 


    def create(self, validated_data):
        user = AppUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    