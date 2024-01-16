import uuid

from django.db import models


class User(models.Model):

    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email=models.EmailField(max_length=100,unique=True)
    password = models.CharField(max_length=15,unique=True)
    phone_number= models.CharField(max_length=10,unique=True)
    subscription_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
