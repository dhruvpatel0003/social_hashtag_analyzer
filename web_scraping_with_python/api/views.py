from django.shortcuts import render
from rest_framework import generics, status
from .serializers import HashTagSerializer, UserSerializer, CreateUserSerializer, CreateHashtagSerializer, YouTubeStatsSerializer
from .models import User, HashTag, HashTagStats
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView




class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class HashTagListView(generics.ListAPIView):
    queryset = HashTag.objects.all()
    serializer_class = HashTagSerializer


class CreateUserView(APIView):
    serializer_class = CreateUserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            phone_number = serializer.data.get('phone_number')
            subscription_status = serializer.data.get('subscription_status')

            user = User.objects.filter(email=email)
            if user.exists():
                return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user = User.objects.create(email=email, password=password, phone_number=phone_number, subscription_status=subscription_status)
                user.save()
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUser(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'user_id'
    def get(self,request,format=None):
        userID = request.GET.get(self.lookup_url_kwarg)
        if userID != None:
            user = User.objects.filter(user_id=userID)
            if len(user)>0:
                data = UserSerializer(user[0]).data
                data['is_logged_in'] = True
                return Response(data,status=status.HTTP_200_OK)
            return Response({'Bad Request':'Invalid code'},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request':'Code not found in request'},status=status.HTTP_400_BAD_REQUEST)
    

class CreateHashTag(APIView):
    
    def post(self, request, format=None):
        serializer = CreateHashtagSerializer(data=request.data)

        if serializer.is_valid():
            hashtag_instance = serializer.save()
            print(hashtag_instance.hashtag)
            for stats_data in serializer.validated_data.get('hashtag_stats', []):
                print("User:", stats_data.get('user'))
                print("YouTube Stats:", stats_data.get('youtube_stats'))
                print("Instagram Stats:", stats_data.get('instagram_stats', {}))
                print("Twitter Stats:", stats_data.get('twitter_stats', {}))
                print("------------------------")

            return Response({'status': 'Hashtag and HashTagStats created successfully'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class GetHashTagData(APIView):
    serializer_class = HashTagSerializer
    lookup_url_kwarg = 'hashtag'

    def get(self, request, format=None):
        hashtag = request.GET.get(self.lookup_url_kwarg)
        print("inside the hashtag", hashtag)
        if hashtag is not None:
            hashtag_instance = HashTag.objects.filter(hashtag=hashtag).first()
            if hashtag_instance:
                serializer = self.serializer_class(hashtag_instance)
                hashtag_data = serializer.data

                # Customize the data structure if needed
                hashtag_stats = hashtag_data.get('hashtag_stats', [])
                modified_hashtag_stats = []

                for stat in hashtag_stats:
                    modified_stat = {
                        "user": stat['user'],
                        "youtube_stats": stat['youtube_stats'],
                        "instagram_stats": stat['instagram_stats'],
                        "twitter_stats": stat['twitter_stats'],
                    }
                    modified_hashtag_stats.append(modified_stat)

                hashtag_data['hashtag_stats'] = modified_hashtag_stats

                return Response(hashtag_data, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Hashtag not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Hashtag not provided in request'}, status=status.HTTP_400_BAD_REQUEST)

    
class DeleteAllHashTag(APIView):

    def delete(self, request, format=None):
        # hashtag = request.GET.get(self.lookup_url_kwarg)
        # if hashtag is not None:
            try:
                # hashtag_instance = HashTag.objects.get(hashtag="examplehashtag")
                # hashtag_instance.delete()
                HashTag.objects.all().delete()
                return Response({'message': f'Hashtag  deleted successfully'}, status=status.HTTP_200_OK)
            except HashTag.DoesNotExist:
                return Response({'error': 'Hashtag not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # return Response({'Bad Request': 'Hashtag not provided in request'}, status=status.HTTP_400_BAD_REQUEST)