from django.urls import path

from .views import UserAccountView, UserLoginView, ChatConsumer
from rest_framework_jwt.views import refresh_jwt_token, verify_jwt_token

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

urlpatterns = [
    # update-user/<int:pk> URL not currently active
    path('update-user/<int:pk>', UserAccountView.as_view()),
    path('create-user/', UserAccountView.as_view()),
    path('verify-user/', UserLoginView.as_view()),
    path('login-user/', UserLoginView.as_view()),
    #path('send-message/<int:pk>', MessagesView.as_view()),
    #path('get-messages/<int:pk>/<str:to_email>', MessagesView.as_view()),
    path('token-refresh/', refresh_jwt_token),
    path('token-verify/', verify_jwt_token),
]



websocket_urlpatterns = [
    path('ws/', ChatConsumer),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
