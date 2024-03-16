from datetime  import datetime
from rest_framework import serializers
from .models import AnalysisReport, HashTag, History, InstagramProfile, ReportData, HashTagStats,SubScription, TwitterProfile, User, HashTagStats, YouTubeProfile, YouTubeStats, InstagramStats, TwitterStats, Comment

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
        fields = ['current_status']



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

# class CreateHashtagSerializer(serializers.ModelSerializer):
    
#     hashtag_stats = HashTagStatsSerializer(many=True)

#     class Meta:
#         model = HashTag
#         fields = ['hashtag', 'hashtag_stats']

#     def create(self, validated_data):
#         hashtag, _ = HashTag.objects.get_or_create(hashtag=validated_data['hashtag'])
#         hashtag_stats_data = validated_data.get('hashtag_stats', [])
        
#         for stats_data in hashtag_stats_data:
#             youtube_stats_data = stats_data.get('youtube_stats', {})
#             instagram_stats_data = stats_data.get('instagram_stats', {})
#             twitter_stats_data = stats_data.get('twitter_stats', {})
#             comments_data = twitter_stats_data.get('comments', [])

#             # Create YouTubeStats instance
#             youtube_stats_instance = YouTubeStats.objects.create(name=youtube_stats_data.get('name', ''))
#             youtube_profile_instances = []
#             # Create and associate YouTubeProfile instances
#             for profile_data in youtube_stats_data.get('current_status', []):
#                 youtube_profile = YouTubeProfile.objects.create(
#                     current_date=profile_data.get('current_date', ''),
#                     views_count=profile_data.get('views_count', 0),
#                     subscription_count=profile_data.get('subscription_count', 0),
#                     video_count=profile_data.get('video_count', 0),
#                 )
#                 youtube_profile_instances.append(youtube_profile)
#             youtube_stats_instance.current_status.set(youtube_profile_instances)

#             # Create InstagramStats instance
#             instagram_stats_instance = InstagramStats.objects.create()
#             instagram_profile_instances = []
#             # Create and associate InstagramProfile instances
#             for profile_data in instagram_stats_data.get('current_status', []):
#                 instagram_profile = InstagramProfile.objects.create(
#                     current_date=profile_data.get('current_date', ''),
#                     followers=profile_data.get('followers', ''),
#                     followings=profile_data.get('followings', ''),
#                     posts=profile_data.get('posts', 0),
#                 )
#                 instagram_profile_instances.append(instagram_profile)
#             instagram_stats_instance.current_status.set(instagram_profile_instances)

#             # Create TwitterStats instance
#             twitter_stats_instance = TwitterStats.objects.create(joining_date=twitter_stats_data.get('joining_date', ''))
#             twitter_profile_instances = []
#             # Create and associate TwitterProfile instances
#             for profile_data in twitter_stats_data.get('current_status', []):
#                 twitter_profile = TwitterProfile.objects.create(
#                     current_date=profile_data.get('current_date', ''),
#                     followers=profile_data.get('followers', ''),
#                     followings=profile_data.get('followings', ''),
#                 )
#                 twitter_profile_instances.append(twitter_profile)
#             twitter_stats_instance.current_status.set(twitter_profile_instances)
            
#             # Create and associate Comment instances
#             comments_instances = []
#             for comment_data in comments_data:
#                 comment = Comment.objects.create(
#                     text=comment_data.get('text', ''),
#                     url=comment_data.get('url', ''),
#                     likes=comment_data.get('likes', 0),
#                     retweets=comment_data.get('retweets', 0),
#                     comments=comment_data.get('comments', 0),
#                     comment_date=comment_data.get('comment_date', None),
#                 )
#                 comments_instances.append(comment)

#             # Associate comments with TwitterStats
#             twitter_stats_instance.comments.set(comments_instances)

#             # Create HashTagStats instance and associate all related instances
#             stats = HashTagStats.objects.create(
#                 youtube_stats=youtube_stats_instance,
#                 instagram_stats=instagram_stats_instance,
#                 twitter_stats=twitter_stats_instance,
#             )

#             # Associate HashTagStats with HashTag
#             hashtag.hashtag_stats.add(stats)

#         return hashtag
class CreateHashtagSerializer(serializers.ModelSerializer):
    
    hashtag_stats = HashTagStatsSerializer(many=True)

    class Meta:
        model = HashTag
        fields = ['hashtag', 'hashtag_stats']

    def create(self, validated_data):
        hashtag_name = validated_data['hashtag']
        hashtag, created = HashTag.objects.get_or_create(hashtag=hashtag_name)
        
        if not created:
            # HashTag already exists, update its HashTagStats
            existing_stats = hashtag.hashtag_stats.all()
            hashtag_stats_data = validated_data.get('hashtag_stats', [])
            
            for stats_data in hashtag_stats_data:
                youtube_stats_data = stats_data.get('youtube_stats', {})
                instagram_stats_data = stats_data.get('instagram_stats', {})
                twitter_stats_data = stats_data.get('twitter_stats', {})
                comments_data = twitter_stats_data.get('comments', [])

                for existing_stat in existing_stats:
                    # Update existing YouTubeStats
                    existing_youtube_stats = existing_stat.youtube_stats
                    for profile_data in youtube_stats_data.get('current_status', []):
                        youtube_profile = YouTubeProfile.objects.create(
                            current_date=profile_data.get('current_date', ''),
                            views_count=profile_data.get('views_count', 0),
                            subscription_count=profile_data.get('subscription_count', 0),
                            video_count=profile_data.get('video_count', 0),
                        )
                        existing_youtube_stats.current_status.add(youtube_profile)

                    # Update existing InstagramStats
                    existing_instagram_stats = existing_stat.instagram_stats
                    for profile_data in instagram_stats_data.get('current_status', []):
                        instagram_profile = InstagramProfile.objects.create(
                            current_date=profile_data.get('current_date', ''),
                            followers=profile_data.get('followers', ''),
                            followings=profile_data.get('followings', ''),
                            posts=profile_data.get('posts', 0),
                        )
                        existing_instagram_stats.current_status.add(instagram_profile)
                    # Update existing TwitterStats
                    existing_twitter_stats = existing_stat.twitter_stats
                    for profile_data in twitter_stats_data.get('current_status', []):
                        twitter_profile = TwitterProfile.objects.create(
                            current_date=profile_data.get('current_date', ''),
                            followers=profile_data.get('followers', ''),
                            followings=profile_data.get('followings', ''),
                        )
                        existing_twitter_stats.current_status.add(twitter_profile)
                    # Update existing comments
                    for comment_data in comments_data:
                        comment = Comment.objects.create(
                            text=comment_data.get('text', ''),
                            url=comment_data.get('url', ''),
                            likes=comment_data.get('likes', 0),
                            retweets=comment_data.get('retweets', 0),
                            comments=comment_data.get('comments', 0),
                            comment_date=comment_data.get('comment_date', None),
                        )
                        existing_twitter_stats.comments.add(comment)
            
        else:
            # HashTag is newly created, create its HashTagStats
            hashtag_stats_data = validated_data.get('hashtag_stats', [])
            
            for stats_data in hashtag_stats_data:
                youtube_stats_data = stats_data.get('youtube_stats', {})
                instagram_stats_data = stats_data.get('instagram_stats', {})
                twitter_stats_data = stats_data.get('twitter_stats', {})
                comments_data = twitter_stats_data.get('comments', [])

                # Create YouTubeStats instance
                youtube_stats_instance = YouTubeStats.objects.create()
                youtube_profile_instances = []
                # Create and associate YouTubeProfile instances
                for profile_data in youtube_stats_data.get('current_status', []):
                    youtube_profile = YouTubeProfile.objects.create(
                        current_date=profile_data.get('current_date', ''),
                        views_count=profile_data.get('views_count', 0),
                        subscription_count=profile_data.get('subscription_count', 0),
                        video_count=profile_data.get('video_count', 0),
                    )
                    youtube_profile_instances.append(youtube_profile)
                youtube_stats_instance.current_status.set(youtube_profile_instances)

                # Create InstagramStats instance
                instagram_stats_instance = InstagramStats.objects.create()
                instagram_profile_instances = []
                # Create and associate InstagramProfile instances
                for profile_data in instagram_stats_data.get('current_status', []):
                    instagram_profile = InstagramProfile.objects.create(
                        current_date=profile_data.get('current_date', ''),
                        followers=profile_data.get('followers', ''),
                        followings=profile_data.get('followings', ''),
                        posts=profile_data.get('posts', 0),
                    )
                    instagram_profile_instances.append(instagram_profile)
                instagram_stats_instance.current_status.set(instagram_profile_instances)

                # Create TwitterStats instance
                twitter_stats_instance = TwitterStats.objects.create(joining_date=twitter_stats_data.get('joining_date', ''))
                twitter_profile_instances = []
                # Create and associate TwitterProfile instances
                for profile_data in twitter_stats_data.get('current_status', []):
                    twitter_profile = TwitterProfile.objects.create(
                        current_date=profile_data.get('current_date', ''),
                        followers=profile_data.get('followers', ''),
                        followings=profile_data.get('followings', ''),
                    )
                    twitter_profile_instances.append(twitter_profile)
                twitter_stats_instance.current_status.set(twitter_profile_instances)
                
                # Create and associate Comment instances
                comments_instances = []
                for comment_data in comments_data:
                    comment = Comment.objects.create(
                        text=comment_data.get('text', ''),
                        url=comment_data.get('url', ''),
                        likes=comment_data.get('likes', 0),
                        retweets=comment_data.get('retweets', 0),
                        comments=comment_data.get('comments', 0),
                        comment_date=comment_data.get('comment_date', None),
                    )
                    comments_instances.append(comment)

                # Associate comments with TwitterStats
                twitter_stats_instance.comments.set(comments_instances)
    
                # Create HashTagStats instance and associate all related instances
                stats = HashTagStats.objects.create(
                    youtube_stats=youtube_stats_instance,
                    instagram_stats=instagram_stats_instance,
                    twitter_stats=twitter_stats_instance,
                )

                # Associate HashTagStats with HashTag
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
    
class ReportDataSerializer(serializers.ModelSerializer):
    hashtag_stats = HashTagStatsSerializer(many=True)

    class Meta:
        model = ReportData
        fields = ['hashtag', 'hashtag_stats']

class AnalysisReportSerializer(serializers.ModelSerializer):
    report_data = ReportDataSerializer(many=True)

    class Meta:
        model = AnalysisReport
        fields = ['user_id', 'report_data']

    def create(self, validated_data):
        report_data_list = validated_data.pop('report_data', [])
        user_id = validated_data['user_id']

        # Get or create the AnalysisReport instance
        analysis_report, created = AnalysisReport.objects.get_or_create(user_id=user_id)

        for report_data in report_data_list:
            hashtag_stats_data = report_data.pop('hashtag_stats', [])

            # Create a new ReportData instance
            report_data_instance = ReportData.objects.create(**report_data)

            hashtag_stats_instances = []
            for stats_data in hashtag_stats_data:
                youtube_stats_data = stats_data.get('youtube_stats', {})
                instagram_stats_data = stats_data.get('instagram_stats', {})
                twitter_stats_data = stats_data.get('twitter_stats', {})

                # Create new instances for YouTubeStats, InstagramStats, TwitterStats
                youtube_stats_instance = YouTubeStats.objects.create(name=youtube_stats_data.get('name', ''))
                youtube_profile_instances = [
                    YouTubeProfile.objects.create(
                        current_date=profile_data.get('current_date', ''),
                        views_count=profile_data.get('views_count', 0),
                        subscription_count=profile_data.get('subscription_count', 0),
                        video_count=profile_data.get('video_count', 0),
                    ) for profile_data in youtube_stats_data.get('current_status', [])
                ]
                youtube_stats_instance.current_status.set(youtube_profile_instances)
                # Create new instance for InstagramStats
                
                instagram_stats_instance = InstagramStats.objects.create()
                instagram_profile_instances = [
                    InstagramProfile.objects.create(
                        current_date=profile_data.get('current_date', ''),
                        followers=profile_data.get('followers', ''),
                        followings=profile_data.get('followings', ''),
                        posts=profile_data.get('posts', 0),
                    ) for profile_data in instagram_stats_data.get('current_status', [])
                ]
                instagram_stats_instance.current_status.set(instagram_profile_instances)

                # Create new instance for TwitterStats
                twitter_stats_instance = TwitterStats.objects.create(joining_date=twitter_stats_data.get('joining_date', ''))
                comments_instances = [
                    Comment.objects.create(
                        text=comment['text'],
                        url=comment['url'],
                        likes=comment['likes'],
                        retweets=comment['retweets'],
                        comments=comment['comments'],
                        comment_date=comment['comment_date']
                    ) for comment in twitter_stats_data.get('comments', [])
                ]
                twitter_stats_instance.comments.set(comments_instances)

                twitter_profile_instances = [
                    TwitterProfile.objects.create(
                        current_date=profile_data.get('current_date', ''),
                        followers=profile_data.get('followers', ''),
                        followings=profile_data.get('followings', ''),
                    ) for profile_data in twitter_stats_data.get('current_status', [])
                ]
                twitter_stats_instance.current_status.set(twitter_profile_instances)

                stats = HashTagStats.objects.create(
                    youtube_stats=youtube_stats_instance,
                    instagram_stats=instagram_stats_instance,
                    twitter_stats=twitter_stats_instance
                )

                hashtag_stats_instances.append(stats)

            report_data_instance.hashtag_stats.set(hashtag_stats_instances)
            analysis_report.report_data.add(report_data_instance)

        return analysis_report
