from rest_framework_jwt.settings import api_settings
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer, MessagesSerializer
from .models import Messages, Rooms
import jwt
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
import urllib.parse as urlparse
from django.db.models import Q
import uuid

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

        user_obj = User.objects.filter(email=request.data['username']).first() or User.objects.filter(username=request.data['username']).first()

        if user_obj is not None:
            credentials = {
                'username':user_obj.username,
                'password': request.data['password']
            }
            user = authenticate(**credentials)

            if user and user.is_active:
                payload = jwt_payload_handler(user)
                #other_users = GetOtherUsers(user.id)
                rooms = getRooms(user.id)
                return Response({
                    'token': jwt_encode_handler(payload),
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_id': user.id,
                    'rooms':rooms,
                    }, status=200)

        return Response({"msg": 'Unable to log in with provided credentials.'}, status=400)

    # This function uses the same serializer as above but instead of
    # creating a new user object, it verifies the user via JWT token
    def get(self, request, format=None):
        user_data = UserSerializer(request.user)
        #list_users = GetOtherUsers(user_data.data['id'])
        rooms = getRooms(user_data.data['id'])

        if user_data:
            return Response({
                'user': user_data.data,
                'rooms':rooms,
            }, status=200)
        else:
            return Response({
                'message':'User Not Found'
            }, status=404)

def getRooms(userID):

    rooms = []
    if userID != None:

        rooms_found = Rooms.objects.filter( Q(member_0=userID)
        | Q(member_1=userID)
        | Q(member_2=userID)
        | Q(member_3=userID)
        | Q(member_4=userID)
        | Q(member_5=userID)
        | Q(member_6=userID)
        )
        for room in rooms_found:
            room_info = [str(room.id),
                [room.member_0.id, room.member_0.first_name, room.member_0.last_name, room.member_0.email],
                ]

            room_info.append([room.member_1.id, room.member_1.first_name, room.member_1.last_name, room.member_1.email]) if room.member_1 is not None else None
            room_info.append([room.member_2.id, room.member_2.first_name, room.member_2.last_name, room.member_2.email]) if room.member_2 is not None else None
            room_info.append([room.member_3.id, room.member_3.first_name, room.member_3.last_name, room.member_3.email]) if room.member_3 is not None else None
            room_info.append([room.member_4.id, room.member_4.first_name, room.member_4.last_name, room.member_4.email]) if room.member_4 is not None else None
            room_info.append([room.member_5.id, room.member_5.first_name, room.member_5.last_name, room.member_5.email]) if room.member_5 is not None else None
            room_info.append([room.member_6.id, room.member_6.first_name, room.member_6.last_name, room.member_6.email]) if room.member_6 is not None else None

            rooms.append(room_info)
        return(rooms)

def authenticateUser(token):
    jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
    jwt_get_username_from_payload = api_settings.JWT_PAYLOAD_GET_USERNAME_HANDLER

    msg = None
    payload = None
    user = None

    if token is None:
        return(None, "Token Not Present")
    try:
        payload = jwt_decode_handler(token)

    except jwt.ExpiredSignature:
        return(None, 'Signature has expired.')
    except jwt.DecodeError:
        return(None, 'Error decoding signature.')
    except jwt.InvalidTokenError:
        return(None, 'Invalid Token')

    if payload != None:
        username = jwt_get_username_from_payload(payload)
        if not username:
            return(None, 'Invalid payload.')
        try:
            user = User.objects.get_by_natural_key(username)
            return(user, None)
        except User.DoesNotExist:
            return(None, 'Invalid signature.')
        if not user.is_active:
            return(None, 'User account is disabled.')

'''
def GetOtherUsers(user_id):
            list_users = []
            other_users = Messages.objects.filter(author=user_id)
            for user in other_users:
                user_info = [user.user_id.id, f"{user.user_id.first_name} {user.user_id.last_name}", user.user_id.email]
                if user_info not in list_users:
                    list_users.append(user_info)

            other_users = Messages.objects.filter(user_id=user_id)
            for user in other_users:
                user_info = [user.from_user.id, f"{user.from_user.first_name} {user.from_user.last_name}", user.from_user.email]
                if user_info not in list_users:
                    list_users.append(user_info)

            return(list_users)

class MessagesView(APIView):
    def post(self, request, pk, format=None):
        user_data = UserSerializer(request.user)
        if user_data.data['id'] != pk or user_data.data['email'] != request.data['from_user']:
            return Response({"message": "Unauthorized"}, status=401)


        to_user = User.objects.filter(email=request.data['to_user']).first()

        if to_user:
            serializer_data = {'user_id': to_user.id, 'from_user':user_data.data['id'], 'text':request.data["text"]}
            serializer = MessagesSerializer(data=serializer_data)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message":serializer.data}, status=201)

        return Response({"message": serializer.errors}, status=400)


    def get(self, request, pk, to_email, format=None):

        # list: ToUser, FromUser, Time, Text
        list_messages = []
        to_user = User.objects.filter(email=to_email).first()

        if to_user:
            messages = Messages.objects.filter(user_id=to_user.id, from_user=pk).order_by('-id')[:20]
            for message in messages:

                list_messages.append([f"{message.user_id.first_name} {message.user_id.last_name}" , message.from_user.id, message.time, message.text])

            return_messages = Messages.objects.filter(user_id=pk, from_user=to_user.id).order_by('-id')[:20]
            for message in return_messages:
                list_messages.append([message.user_id.id, f"{message.from_user.first_name} {message.from_user.last_name}", message.time, message.text])


            list_messages = sorted(list_messages, key=lambda x: x[2])


        return Response({"messages":list_messages}, status=201)

        '''


class ChatConsumer(WebsocketConsumer):

    def init_chat(self, data):
        params = urlparse.parse_qs(self.scope['query_string'].decode('utf8'))
        token = params.get('token',('',))[0]
        user, msg = authenticateUser(token)

        if user == None:
            content = {
            'command': 'error',
            'message': msg
            }
            self.send_message(content)

        rooms = getRooms(user.id)
        print(rooms)
        content = {
            'command': 'init_chat',
            'message': 'success',
            'rooms':rooms
            }
        self.send_message(content)

    def fetch_messages(self, data):
        params = urlparse.parse_qs(self.scope['query_string'].decode('utf8'))
        token = params.get('token',('',))[0]

        user, msg = authenticateUser(token)

        if user == None:
            content = {
            'command': 'error',
            'message': msg
            }
            self.send_message(content)

        room_id = data['room_id']

        room_messages = Messages.objects.filter(room_id=uuid.UUID(room_id).hex)
        messages = []

        for message in room_messages:
            message = [room_id,
                message.author.email,
                message.message,
                str(message.created_at),
                ]
            messages.append(message)

        print(messages)
        content = {
        'command': 'message',
        'messages': messages
        }
        self.send_message(content)




    def new_message(self, data):
        params = urlparse.parse_qs(self.scope['query_string'].decode('utf8'))
        token = params.get('token',('',))[0]

        user, msg = authenticateUser(token)

        if user == None:
            content = {
            'command': 'error',
            'message': msg
            }
            self.send_message(content)

        serializer_data = {'room_id': data['room_id'],
            'author': user.id,
            'message': data['text'],
            }
        print(serializer_data)

        serializer = MessagesSerializer(data=serializer_data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            print("SUCCESSFUL")

        message = [data['room_id'],
            user.email,
            data['text'],
            str(serializer.data['created_at']),
        ]

        print(message)

        content = {
            'command': 'new_message',
            'message': message
        }
        self.send_chat_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': str(message.id),
            'author': message.author.username,
            'content': message.content,
            'created_at': str(message.created_at)
        }

    commands = {
        'init_chat': init_chat,
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        params = urlparse.parse_qs(self.scope['query_string'].decode('utf8'))
        token = params.get('token',('',))[0]
        user, msg = authenticateUser(token)

        rooms = getRooms(user.id)

        self.room_name = user.id

        for room in rooms:
            # Join room group
            async_to_sync(self.channel_layer.group_add)(
                str(room[0]),
                self.channel_name
                )
            print("Connected to", str(room[0]))
        self.accept()

    def disconnect(self, close_code):
        # leave group room
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name,
            self.channel_name
        )

    def receive(self, text_data):
        print("Received")
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            message['message'][0],
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))


    pass
