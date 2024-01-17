from django.urls import path
from .views import CreateUserView, GetUser, UserView

urlpatterns = [
    path('user',UserView.as_view()),
    path('create-user',CreateUserView.as_view()),
    path('get-user',GetUser.as_view()),
]
