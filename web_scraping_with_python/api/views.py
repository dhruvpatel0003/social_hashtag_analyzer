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
import bcrypt

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
        print("inside the create hashtag request :::::::::::::::::::::::::::::::::::::::::::::::::::::::::",request.data)
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
        # print("request header :::::::::::**************************::::::::::::::::: ",request.headers['Authorization'].split(' '))
        user_id = request.headers['Authorization'].split(' ')[2]
        # print("user_id inside searchView ----------------- ",user_id)
        
    ############################################################### YouTube ###############################################################
    
        hashtag_data = {}
        
        # driver = webdriver.Chrome()
        # chrome_options = webdriver.ChromeOptions()
        # chrome_options.add_argument("--headless")
        # chrome_options.add_argument('--ignore-certificate-errors')
        # driver = webdriver.Chrome(options=chrome_options)
        
        enteredName = hashtagName
        
        
        hashtag_data = {}
        hashtag_data['hashtag'] = enteredName
        hashtag_data['hashtag_stats'] = [{}]
        # hashtag_data['hashtag_stats'][0]['user'] = 17
        hashtag_data['hashtag_stats'][0]['user'] = user_id.split('=')[1]
        hashtag_data['hashtag_stats'][0]['youtube_stats'] = {}
        hashtag_data['hashtag_stats'][0]['instagram_stats'] = {}
        hashtag_data['hashtag_stats'][0]['twitter_stats'] = {}
        
        
        # youTuberName = "https://youtube.com/@"+enteredName
        # driver.get('https://commentpicker.com/youtube-channel-id.php')
        # time.sleep(2)
        
        # inputUrl = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="js-youtube-link"]')))
        # inputUrl.send_keys(youTuberName)
        # time.sleep(5)
        
        # number1 = WebDriverWait(driver,20).until(EC.presence_of_element_located((By.XPATH,'//*[@id="captcha-x"]')))
        # number2 = WebDriverWait(driver,20).until(EC.presence_of_element_located((By.XPATH,'//*[@id="captcha-y"]')))
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
        
        # driver.quit()
        
        
        
        # ############################################################### Instagram ###############################################################

        
        # driver = webdriver.Chrome()
        
        
        # #                                                                         # # chrome_options = webdriver.ChromeOptions()
        # #                                                                         # # chrome_options.add_argument("--headless")
        # #                                                                         # # driver = webdriver.Chrome(options=chrome_options)
        
        # url = 'https://www.instagram.com/'
        # driver.get(url)
        # time.sleep(1)
        # username = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.NAME,'username')))
        # username.send_keys("codestarted01")
        # time.sleep(1)
        # password = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.NAME,'password')))
        # password.send_keys("UnknownCoder")
        # time.sleep(1)
        # login = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="loginForm"]/div/div[3]/button')))
        # login.click()
        
        # time.sleep(5)
        # driver.get(url+enteredName)
        # time.sleep(10)
        # ul = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.TAG_NAME,'ul')))
        # items = ul.find_elements(By.TAG_NAME,'li')
        # numeric_part = ''.join(c for c in items[0].text if c.isdigit())

        # posts_value = int(numeric_part)        
        # hashtag_data['hashtag_stats'][0]['instagram_stats'] = {
        #         "followers" : items[1].text,
        #         "followings" : items[2].text,
        #         "posts" : posts_value
        #     }


        
        ############################################################### Twitter ###############################################################

        # driver = webdriver.Chrome()
        
        # driver.get("https://twitter.com/"+enteredName)
        
        # ############################################### ####### ################### ########################
        
        # driver.get('https://twitter.com/i/flow/login?redirect_after_login=%2Fsearch%3Fq%3Dbjp%26src%3Dtyped_query%26f%3Dlist')
        
        # time.sleep(2)
        
        # username = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="layers"]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/div[5]/label/div/div[1]/input')))
        # username.send_keys("@DhruvPa15607876")
        
        # time.sleep(5)
        
        # password =  WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="layers"]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[3]/div/label/div/div[2]/div[1]/input')))
        # password.send_keys("Dhruv$$152002")
        # time.sleep(5)
        
        
        # driver.get(f'https://twitter.com/search?q={enteredName}&src=typed_query&f=list')
        
        # time.sleep(5)

        # for _ in range(3):
        #     driver.find_element_by_tag_name('body').send_keys(Keys.END)
        #     time.sleep(2)

        # results = driver.find_elements_by_css_selector(".css-1qaijid, .r-bcqeeo, .r-qvutc0")

        # for result in results:
        #     print(result.text)
        
        # ####################### ################## #################################### ###################
        
        # time.sleep(10)
        # following = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH,'//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/div/div/div[5]/div[1]/a/span[1]/span')))
        # followers = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH,'//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/div/div/div[5]/div[2]/a/span[1]/span')))
        # print("Following ",following.text,"Followers ",followers.text)
        # time.sleep(10)

        # driver.quit()

        scraper = Nitter(0)
        tweets = scraper.get_tweets(enteredName, mode = 'user', number=10)  
        print("tweets -------------------------------------------------------------- ",tweets)
        final_tweets = []
        for x in tweets['tweets']:
        #     print(x)
        #     print('------------------------')
            data = [x['link'], x['text'],x['date'],x['stats']['likes'],x['stats']['comments'],x['stats']['retweets']]
            # data = [x['stats']['likes'],x['stats']['comments']]
            final_tweets.append(data)
            # print(x['text'],x['stats']['likes'])
        print("final_tweets -------------------------------------------------------------- ",final_tweets)

        hashtag_data['hashtag_stats'][0]['twitter_stats'] = {
        # "followers" : followers.text,
        # "followings" : following.text,
        "followers" : '111 M',
        "followings" : '1212',
        "joining_date" : '2020-01-11', 
        "comments" : []
           }

        if(tweets['tweets']):
            for i in range(0,3):
                hashtag_data['hashtag_stats'][0]['twitter_stats']["comments"].append({
                                "text":final_tweets[i][1],
                                "url":final_tweets[i][0],
                                "likes":final_tweets[i][3],
                                "retweets": final_tweets[i][5],
                                "comments":final_tweets[i][4],
                #                 # "text":x['text'],
                #                 # "url":x['link'],
                #                 # "likes":x['stats']['likes'],
                #                 # "retweets": x['stats']['retweets'],
                #                 # "comments":x['stats']['comments'],
                                "comment_date": final_tweets[i][2]
                                # "comment_date": "2020-01-05"
            })
    
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