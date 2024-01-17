from django.urls import path
from .views import index

urlpatterns = [
   path('',index),
   path('login',index),
   path('signup',index),
   path('user-profile/<str:user_id>',index)
]
