from django.utils import timezone
import uuid

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfile(models.Model):
    user_id = models.CharField(max_length=100,null=True)
    profile_photo_url = models.URLField(null=True, blank=True)

class AnalysisReport(models.Model):
    user = models.CharField(max_length=100,null=False)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.user_id} - {self.url}'

class SubScription(models.Model):
    subscription_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    subscription_amount = models.CharField(max_length=100,null=True)
    subscription_date = models.CharField(max_length=100,null=True)
    subscription_expires_date = models.CharField(max_length=100,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
class User(models.Model):

    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email=models.EmailField(max_length=100,unique=True)
    password = models.CharField(max_length=100)
    phone_number= models.CharField(max_length=10,unique=True)
    subscription_status = models.ManyToManyField(SubScription, related_name='subscription_status')

        
class YouTubeProfile(models.Model):
    current_date = models.CharField(max_length=100,null=True)
    views_count = models.IntegerField(default=0,null=True)
    subscription_count = models.IntegerField(default=0,null=True)
    video_count = models.IntegerField(default=0,null=True)
    
class YouTubeStats(models.Model):
    name = models.CharField(max_length=50,null=True)
    current_status = models.ManyToManyField(YouTubeProfile, related_name='youtube_profile')
    
class InstagramProfile(models.Model):
    current_date = models.CharField(max_length=100,null=True)
    followers = models.CharField(max_length=20,null=True)
    followings = models.CharField(max_length=20,null=True)
    posts = models.IntegerField(default=0,null=True)
    
    
class InstagramStats(models.Model):
    current_status = models.ManyToManyField(InstagramProfile, related_name='instagram_profile')
    
class Comment(models.Model):
    text = models.CharField(max_length=1000,null=True)
    url = models.CharField(max_length=1000,null=True)
    comments = models.CharField(max_length=1000,null=True)
    likes = models.IntegerField(default=0,null=True)
    retweets = models.IntegerField(default=0,null=True)
    comment_date = models.CharField(max_length=100,null=True)
    

    def save(self, *args, **kwargs):
         if not self.comment_date:
            self.comment_date = timezone.now().date()
         super().save(*args, **kwargs)

class TwitterProfile(models.Model):
    current_date = models.CharField(max_length=100,null=True)
    followers = models.CharField(max_length=20,null=True)
    followings = models.CharField(max_length=20,null=True)

class TwitterStats(models.Model):
    current_status = models.ManyToManyField(TwitterProfile, related_name='twitter_profile')
    comments = models.ManyToManyField(Comment, related_name='twitter_comments')   
    joining_date = models.DateField(default=timezone.now,null=True)
    def save(self, *args, **kwargs):
         if not self.joining_date:
            self.joining_date = timezone.now().date()
         super().save(*args, **kwargs)
class History(models.Model):   
        user = models.CharField(max_length=100)
        history = models.JSONField()
        
        def __str__(self):
            return f"{self.user} - Search History"
    
class HashTagStats(models.Model):

    youtube_stats = models.ForeignKey(YouTubeStats, related_name='youtube_stats', on_delete=models.CASCADE, null=True, blank=True)
    instagram_stats = models.ForeignKey(InstagramStats, related_name='instagram_stats', on_delete=models.CASCADE, null=True, blank=True)
    twitter_stats = models.ForeignKey(TwitterStats, related_name='twitter_stats', on_delete=models.CASCADE, null=True, blank=True)
    
    
class HashTag(models.Model):
    hashtag = models.CharField(max_length=100, blank=True, null=True)
    hashtag_stats = models.ManyToManyField(HashTagStats, related_name='hashtags')

