import os
from django.http import JsonResponse
from dotenv import load_dotenv

load_dotenv()

USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')
DEVELOPER_KEY = os.getenv('DEVELOPER_KEY')

import pandas as pd
import googleapiclient.discovery
import time

from django.shortcuts import render
from rest_framework import generics, status
from .serializers import HashTagSerializer, UserSerializer, CreateUserSerializer, CreateHashtagSerializer, YouTubeStatsSerializer
from .models import User, HashTag, HashTagStats
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

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
        
        
class SearchFromChrome(APIView):
    
    lookup_url_kwarg = 'key'

    
    def get(self, request, *args, **kwargs):

        hashtagName = request.GET.get(self.lookup_url_kwarg)

        
    ############################################################### YouTube ###############################################################
    
        hashtag_data = {}
        
        driver = webdriver.Chrome()
        # chrome_options = webdriver.ChromeOptions()
        # chrome_options.add_argument("--headless")
        # chrome_options.add_argument('--ignore-certificate-errors')
        # driver = webdriver.Chrome(options=chrome_options)
        
        # enteredName = "carryminati"
        enteredName = hashtagName
        
        
        hashtag_data = {}
        hashtag_data['hashtag'] = enteredName
        hashtag_data['hashtag_stats'] = [{}]
        hashtag_data['hashtag_stats'][0]['user'] = 17
        hashtag_data['hashtag_stats'][0]['youtube_stats'] = {}
        hashtag_data['hashtag_stats'][0]['instagram_stats'] = {}
        hashtag_data['hashtag_stats'][0]['twitter_stats'] = {}
        
        # youTuberName = "https://youtube.com/@"+enteredName
        # driver.get('https://commentpicker.com/youtube-channel-id.php')
        # time.sleep(5)
        
        # inputUrl = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="js-youtube-link"]')))
        # inputUrl.send_keys(youTuberName)
        # time.sleep(2)
        
        # number1 = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="captcha-x"]')))
        # number2 = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="captcha-y"]')))
        # sum=int(number1.text) +int( number2.text)
        # time.sleep(2)
        
        # input_answer = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="captcha"]')))
        # input_answer.send_keys(sum)
        # time.sleep(20)
        
        # getButton = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="js-start-button"]')))
        # getButton.click()
        # time.sleep(5)
        
        # channel_ID = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="js-results-id"]')))
        # time.sleep(5)
    
        # # channel_ID = "UC61Y04JVLkByFRv1K3V-KGQ"
        
        # api_service_name = "youtube"
        # api_version = "v3"
        
        # youtube = googleapiclient.discovery.build(
        #     api_service_name, api_version, developerKey=DEVELOPER_KEY)

        
        # request = youtube.channels().list(
        #     part="snippet,contentDetails,statistics",
        #     id=channel_ID.text,
        #     # id=channel_ID,
        #     maxResults=5
        # )
        # response = request.execute()
        # # print(response)
        # data=[]
        # for i in range(1):
        #     finalinfo = dict(Name=response['items'][i]['snippet']['title'],
        #                     views_count=response['items'][i]['statistics']['viewCount'],
        #                     subscriber_count=response['items'][i]['statistics']['subscriberCount'],video_count=response['items'][i]['statistics']['videoCount'])
        #     data.append(finalinfo)
        # # print(data)
        # hashtag_data['hashtag_stats'][0]['youtube_stats'] = {
        #     "name" : data[0]['Name'],
        #     "views_count" : data[0]['views_count'],
        #     "subscriber_count" : data[0]['subscriber_count'],
        #     "video_count" : data[0]['video_count']
        # }
        # # print(hashtag_data)
        # # # formatedData = pd.DataFrame(data)
        # # # print(formatedData)
        # # print(hashtag_data)
        
        # driver.quit()
        
        
        
        ############################################################### Instagram ###############################################################

        
        driver = webdriver.Chrome()
        
        
        # # chrome_options = webdriver.ChromeOptions()
        # # chrome_options.add_argument("--headless")
        # # driver = webdriver.Chrome(options=chrome_options)
        
        url = 'https://www.instagram.com/'
        driver.get(url)
        time.sleep(1)
        username = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.NAME,'username')))
        # username.send_keys(USERNAME)
        username.send_keys(USERNAME)
        time.sleep(1)
        password = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.NAME,'password')))
        password.send_keys(PASSWORD)
        time.sleep(1)
        login = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="loginForm"]/div/div[3]/button')))
        login.click()
        
        time.sleep(5)
        driver.get(url+enteredName)
        time.sleep(10)
        # print("after sleeping")
        ul = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.TAG_NAME,'ul')))
        items = ul.find_elements(By.TAG_NAME,'li')
        # print("items",items)            
        
        hashtag_data['hashtag_stats'][0]['instagram_stats'] = {
                "followers" : items[1].text,
                "followings" : items[2].text,
                "posts" : items[0].text
            }


        
        ############################################################### Twitter ###############################################################

        # scraper = Nitter(0)

        

        
        
        return Response({'data': hashtag_data})
    
    
class DeleteHashTag(APIView):
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
       
    # serializer_class = AuthenticateUserSerializer

    def get(self,request,format=None):
        # print("inside the get request")
        username = request.GET.get('username')
        password = request.GET.get('password')
        # print(username,password)
        try :
            user = User.objects.get(email=username)
            if(user):
                # print("user",user)
                if(user.password == password):
                    print("password matched")
                    print(user.user_id)
                    return Response({'token': user.user_id}, status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"error : 'Invalid username or password'"}, status=status.HTTP_400_BAD_REQUEST)
    