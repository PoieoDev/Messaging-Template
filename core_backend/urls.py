from django.urls import path

from .views import UserAccountView, UserLoginView
from rest_framework_jwt.views import refresh_jwt_token, verify_jwt_token

urlpatterns = [
    # update-user/<int:pk> URL not currently active
    path('update-user/<int:pk>', UserAccountView.as_view()),
    path('create-user/', UserAccountView.as_view()),
    path('verify-user', UserLoginView.as_view()),
    path('login-user/', UserLoginView.as_view()),
    path('token-refresh/', refresh_jwt_token),
    path('token-verify/', verify_jwt_token),
]
