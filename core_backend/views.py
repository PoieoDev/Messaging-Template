from rest_framework_jwt.settings import api_settings
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer

class UserAccountView(APIView):

    # Registration Class. Data is sent to this function which
    # is then validated and saved in a user object via a serializer
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid(raise_exception=False):
            serializer.save()
            return Response({"user":serializer.data}, status=201)

        return Response({"user": serializer.errors}, status=400)

    # This function will be added soon. Use this function to update
    # a user object via serializer:
    # UserSerializer(USER_OBJECT, data=request.data)
    def put(self, request, pk, format=None):
        return Response({}, status=404)

# This class is currently used for Logging in via Username/password
# and via Token
class UserLoginView(APIView):
    # This class verifies username/password and returns token/user data
    def post(self, request, format=None):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
        jwt_get_username_from_payload = api_settings.JWT_PAYLOAD_GET_USERNAME_HANDLER

        user_obj = User.objects.filter(email=request.data['username']).first() or User.objects.filter(username=request.data['username']).first()

        if user_obj is not None:
            credentials = {
                'username':user_obj.username,
                'password': request.data['password']
            }
            user = authenticate(**credentials)

            if user and user.is_active:
                payload = jwt_payload_handler(user)
                return Response({
                    'token': jwt_encode_handler(payload),
                    'first_name': user.first_name,
                    }, status=200)

        return Response({"msg": 'Unable to log in with provided credentials.'}, status=400)

    # This function uses the same serializer as above but instead of
    # creating a new user object, it verifies the user via JWT token
    def get(self, request, format=None):
        user_data = UserSerializer(request.user)

        return Response({
                'user': user_data.data,
            }, status=200)
