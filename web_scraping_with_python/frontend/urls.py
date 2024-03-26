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
   path('analysis',index),
   path('forgot-password',index),
   path('reset-password/<str:email>/<str:token>',index),
   path('view-reports',index),
   path('upload-file-to-analysis',index),
   path('analysis/<str:hashtag>',index)
]
