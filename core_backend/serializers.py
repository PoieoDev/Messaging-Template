from rest_framework.validators import UniqueValidator
from rest_framework_jwt.settings import api_settings
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ExtendedUser, Messages, Rooms

class ExtUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=ExtendedUser
        fields = ('user_type', 'date_joined', 'updated_on',)


class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Messages
        fields = ('room_id', 'author', 'created_at', 'message',)


class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Messages
        fields = ('id', 'member_0', 'member_1', 'member_2', 'member_3', 'member_4', 'member_5', 'member_6')


class UserSerializer(serializers.ModelSerializer):
    extUser = ExtUserSerializer()
    token = serializers.SerializerMethodField()
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        required=True,
        max_length=32,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    first_name = serializers.CharField(
        required=True,max_length=32)
    last_name = serializers.CharField(
        required=True,max_length=32)
    password = serializers.CharField(
        required=True,min_length=8, write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        ext_user = validated_data.pop('extUser')
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        ExtendedUser.objects.create(user=instance, **ext_user)
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password', 'first_name', 'last_name', 'email', 'id', 'extUser')
