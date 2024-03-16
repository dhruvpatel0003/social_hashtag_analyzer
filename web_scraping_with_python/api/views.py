import base64
from collections import Counter
import json
import os
import re
import nltk
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
# nltk.download('stopwords')
from nltk.corpus import stopwords 
from django.views import View

from dotenv import load_dotenv
load_dotenv()


USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')
DEVELOPER_KEY = os.getenv('DEVELOPER_KEY')
TWITTER_API_KEY = os.getenv('API_KEY')
EMAIL = os.getenv("EMAIL")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
APIFY_CLIENT_API_KEY = os.getenv("APIFY_CLIENT_API_KEY")
CLIENT_ACTOR = os.getenv("CLIENT_ACTOR")

import requests
import googleapiclient.discovery
import time
import bcrypt
import pandas as pd
import os
import smtplib          

from rest_framework.parsers import FileUploadParser
from django.http import  HttpResponse, HttpResponseForbidden
from django.shortcuts import redirect, render
from rest_framework import generics, status
from .serializers import AnalysisReportSerializer, HashTagSerializer, SubScriptionSerializer, UserHistorySerializer, UserSerializer, CreateUserSerializer, CreateHashtagSerializer, YouTubeStatsSerializer
from .models import AnalysisReport, History, SubScription, User, HashTag, HashTagStats
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from datetime import datetime, timedelta
from django.http import JsonResponse
from openpyxl import Workbook
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.core.signing import TimestampSigner, BadSignature
from django.shortcuts import get_object_or_404
from urllib.parse import quote
from rest_framework.parsers import JSONParser
from rest_framework.parsers import MultiPartParser
from apify_client import ApifyClient


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ntscraper import Nitter
from tqdm import tqdm
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class HashTagListView(generics.ListAPIView):
    queryset = HashTag.objects.all()
    serializer_class = HashTagSerializer

class AnalysisReportListCreateView(generics.ListCreateAPIView):
    queryset = AnalysisReport.objects.all()
    serializer_class = AnalysisReportSerializer
    print("after the serializer")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetAnalysisReport(generics.ListAPIView):
    
    serializer_class = AnalysisReportSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']  # Get the user_id from the URL parameter

        # Query the database to get analysis reports for the specified user_id
        queryset = AnalysisReport.objects.filter(user_id=user_id)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Serialize the queryset data
        serializer = self.get_serializer(queryset, many=True)

        # Return the serialized data as a response
        return Response(serializer.data)
class GetAllAnalysisReport(generics.ListAPIView):
    
    serializer_class = AnalysisReportSerializer 
    queryset = AnalysisReport.objects.all()

class DeleteAnalysisReport(APIView):
    def delete(self, request, format=None):
        AnalysisReport.objects.all().delete()
        return Response({"message": "Analysis reports deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class CreateUserView(APIView):
    serializer_class = CreateUserSerializer

    def post(self, request, format=None):
        
        print("request body ::::::::::::::::::::::::::::::::::::::::: ",request.body)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()   

        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            
            email = serializer.data.get('email')
            password = serializer.data.get('password')  
            phone_number = serializer.data.get('phone_number')
            subscription_data = serializer.data.get('subscription_status',[])
            print("subscription_date :::::: ",subscription_data)
            user = User.objects.create(email=email, password=password, phone_number=phone_number)
            print(user)
            for subscription_details in subscription_data:
                print("subscription_details )))))))))))))))) ",subscription_details)
                subscription = SubScription.objects.create(**subscription_details)
                user.subscription_status.add(subscription)
                
            user_serializer = UserSerializer(user)
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfilePhotoView(APIView):
    parser_classes = [FileUploadParser]

    def post(self, request, *args, **kwargs):
        # Assuming user_id is available in request.user
        user_id = request.user.id

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        profile_photo = request.data.get('profile_photo')

        # Save the base64-encoded photo to the user's profile_photo field
        user.save_base64_image(profile_photo)

        return Response({"detail": "Profile photo updated successfully"}, status=status.HTTP_200_OK)

class GetUser(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'user_id'

    def get(self, request, format=None):
        user_id = request.GET.get(self.lookup_url_kwarg)
        print("user id inside the get user ::::::::::::::::::::::::::::::::::::: ",user_id)
        if user_id is not None:
            try:
                user = User.objects.get(user_id=user_id)
                print("after the user fetched :::::: ")
            except User.DoesNotExist:
                return Response({'Bad Request': 'Invalid user_id'}, status=status.HTTP_404_NOT_FOUND)

            # Include the URL of the profile photo in the user data
            data = UserSerializer(user).data
            print("data ============================================================ ",data)
            data['is_logged_in'] = True
            profile_photo_url = user.get_image_url()

            # Add the profile photo URL to the response data
            if profile_photo_url:
                # Fetch and encode the profile photo
                with open(user.profile_photo.path, "rb") as photo_file:
                    encoded_image = base64.b64encode(photo_file.read()).decode("utf-8")
                data['profile_photo'] = encoded_image
            print("After getting the response")
            # print("getting the profile photo =++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ",data['profile_photo'],"profile photo")
            return Response(data, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'user_id not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class CreateHashTag(APIView):
    print("inside the post request : ::::::::::::::::::::::::::::")
    def post(self, request, format=None):
        print("inside the create hashtag request :::::::::::::::::::::::::::::::::::::::::::::::::::::::::",request.data)
        serializer = CreateHashtagSerializer(data=request.data,context={'request': request})

        if serializer.is_valid():
            hashtag_instance = serializer.save()
            print(hashtag_instance.hashtag)
            for stats_data in serializer.validated_data.get('hashtag_stats', []):
                print("YouTube Stats:", stats_data.get('youtube_stats',{}))
                print("Instagram Stats:", stats_data.get('instagram_stats', {}))
                print("Twitter Stats:", stats_data.get('twitter_stats', {}))
                print("------------------------")

            return Response({'status': 'Hashtag and HashTagStats created successfully'}, status=status.HTTP_201_CREATED)
        print("--------------------------")
        print(serializer.errors)
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
            try:
                HashTag.objects.all().delete()
                return Response({'message': f'Hashtag  deleted successfully'}, status=status.HTTP_200_OK)
            except HashTag.DoesNotExist:
                return Response({'error': 'Hashtag not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class SearchFromChrome(APIView):
    
    lookup_url_kwarg = 'key'

    
    def get(self, request, *args, **kwargs):

        print("inside the searchView ----------------- ")

        hashtagName = request.GET.get(self.lookup_url_kwarg)
        print("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",hashtagName)
        print("request header :::::::::::**************************::::::::::::::::: ",request.headers['Authorization'].split(' '))
        user_id = request.headers['Authorization'].split(' ')[1].replace(";",'')
        # print("user_id inside searchView ----------------- ",user_id)
        
        ##############################################################################
        print('before the history creation')
        current_date = datetime.now().strftime("%Y-%m-%d")
        create_user_history = CreateUserHistory()
        create_user_history.request  =  {
        "user": user_id,
        "history": {
            current_date: [
                hashtagName
            ]
        }
        }
        create_user_history.post(create_user_history.request)
        
        hashtag_data = {}
        hashtag_data['hashtag'] = hashtagName
        hashtag_data['hashtag_stats'] = [{}]
        # hashtag_data['hashtag_stats'][0]['user'] = 17
        hashtag_data['hashtag_stats'][0]['youtube_stats'] = {}
        hashtag_data['hashtag_stats'][0]['youtube_stats']['current_status'] = []
        hashtag_data['hashtag_stats'][0]['instagram_stats'] = {}
        hashtag_data['hashtag_stats'][0]['instagram_stats']['current_status'] = []
        
        
        hashtag_data['hashtag_stats'][0]['twitter_stats'] = {} 
        hashtag_data['hashtag_stats'][0]['twitter_stats']['current_status'] = []
        hashtag_data['hashtag_stats'][0]['twitter_stats']['comments'] = []
        
        
        # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  APIFY - INSTAGRAM <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
         

        # client = ApifyClient(APIFY_CLIENT_API_KEY)

        # run_input = { "usernames": ["humansofny"] }
        insta_user_data = []
        # run = client.actor(CLIENT_ACTOR).call(run_input=run_input)
        temp_data = [{'profilePic': 'https://instagram.fosu2-1.fna.fbcdn.net/v/t51.2885-19/118982623_353024589077161_7490638455124782637_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fosu2-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=5Cc6cpDlPpMAX-X3Poo&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfDW2dxFcha-cjTY8ZYwzjjHrYMgxPLsfOC8I2cgSW7mTQ&oe=65F769E8&_nc_sid=8b3546', 'userName': 'humansofny', 'followersCount': 12939915, 'followsCount': 400, 'timestamp': '2024-03-14 - 13:22', 'userUrl': 'https://www.instagram.com/humansofny', 'userFullName': 'Humans of New York', 'userId': '242598499'}]

        # Fetch and print Actor results from the run's dataset (if there are any)
        # for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        #     insta_user_data.append(item)

        # print("instagram user data ::::::::::::::::::: ",insta_user_data)
        
        hashtag_data['hashtag_stats'][0]['instagram_stats']['current_status'].append({
            "current_date" : "2022-02-11",
            "followers" : temp_data[0]['followersCount'],
            "followings" : temp_data[0]['followsCount'],
        })
        print("returning from the search from chrom")
        return Response({'data': hashtag_data})

   
    
class DeleteUser(APIView):
    def delete(self, request, format=None):
            try:
                User.objects.all().delete()
                return Response({'message': f'User  deleted successfully'}, status=status.HTTP_200_OK)
            except HashTag.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # return Response({'Bad Request': 'Hashtag not provided in request'}, status=status.HTTP_400_BAD_REQUEST)
        
class UserLogin(APIView):
    def post(self, request, format=None):
        print("inside the post request ###################")
        username = request.data.get('username')
        password = request.data.get('password')

        print(username, password)

        try:
            user = User.objects.get(email=username)
            if user:
                hashed_password = user.password.encode('utf-8')

                if bcrypt.checkpw(password.encode('utf-8'), hashed_password):
                    print("Password matched")
                    # print(user.user_id)
                    return Response({'token': str(user.user_id)}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class HashTagTwitterSearch(APIView):
    
    lookup_url_kwarg = 'key'
    
    def get(self, request, *args, **kwargs):
        
        hashtag_data = []   
        hashtagName = request.GET.get(self.lookup_url_kwarg)
        number_of_tweets = 5
        print("number of tweets ::::::::::::::::::::::::::::::::::::::::::::: ",number_of_tweets)
        payload = {
            'api_key': TWITTER_API_KEY,
            'query' : hashtagName,
            'num' : number_of_tweets
        }

    
        response = requests.get('https://api.scraperapi.com/structured/twitter/search',params = payload)
        search_result = response.json()['organic_results']
        print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++",search_result[0])
        for i in range(0,number_of_tweets-1):
            hashtag_data.append({
                        "title":search_result[i]['title'],
                        "text":search_result[i]['snippet'],
                        "url":search_result[i]['link']
        })
        print('hashtag_data ---------------------------',hashtag_data)
        return Response({'data': hashtag_data})
    
class CreateUserHistory(APIView):
    
    def post(self, request, formate=None):
        
        print("user history inside create-user-history ***************** ",request)
        user_id = request.get('user')
        history = request.get('history') 
        current_date = list(history.keys())[0]
        search_text = history[list(history.keys())[0]][0]
        print("search_text ----------------- ",search_text)

        
        history_entry = History.objects.filter(user=user_id).first()
        # print("history_entry ----------------- ",list(history_entry.history.keys()))
        
        if history_entry:
            # history_dict = dict(history_entry.history)
            if current_date in list(history_entry.history.keys()):
                print("current_date inside if condition ----------------- ",current_date)
                
                history_entry.history[current_date].append(search_text)
            else:
                print('inside else statement',search_text)
                history_entry.history.update({current_date: [search_text]})
            
            history_entry.save()
            serializer = UserHistorySerializer(history_entry)

            return Response(serializer.data, status=status.HTTP_200_OK)
            
        try : 
            serializer = UserHistorySerializer(data=request)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except : 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
class UserProfilePhotoView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        user = User.objects.get(user_id=user_id)
        profile_photo = request.data.get('profile_photo')

        if profile_photo:
            # Read the content of the uploaded file and encode it to base64
            base64_encoded_image = base64.b64encode(profile_photo.read()).decode('utf-8')

            # Save the base64-encoded image to the user's profile_photo field
            # user.save_base64_image(profile_photo)
            user.save_base64_image(base64_encoded_image)

            return Response({"detail": "Profile photo updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "No profile photo provided"}, status=status.HTTP_400_BAD_REQUEST)
class GetUserProfilePhoto(APIView):
    
    def get(self, request, user_id, png_id):
        print("inside the user profile photo")
        print("Getting the user profile photo")
        user = get_object_or_404(User, user_id=user_id)

        if user.profile_photo:
                filename = f"{user_id}/profile_photos/{png_id}"
                photo_url = user.get_image_url(filename)
                if photo_url:
                    return Response({"profile_photo_url": photo_url}, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "User has no profile photo"}, status=status.HTTP_404_NOT_FOUND)
        else:
               return Response({"detail": "User has no profile photo"}, status=status.HTTP_404_NOT_FOUND)

class GetUserHistoryByID(APIView):
    
    lookup_url_kwarg = 'user_id'

    def get(self,request, *args, **kwargs):
        user_id =kwargs.get(self.lookup_url_kwarg)
        user_search = History.objects.get(user=user_id)
        serializer = UserHistorySerializer(user_search)
        return Response(serializer.data, status=200)

class DeleteHistory(APIView):
    
        def delete(self, request, format=None):
                History.objects.all().delete()  
                return Response({'message': 'History  deleted successfully'}, status=status.HTTP_200_OK)

class HistoryView(generics.ListAPIView):
    queryset = History.objects.all()
    serializer_class = UserHistorySerializer


@method_decorator(csrf_exempt, name='dispatch')
class ForgotPassword(View):
    
    
  def post(self, request, *args, **kwargs):
      
    print("inside the forgot password")
        
    try:
        request_data = json.loads(request.body.decode('utf-8'))

            # Access the 'email' field
        user_email = request_data.get('email')
        print("user email for the forgot password : ",user_email)  
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return HttpResponse("This email address is not registered.", status=404)
        
        signer = TimestampSigner()
        token = signer.sign_object({'email': user_email})
        # token = str(signer.sign(user_email))
        print("Token >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",token)
        # expiration_time = datetime.now() + timedelta(hours=1)  # Set the expiration time (adjust as needed)
        expiration_time = datetime.now() + timedelta(minutes=30)  # Set the expiration time (adjust as needed)
        print("The expiration time :::::::::::::::::::::::::::::::))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))) ",expiration_time)
        token_with_expiration = f"{token}.{expiration_time.timestamp()}"

        reset_password_link = f'http://127.0.0.1:8000/reset-password/{quote(user_email)}/{quote(token_with_expiration)}'

        subject = 'Password Reset'
        message = f'Dear {user.user_id},\n\nOpen the following URL in the browser: {reset_password_link}'
        msg = MIMEMultipart()
        msg.attach(MIMEText(message, 'plain'))

        msg['From'] = EMAIL
        msg['To'] = user_email
        msg['Subject'] = subject
        print("before sending mail ",EMAIL,"password : ",EMAIL_PASSWORD)
        with smtplib.SMTP('smtp.gmail.com', 587) as conn:
            conn.starttls()
            conn.login(user=EMAIL, password=EMAIL_PASSWORD)
            conn.sendmail(from_addr=EMAIL, to_addrs=user_email, msg=msg.as_string())
            conn.close()
            
        print("After mail was sent")
        return HttpResponse("Password reset email sent successfully!",status=200)
    except Exception as e:
        print(e)
        return HttpResponse(f"Error sending password reset email: {str(e)}", status=500)
    

class TokenExpirationChecker(View):
    def dispatch(self, *args, **kwargs):
        print("inside the dispatch")
        return super().dispatch(*args, **kwargs)

    def get(self, request, token, *args, **kwargs):
        # logger.info("checking the expiration checks")
        print("inside the get method ::::::::::::::::::::::::: ")
        try:
            # Extract the email and timestamp from the token
            parts = token.split('.')
            if len(parts) != 3:
                raise ValueError("Invalid token format")
                
            user_email = parts[0]
            print("user_email ||||||||||||||||||||||||||||||||||||||||||||||||| ",user_email)
            timestamp = int(parts[1])

            # Check if the token is expired (e.g., expires in 1 hour)
            expiration_time = datetime.utcfromtimestamp(timestamp) + timedelta(minutes=30)
            print("After checking the expiration time ",expiration_time)
            current_time = datetime.utcnow()
            print(current_time)
            print(expiration_time)
            print(current_time>expiration_time)
            if current_time > expiration_time:
                print("inside tokenchecker token expired")
                return JsonResponse({"message": "Invalid or expired token."}, status=400)

            # Render your reset password page or redirect as needed
            print("above the return statement &&&&&&&&&&&&&&&&&&&&&&&&&& ")
            return JsonResponse({"message": f"Reset password page for {user_email}"})

        except Exception as e:
            print("inside the exception :::::::::::::::::::: ")
            return JsonResponse({"message": f"Error resetting password: {str(e)}"}, status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetHandler(TokenExpirationChecker):
    def post(self, request, token, *args, **kwargs):

        try:
            signer = TimestampSigner()
            try:
                parts = token.split('.')
                if len(parts) != 3:
                    raise ValueError("Invalid token format")

                timestamp = int(parts[1])

                expiration_time = datetime.utcfromtimestamp(timestamp) + timedelta(minutes=30)
                current_time = datetime.utcnow()
                print("The expiration time ",expiration_time,"current time ",current_time)
                print(current_time > expiration_time)
                if current_time > expiration_time:
                    print("Token expired >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ")
                    return JsonResponse({"message": "Token has expired."}, status=400)

            except (ValueError, BadSignature) as error:
                print("Token invalid >>>>>>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>>>  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ")
                return JsonResponse({"message": "Invalid token."}, status=400)

            print("above the request_data------------------------------------------")
            request_data = json.loads(request.body.decode('utf-8'))
            print('after the request_data ++++++++++++++++++++++++++++++++++++ ',request_data)
            user_password = request_data.get('password')
            print('user_password ',user_password)
            user_email = request_data.get('email')
            try:
                print('before getting the user ',user_email)
                user = User.objects.get(email=user_email)
                print('after getting the user')
            except User.DoesNotExist:
                return JsonResponse({"message": "This email address is not registered."}, status=404)

            if user:
                user.password = (user_password)  # Use set_password to handle password hashing
                user.save()
                return JsonResponse({"message": "Password reset successfully!"}, status=200)

            return JsonResponse({"message": "This email address is not registered."}, status=404)

        except Exception as e:
            return JsonResponse({"message": f"Error resetting password: {str(e)}"}, status=500)
        
        
class AnalizeText(APIView):
    
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        print("inside the analize text view------------------------------------- ")

        uploaded_file = request.FILES.get('file')
        user_id = request.data.get('user_id', '')
        
        if not uploaded_file or not user_id:
            return Response({'error': 'Missing file or user_id'}, status=status.HTTP_400_BAD_REQUEST)

        file_content = uploaded_file.read().decode('utf-8')
        # print("file content :::::::::::::::::::::::::::::::::::::::::::::::::::::::: ",file_content)
        print("after the file printed!")
        # Perform text preprocessing
        
        # text_field = self.extract_text_field(file_content)

        # cleaned_text = self.preprocess_text(text_field)
        cleaned_text = self.preprocess_text(file_content)
        
        
        search_names = ['bjp','congress']
        
        
        frequency_of_words = self.word_frequency(cleaned_text,search_names)
        print(list(frequency_of_words))
    
        response_data = {
            'cleaned_text': cleaned_text,
            'identified_politicians': ['Politician1', 'Politician2', 'Politician3'],
            'keywords': frequency_of_words,
            'sentiment': 'Positive',
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def preprocess_text(self, text):
        stop_words = set(stopwords.words('english'))
        cleaned_text = re.sub(r'\b(url|data|title|text|https)\b', '', text, flags=re.IGNORECASE)
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
        # print("cleaned text ::::::::::::::::::::::::::::::::::: ",cleaned_text)
        tokens = word_tokenize(cleaned_text)
        cleaned_tokens = [word.lower() for word in tokens if word.isalpha() and word.lower() not in stop_words]
        cleaned_text = ' '.join(cleaned_tokens)
        # print("cleaned text :::::::::::::::::::::::::::::::::::::::::::::: >>>>>>>>>>>> ",cleaned_text)
        return cleaned_text
    
    # def get_frequent_keywords(self, cleaned_text):

    #     frequently_used_keywords = {}
    
    #     for word in cleaned_text:
    #         frequently_used_keywords[word] = frequently_used_keywords.get(word, 0) + 1

    #     # Convert the dictionary to a list of tuples
    #     keyword_list = list(frequently_used_keywords.items())

    #     # Sort words by frequency in descending order
    #     sorted_keywords = sorted(keyword_list, key=lambda x: x[1], reverse=True)

    #     return sorted_keywords
    
    def word_frequency(self,text, word_list):
    # Remove unwanted characters and split the text into words
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Count the occurrences of each word
        word_counts = Counter(words)
        
        # Extract frequencies for specified words
        frequencies = {word: word_counts[word] for word in word_list}
        print(frequencies)
        return frequencies

# Example usage


    
    lookup_url_kwarg = 'hashtag'
    
    def get(self, request, *args, **kwargs):
        
        hashtag_data = []   
        hashtagName = request.GET.get(self.lookup_url_kwarg)
        number_of_tweets = 5
        print("number of tweets ::::::::::::::::::::::::::::::::::::::::::::: ",number_of_tweets)
        payload = {
            'api_key': TWITTER_API_KEY,
            'query' : hashtagName,
            'num' : number_of_tweets
        }

    
        response = requests.get('https://api.scraperapi.com/structured/twitter/search',params = payload)
        search_result = response.json()['organic_results']
        print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++",search_result[0])
        for i in range(0,number_of_tweets-1):
            hashtag_data.append({
                        "title":search_result[i]['title'],
                        "text":search_result[i]['snippet'],
                        "url":search_result[i]['link']
        })
        print('hashtag_data ---------------------------',hashtag_data)
        return Response({'data': hashtag_data})
    