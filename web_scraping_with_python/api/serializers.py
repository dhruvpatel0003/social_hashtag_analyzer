from rest_framework import serializers
from .models import HashTag, User, HashTagStats, YouTubeStats, InstagramStats, TwitterStats, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'user_id', 'email', 'password', 'phone_number', 'subscription_status', 'created_at']
        # fields = ['email', 'password', 'phone_number', 'subscription_status']

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password', 'phone_number', 'subscription_status')    
class YouTubeStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = YouTubeStats
        fields = ['name', 'views_count', 'subscription_count', 'video_count']

from .models import HashTagStats    
class InstagramStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramStats
        fields = ['followers', 'followings', 'posts']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text','url','comments','likes', 'retweets','comment_date']

class TwitterStatsSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True,allow_empty=True, required=False) 

    class Meta:
        model = TwitterStats
        fields = ['followers', 'followings', 'joining_date', 'comments']


class HashTagStatsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    youtube_stats = YouTubeStatsSerializer()
    instagram_stats = InstagramStatsSerializer()
    twitter_stats = TwitterStatsSerializer(allow_null=True,required=False)

    class Meta:
        model = HashTagStats
        fields = ['user', 'youtube_stats', 'instagram_stats', 'twitter_stats']
        

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
        hashtag_instance = HashTag.objects.create(**validated_data)

        print("after getting the hastag instance",hashtag_stats_data)


        for stats_data in hashtag_stats_data:
            user = stats_data['user']
            youtube_stats_data = stats_data.get('youtube_stats')
            instagram_stats_data = stats_data.get('instagram_stats')
            twitter_stats_data = stats_data.get('twitter_stats', {})
            
            comments_data = twitter_stats_data.get('comments', {})
            
            youtube_stats_instance = YouTubeStats.objects.create(**youtube_stats_data) if youtube_stats_data else None
            instagram_stats_instance = InstagramStats.objects.create(**instagram_stats_data) if instagram_stats_data else None
            # comments_instance = Comment.objects.create(**comments_data)
            
            # twitter_stats_instance = TwitterStats.objects.create(
            #     followers=twitter_stats_data.get('followers', ''),
            #     followings=twitter_stats_data.get('followings', ''),
            #     joining_date=twitter_stats_data.get('joining_date', ''),
            #     comment_date=twitter_stats_data.get('comment_date', ''),
            #     comments=comments_instance  
            # )
            comments_instances = [Comment.objects.create(**comment) for comment in comments_data]

            twitter_stats_instance = TwitterStats.objects.create(
                followers=twitter_stats_data.get('followers', ''),
                followings=twitter_stats_data.get('followings', ''),
                joining_date=twitter_stats_data.get('joining_date', ''),
            )

            twitter_stats_instance.comments.set(comments_instances) 

            stats = HashTagStats.objects.create(
                user=user,
                youtube_stats=youtube_stats_instance,
                instagram_stats=instagram_stats_instance,
                twitter_stats=twitter_stats_instance,
            )

            hashtag_instance.hashtag_stats.add(stats)

        return hashtag_instance
    
    
