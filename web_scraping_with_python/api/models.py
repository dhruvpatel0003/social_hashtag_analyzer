from django.utils import timezone
import uuid

from django.db import models


class User(models.Model):

    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email=models.EmailField(max_length=100,unique=True)
    password = models.CharField(max_length=100)
    phone_number= models.CharField(max_length=10,unique=True)
    # subscription_status = models.BooleanField(default=False)
    subscription_amount = models.CharField(max_length=100,null=True)
    subscription_date = models.CharField(max_length=100,null=True)
    subscription_expires_date = models.CharField(max_length=100,null=True)
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
    text = models.CharField(max_length=1000,null=True)
    url = models.CharField(max_length=1000,null=True)
    comments = models.CharField(max_length=1000,null=True)
    likes = models.IntegerField(default=0,null=True)
    retweets = models.IntegerField(default=0,null=True)
    # comment_date = models.DateField(default=timezone.now,null=True)
    comment_date = models.CharField(max_length=100,null=True)
    

    def save(self, *args, **kwargs):
         if not self.comment_date:
            self.comment_date = timezone.now().date()
         super().save(*args, **kwargs)
         
# class HashtagIncludeSearch(models.Model):
#     title = models.CharField(max_length=1000,null=True)
#     text = models.CharField(max_length=1000,null=True)
#     url = models.CharField(max_length=1000,null=True)
#     # views = models.IntegerField(default=0,null=True)
#     # reposts = models.IntegerField(default=0,null=True)
#     # comment_date = models.DateField(default=timezone.now,null=True)
#     # comment_date = models.CharField(max_length=100,null=True)
    
#     def save(self, *args, **kwargs):
#          if not self.comment_date:
#             self.comment_date = timezone.now().date()
#          super().save(*args, **kwargs)
    
class TwitterStats(models.Model):
    followers = models.CharField(max_length=20,null=True)
    followings = models.CharField(max_length=20,null=True)
    comments = models.ManyToManyField(Comment, related_name='twitter_comments')
    # hashtagIncludeSearch = models.ManyToManyField(HashtagIncludeSearch, related_name='twitter_hashtagIncludeSearch')

    
    joining_date = models.DateField(default=timezone.now,null=True)
    def save(self, *args, **kwargs):
         if not self.joining_date:
            self.joining_date = timezone.now().date()
         super().save(*args, **kwargs)
    # comment_date = models.DateField()
    # comments = models.OneToOneField(Comment, related_name='twitter_comments', on_delete=models.CASCADE, null=True, blank=True)
    # comments = models.ManyToManyField(Comment, related_name='twitter_comments')

class History(models.Model):   
        user = models.CharField(max_length=100)
        history = models.JSONField()
        
        def __str__(self):
            return f"{self.user} - Search History"
    
class HashTagStats(models.Model):

    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    user = models.CharField(max_length=100)
    youtube_stats = models.ForeignKey(YouTubeStats, related_name='youtube_stats', on_delete=models.CASCADE, null=True, blank=True)
    instagram_stats = models.ForeignKey(InstagramStats, related_name='instagram_stats', on_delete=models.CASCADE, null=True, blank=True)
    twitter_stats = models.ForeignKey(TwitterStats, related_name='twitter_stats', on_delete=models.CASCADE, null=True, blank=True)
    
    
class HashTag(models.Model):
    hashtag = models.CharField(max_length=100, blank=True, null=True)
    hashtag_stats = models.ManyToManyField(HashTagStats, related_name='hashtags')

