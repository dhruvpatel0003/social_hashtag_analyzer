from django.utils import timezone
import uuid

from django.db import models


class User(models.Model):

    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email=models.EmailField(max_length=100,unique=True)
    password = models.CharField(max_length=15,unique=True)
    phone_number= models.CharField(max_length=10,unique=True)
    subscription_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
        
class YouTubeStats(models.Model):
    name = models.CharField(max_length=50,null=True)
    views_count = models.IntegerField(default=0,null=True)
    subscription_count = models.IntegerField(default=0,null=True)
    video_count = models.IntegerField(default=0,null=True)



class InstagramStats(models.Model):
    followers = models.CharField(max_length=20,null=True)
    followings = models.CharField(max_length=20,null=True)
    posts = models.IntegerField(default=0,null=True)

class Comment(models.Model):
    likes = models.IntegerField(default=0,null=True)
    retweets = models.IntegerField(default=0,null=True)
    comment_date = models.DateField(default=timezone.now,null=True)

    def save(self, *args, **kwargs):
         if not self.comment_date:
            self.comment_date = timezone.now().date()
         super().save(*args, **kwargs)
class TwitterStats(models.Model):
    followers = models.CharField(max_length=20,null=True)
    followings = models.CharField(max_length=20,null=True)
    comments = models.ManyToManyField(Comment, related_name='twitter_comments')

    joining_date = models.DateField(default=timezone.now,null=True)
    def save(self, *args, **kwargs):
         if not self.joining_date:
            self.joining_date = timezone.now().date()
         super().save(*args, **kwargs)
    # comment_date = models.DateField()
    # comments = models.OneToOneField(Comment, related_name='twitter_comments', on_delete=models.CASCADE, null=True, blank=True)
    # comments = models.ManyToManyField(Comment, related_name='twitter_comments')


class HashTagStats(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    youtube_stats = models.ForeignKey(YouTubeStats, related_name='youtube_stats', on_delete=models.CASCADE, null=True, blank=True)
    instagram_stats = models.ForeignKey(InstagramStats, related_name='instagram_stats', on_delete=models.CASCADE, null=True, blank=True)
    twitter_stats = models.ForeignKey(TwitterStats, related_name='twitter_stats', on_delete=models.CASCADE, null=True, blank=True)
    
    
class HashTag(models.Model):
    hashtag = models.CharField(max_length=100, blank=True, null=True)
    hashtag_stats = models.ManyToManyField(HashTagStats, related_name='hashtags')
