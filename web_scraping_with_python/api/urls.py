from django.urls import path
from .views import CreateHashTag, CreateUserView, DeleteAllHashTag, DeleteHashTag, GetHashTagData, GetUser, HashTagListView, UserLogin, UserView, SearchFromChrome

urlpatterns = [
    path('user',UserView.as_view()),
    path('create-user',CreateUserView.as_view()),
    path('get-user',GetUser.as_view()),
    path('user-login',UserLogin.as_view()),
    path('delete-user',DeleteHashTag.as_view()),
    path('create-hashtag',CreateHashTag.as_view()),
    path('get-all-hashtag',HashTagListView.as_view()),
    path('get-hashtag',GetHashTagData.as_view()),
    path('delete-hashtag',DeleteAllHashTag.as_view()),
    path('search',SearchFromChrome.as_view()),
]
    