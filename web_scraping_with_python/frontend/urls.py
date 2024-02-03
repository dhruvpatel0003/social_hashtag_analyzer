from django.urls import path
from .views import index

urlpatterns = [
   path('',index),
   path('login',index),
   path('signup',index),
   path('search',index),
   path('user-profile',index),
   path('dashboard',index),
   path('search-hashtag/<str:hashtag>',index),
]
