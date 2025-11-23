from rest_framework import serializers
from .models import AppUser, UserHistory, Language

class AppUserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)
    default_lang_id = serializers.PrimaryKeyRelatedField(
            queryset=Language.objects.all(),
            many=False)

    class Meta:
        model = AppUser
        fields = ['email', 'name', 'password', 'role', 'status', 'created_at', 'last_login_at', 'default_lang_id'] 


    def create(self, validated_data):
        user = AppUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            default_lang_id=validated_data['default_lang_id']
        )
        return user
