from datetime  import datetime
from rest_framework import serializers
from .models import AnalysisReport, HashTag, History, InstagramProfile, SubScription, TwitterProfile, User, HashTagStats, YouTubeProfile, YouTubeStats, InstagramStats, TwitterStats, Comment


class AnalysisReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisReport
        fields = '__all__'    
class SubScriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubScription
        fields = ['subscription_id', 'subscription_amount', 'subscription_date', 'subscription_expires_date', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    subscription_status = SubScriptionSerializer(many=True, allow_empty=True, required=False)

    class Meta:
        model = User
        fields = ['user_id', 'email', 'password', 'phone_number', 'subscription_status','profile_photo']

class CreateUserSerializer(serializers.ModelSerializer):
    subscription_status = SubScriptionSerializer(many=True, allow_empty=True, required=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'phone_number', 'subscription_status']
class YouTubeSerializer(serializers.ModelSerializer):
    class Meta:
        model = YouTubeProfile
        fields = ['current_date','views_count', 'subscription_count', 'video_count']


class YouTubeStatsSerializer(serializers.ModelSerializer):
    
    current_status = YouTubeSerializer(many=True,allow_empty=True, required=False)
    class Meta:
        model = YouTubeStats
        fields = ['name','current_status']

from .models import HashTagStats    


class InstagramSerializer(serializers.ModelSerializer):
    class Meta:
        model=InstagramProfile
        fields = ['current_date','followers','followings','posts']


class InstagramStatsSerializer(serializers.ModelSerializer):
    current_status = InstagramSerializer(many=True,allow_empty=True, required=False)
    class Meta:
        model = InstagramStats
        fields = ['current_status']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text','url','comments','likes', 'retweets','comment_date']

class TwitterSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwitterProfile
        fields = ['current_date','followers', 'followings'] 


class TwitterStatsSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True,allow_empty=True, required=False) 
    current_status = TwitterSerializer(many=True,allow_empty=True, required=False)
    class Meta:
        model = TwitterStats
        fields = ['current_status','joining_date', 'comments']


class HashTagStatsSerializer(serializers.ModelSerializer):
    youtube_stats = YouTubeStatsSerializer()
    instagram_stats = InstagramStatsSerializer()
    twitter_stats = TwitterStatsSerializer(allow_null=True,required=False)

    class Meta:
        model = HashTagStats
        fields = ['youtube_stats', 'instagram_stats', 'twitter_stats']
        

class HashTagSerializer(serializers.ModelSerializer):
    
    hashtag_stats = HashTagStatsSerializer(many=True, read_only=True)  # Set read_only to True
        
    class Meta:
        model = HashTag
        fields = ['hashtag','hashtag_stats']

class CreateHashtagSerializer(serializers.ModelSerializer):

    hashtag_stats = HashTagStatsSerializer(many=True)

    class Meta:
        model = HashTag
        fields = ['hashtag', 'hashtag_stats']

    def create(self, validated_data):
        hashtag_stats_data = validated_data.pop('hashtag_stats')
        hashtag, created = HashTag.objects.get_or_create(hashtag=validated_data['hashtag'])

        for stats_data in hashtag_stats_data:

            youtube_stats_data = stats_data.get('youtube_stats', {})
            instagram_stats_data = stats_data.get('instagram_stats', {})
            twitter_stats_data = stats_data.get('twitter_stats', {})

            comments_data = twitter_stats_data.get('comments', [])

            youtube_stats_instance = YouTubeStats.objects.create(
                name=youtube_stats_data.get('name', ''),
            )

            youtube_profile_instances = [YouTubeProfile.objects.create(
                current_date=profile_data.get('current_date', ''),
                views_count=profile_data.get('views_count', 0),
                subscription_count=profile_data.get('subscription_count', 0),
                video_count=profile_data.get('video_count', 0),
            ) for profile_data in youtube_stats_data.get('current_status', [])]

            youtube_stats_instance.current_status.set(youtube_profile_instances)

            instagram_stats_instance = InstagramStats.objects.create()

            instagram_profile_instances = [InstagramProfile.objects.create(
                current_date=profile_data.get('current_date', ''),
                followers=profile_data.get('followers', ''),
                followings=profile_data.get('followings', ''),
                posts=profile_data.get('posts', 0),
            ) for profile_data in instagram_stats_data.get('current_status', [])]

            instagram_stats_instance.current_status.set(instagram_profile_instances)

            comments_instances = [Comment.objects.create(
                text=comment['text'],
                url=comment['url'],
                likes=comment['likes'],
                retweets=comment['retweets'],
                comments=comment['comments'],
                comment_date=comment['comment_date']
            ) for comment in comments_data]

            twitter_stats_instance = TwitterStats.objects.create(
                joining_date=twitter_stats_data.get('joining_date', ''),
            )

            twitter_profile_instances = [TwitterProfile.objects.create(
                current_date=profile_data.get('current_date', ''),
                followers=profile_data.get('followers', ''),
                followings=profile_data.get('followings', ''),
            ) for profile_data in twitter_stats_data.get('current_status', [])]

            twitter_stats_instance.current_status.set(twitter_profile_instances)
            twitter_stats_instance.comments.set(comments_instances)

            stats = HashTagStats.objects.create(
                youtube_stats=youtube_stats_instance,
                instagram_stats=instagram_stats_instance,
                twitter_stats=twitter_stats_instance,
            )

            hashtag.hashtag_stats.add(stats)

        return hashtag

class UserHistorySerializer(serializers.ModelSerializer):
    
    user = serializers.CharField(max_length=255)
    history = serializers.DictField(child=serializers.ListField(child=serializers.CharField()))
    
    class Meta:
        model = History
        fields = ['user', 'history']
    
    def create(self, validated_data):
        print("inside the create method of UserHistorySerializer")
        return History.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.user_id = validated_data.get('user', instance.user)
        instance.history = validated_data.get('history', instance.history)
        instance.save()
        return instance