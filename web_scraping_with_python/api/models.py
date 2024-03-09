import base64
from django.utils import timezone
import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile


# class AnalysisReport(models.Model):
#     user = models.CharField(max_length=100,null=False)
#     url = models.URLField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f'{self.user.user_id} - {self.url}'
   
class SubScription(models.Model):
    subscription_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    subscription_amount = models.CharField(max_length=100,null=True)
    subscription_date = models.CharField(max_length=100,null=True)
    subscription_expires_date = models.CharField(max_length=100,null=True)
    created_at = models.DateTimeField(auto_now_add=True)

def generate_filename(instance, filename):
    extension = filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{extension}"
    return f"profile_photos/{unique_filename}"

# class User(models.Model):

#     user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
#     email=models.EmailField(max_length=100,unique=True)
#     password = models.CharField(max_length=100)
#     phone_number= models.CharField(max_length=10,unique=True)
#     subscription_status = models.ManyToManyField(SubScription, related_name='subscription_status')
#     profile_photo = models.TextField(null=True, blank=True)
    
#     def save_base64_image(self, base64_image):
#         self.profile_photo = base64_image
#         self.save()

#     def get_base64_image(self):
#         return self.profile_photo

class User(models.Model):
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=10, unique=True)
    subscription_status = models.ManyToManyField(SubScription, related_name='subscription_status')
    profile_photo = models.FileField(upload_to=generate_filename, null=True, blank=True)

    def save_base64_image(self, base64_image):
        # Decode the base64 image string
        decoded_image = base64.b64decode(base64_image)

        # Save the decoded image content to the FileField
        self.profile_photo.save(self.generate_unique_filename(), ContentFile(decoded_image), save=False)
        self.save()

    def generate_unique_filename(self):
        extension = "png"  # You can adjust the extension based on the image type
        return f"{uuid.uuid4()}.{extension}"

    def get_image_url(self):
        return self.profile_photo.url if self.profile_photo else None
    
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

class ReportData(models.Model):
    # report_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    hashtag = models.CharField(max_length=255)
    hashtag_stats = models.ManyToManyField(HashTagStats, related_name='hashtag_stat')
    def __str__(self):
        return f'ReportData - Hashtag: {self.hashtag}'
    
# class AnalysisReport(models.Model):
#     user_id = models.CharField(max_length=100)
#     report_data = models.ManyToManyField(ReportData, related_name='analysis_reports')

#     def __str__(self):
#         return f'AnalysisReport for User ID: {self.user_id}'

class AnalysisReport(models.Model):
    user_id = models.CharField(max_length=100)
    report_data = models.ManyToManyField(ReportData, related_name='analysis_reports')
    
    def __str__(self):
        return f'AnalysisReport for User ID: {self.user_id}'

    # def add_report_data(self, report_data):
    #     self.report_data.add(report_data)
    #     return self

