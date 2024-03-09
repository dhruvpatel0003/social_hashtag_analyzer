from datetime  import datetime
from rest_framework import serializers
from .models import AnalysisReport, HashTag, History, InstagramProfile, ReportData, SubScription, TwitterProfile, User, HashTagStats, YouTubeProfile, YouTubeStats, InstagramStats, TwitterStats, Comment


# class AnalysisReportSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AnalysisReport
#         fields = '__all__' 


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
    
class ReportDataSerializer(serializers.ModelSerializer):
    hashtag_stats = HashTagStatsSerializer(many=True)

    class Meta:
        model = ReportData
        fields = ['hashtag', 'hashtag_stats']

# class AnalysisReportSerializer(serializers.ModelSerializer):
#     report_data = ReportDataSerializer(many=True)

#     class Meta:
#         model = AnalysisReport
#         fields = ['user_id', 'report_data']

#     def create(self, validated_data):
#         report_data_list = validated_data.pop('report_data', [])
#         user_id = validated_data['user_id']

#         # Get or create the AnalysisReport instance
#         analysis_report, created = AnalysisReport.objects.get_or_create(user_id=user_id)

#         for report_data in report_data_list:
#             hashtag_stats_data = report_data.pop('hashtag_stats', [])
#             print("before the instance")
#             # Check if the ReportData instance already exists
#             # report_data_instance, report_data_created = ReportData.objects.get_or_create(
#             #     hashtag=report_data['hashtag']
#             # )
#             report_data_instance = ReportData.objects.create(**report_data)
#             print("after the instance")
#             hashtag_stats_instances = []
#             for stats_data in hashtag_stats_data:
#                 try:
#                     # Try to get the YouTubeStats instance, if multiple, get the first one
#                     youtube_stats_instance = YouTubeStats.objects.get(name=stats_data.get('youtube_stats', {}).get('name', ''))
#                 except YouTubeStats.MultipleObjectsReturned:
#                     youtube_stats_instance = YouTubeStats.objects.filter(name=stats_data.get('youtube_stats', {}).get('name', '')).first()

#                 try:
#                     # Try to get the InstagramStats instance, if multiple, get the first one
#                     instagram_stats_instance = InstagramStats.objects.get()
#                 except InstagramStats.MultipleObjectsReturned:
#                     instagram_stats_instance = InstagramStats.objects.first()

#                 try:
#                     # Try to get the TwitterStats instance, if multiple, get the first one
#                     twitter_stats_instance = TwitterStats.objects.get(joining_date=stats_data.get('twitter_stats', {}).get('joining_date', ''))
#                 except TwitterStats.MultipleObjectsReturned:
#                     twitter_stats_instance = TwitterStats.objects.filter(joining_date=stats_data.get('twitter_stats', {}).get('joining_date', '')).first()

#                 # Continue with the rest of your code...

#                 stats = HashTagStats.objects.create(
#                     youtube_stats=youtube_stats_instance,
#                     instagram_stats=instagram_stats_instance,
#                     twitter_stats=twitter_stats_instance,
#                 )

#                 hashtag_stats_instances.append(stats)

#             print("before the report data instance")
#             print("after the report data instance")

            
#             report_data_instance.hashtag_stats.set(hashtag_stats_instances)
#             print("report instance ::: ",report_data_instance)
#             analysis_report.report_data.add(report_data_instance)
#             print("before the return statement")
#         return analysis_report


# ... (imports and other code)

# class AnalysisReportSerializer(serializers.ModelSerializer):
#     report_data = ReportDataSerializer(many=True)

#     class Meta:
#         model = AnalysisReport
#         fields = ['user_id', 'report_data']

#     def create(self, validated_data):
#         report_data_list = validated_data.pop('report_data', [])
#         user_id = validated_data['user_id']

#         # Get or create the AnalysisReport instance
#         analysis_report, created = AnalysisReport.objects.get_or_create(user_id=user_id)

#         for report_data in report_data_list:
#             hashtag_stats_data = report_data.pop('hashtag_stats', [])
#             print("hashtag_stats_data =", hashtag_stats_data)

#             # Check if the ReportData instance already exists
#             report_data_instance = ReportData.objects.create(**report_data)

#             hashtag_stats_instances = []
#             for stats_data in hashtag_stats_data:
#                 youtube_stats_data = stats_data.get('youtube_stats', {})
#                 instagram_stats_data = stats_data.get('instagram_stats', {})
#                 twitter_stats_data = stats_data.get('twitter_stats', {})
#                 print("youtube_stats_data =", youtube_stats_data)
#                 print("instagram_stats_data =", instagram_stats_data)
#                 print("twitter_stats_data =", twitter_stats_data)

#                 try:
#                     youtube_stats_instance = YouTubeStats.objects.get(name=youtube_stats_data.get('name', ''))
#                 except YouTubeStats.DoesNotExist:
#                     youtube_stats_instance = YouTubeStats.objects.create(name=youtube_stats_data.get('name', ''))

#                 if youtube_stats_instance:
#                     print("youtube_stats_instance =", youtube_stats_instance)
#                     youtube_profile_instances = [
#                         YouTubeProfile.objects.create(
#                             current_date=profile_data.get('current_date', ''),
#                             views_count=profile_data.get('views_count', 0),
#                             subscription_count=profile_data.get('subscription_count', 0),
#                             video_count=profile_data.get('video_count', 0),
#                         ) for profile_data in youtube_stats_data.get('current_status', [])
#                     ]
#                     youtube_stats_instance.current_status.set(youtube_profile_instances)
#                     print("youtube_profile_instances =", youtube_profile_instances)

#                 try:
#                     instagram_stats_instance = InstagramStats.objects.get()
#                 except InstagramStats.DoesNotExist:
#                     instagram_stats_instance = InstagramStats.objects.create()

#                 if instagram_stats_instance:
#                     print("instagram_stats_instance =", instagram_stats_instance)
#                     instagram_profile_instances = [
#                         InstagramProfile.objects.create(
#                             current_date=profile_data.get('current_date', ''),
#                             followers=profile_data.get('followers', ''),
#                             followings=profile_data.get('followings', ''),
#                             posts=profile_data.get('posts', 0),
#                         ) for profile_data in instagram_stats_data.get('current_status', [])
#                     ]
#                     instagram_stats_instance.current_status.set(instagram_profile_instances)
#                     print("instagram_profile_instances =", instagram_profile_instances)

#                 try:
#                     twitter_stats_instance = TwitterStats.objects.get(joining_date=twitter_stats_data.get('joining_date', ''))
#                 except TwitterStats.DoesNotExist:
#                     twitter_stats_instance = TwitterStats.objects.create(joining_date=twitter_stats_data.get('joining_date', ''))

#                 if twitter_stats_instance:
#                     print("twitter_stats_instance =", twitter_stats_instance)
#                     comments_instances = [
#                         Comment.objects.create(
#                             text=comment['text'],
#                             url=comment['url'],
#                             likes=comment['likes'],
#                             retweets=comment['retweets'],
#                             comments=comment['comments'],
#                             comment_date=comment['comment_date']
#                         ) for comment in twitter_stats_data.get('comments', [])
#                     ]
#                     twitter_stats_instance.comments.set(comments_instances)
#                     print("comments_instances =", comments_instances)

#                     twitter_profile_instances = [
#                         TwitterProfile.objects.create(
#                             current_date=profile_data.get('current_date', ''),
#                             followers=profile_data.get('followers', ''),
#                             followings=profile_data.get('followings', ''),
#                         ) for profile_data in twitter_stats_data.get('current_status', [])
#                     ]
#                     twitter_stats_instance.current_status.set(twitter_profile_instances)
#                     print("twitter_profile_instances =", twitter_profile_instances)

#                 stats = HashTagStats.objects.create(
#                     youtube_stats=youtube_stats_instance,
#                     instagram_stats=instagram_stats_instance,
#                     twitter_stats=twitter_stats_instance
#                 )

#                 print("stats =", stats)
#                 hashtag_stats_instances.append(stats)

#             report_data_instance.hashtag_stats.set(hashtag_stats_instances)
#             analysis_report.report_data.add(report_data_instance)

#         return analysis_report

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
