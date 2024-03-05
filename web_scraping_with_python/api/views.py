import base64
import json
import os
from django.views import View
from dotenv import load_dotenv
load_dotenv()

USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')
DEVELOPER_KEY = os.getenv('DEVELOPER_KEY')
TWITTER_API_KEY = os.getenv('API_KEY')
EMAIL = os.getenv("EMAIL")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

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
from datetime import datetime
from django.http import JsonResponse
from openpyxl import Workbook
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.shortcuts import get_object_or_404


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ntscraper import Nitter
from tqdm import tqdm
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


# class UserProfileView(View):
#     template_name = 'profile.html'

#     def get(self, request, *args, **kwargs):
#         user_profile = UserProfile.objects.get(user=request.user)
#         return render(request, self.template_name, {'user_profile': user_profile})

#     def post(self, request, *args, **kwargs):
#         user_profile = UserProfile.objects.get(user=request.user)
#         serializer = UserProfileSerializer(user_profile, data=request.POST, files=request.FILES)
        
#         if serializer.is_valid():
#             serializer.save()
#             return redirect('user_profile')
#         else:
#             # Handle invalid serializer data
#             return render(request, self.template_name, {'user_profile': user_profile, 'serializer': serializer})

class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class HashTagListView(generics.ListAPIView):
    queryset = HashTag.objects.all()
    serializer_class = HashTagSerializer

class AnalysisReportListCreateView(generics.CreateAPIView):
    serializer_class = AnalysisReportSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        user_id = serializer.validated_data['user']
        url = serializer.validated_data['url']

        # Create the directory if it doesn't exist
        directory = 'api/excel_reports'
        os.makedirs(directory, exist_ok=True)

        # Use the user_id as the file name
        file_name = f'{user_id}_report.xlsx'
        file_path = os.path.join(directory, file_name)

        # Update the URL field in the serializer with the file path
        serializer.validated_data['url'] = file_path
        serializer.save()

        # Generate your Excel file content here, for example using pandas
        # This is just an example, adjust it based on your data structure
        data = {'url': [url]}
        df = pd.DataFrame(data)
        df.to_excel(file_path, index=False)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class GetAnalysisReport(generics.ListAPIView):
    queryset = AnalysisReport.objects.all()
    serializer_class = AnalysisReportSerializer
    
    
################################################################################## TO-DO ###########################################################

# class GetDocumentURLView(generics.RetrieveAPIView):
#     serializer_class = AnalysisReportSerializer

#     def get(self, request, *args, **kwargs):
#         user_id = kwargs.get('user_id', None)

#         if not user_id:
#             return Response({'error': 'User ID is required.'}, status=400)

#         try:
#             analysis_report = AnalysisReport.objects.get(user=user_id)
#             serializer = self.get_serializer(analysis_report)
#             document_url = serializer.data['url']

#             # Check if the file exists
#             if os.path.exists(document_url):
#                 # Open the file and return it as a response
#                 with open(document_url, 'rb') as file:
#                     response = HttpResponse(file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

#                     # Set the Content-Disposition header
#                     response['Content-Disposition'] = f'inline; filename="{os.path.basename(document_url)}"'

#                     return response
#             else:
#                 return Response({'error': 'File not found.'}, status=404)

#         except AnalysisReport.DoesNotExist:
#             return Response({'error': 'Analysis report not found for the user.'}, status=404)
#         except Exception as e:
#             return Response({'error': str(e)}, status=500)

######################################################################################################################################################  

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

# class GetUser(APIView):
#     serializer_class = UserSerializer
#     lookup_url_kwarg = 'user_id'
#     def get(self,request,format=None):
#         userID = request.GET.get(self.lookup_url_kwarg)
#         if userID != None:
#             user = User.objects.filter(user_id=userID)
#             if len(user)>0:
#                 data = UserSerializer(user[0]).data
#                 data['is_logged_in'] = True
#                 return Response(data,status=status.HTTP_200_OK)
#             return Response({'Bad Request':'Invalid code'},status=status.HTTP_404_NOT_FOUND)
#         return Response({'Bad Request':'Code not found in request'},status=status.HTTP_400_BAD_REQUEST)
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

        
        ##############################################################################
        
    ############################################################### YouTube ###############################################################
    
        hashtag_data = {}
        
        driver = webdriver.Chrome()
        # # chrome_options = webdriver.ChromeOptions()
        # # chrome_options.add_argument("--headless")
        # # chrome_options.add_argument('--ignore-certificate-errors')
        # # driver = webdriver.Chrome(options=chrome_options)
        
        enteredName = hashtagName
        
        
        hashtag_data = {}
        hashtag_data['hashtag'] = enteredName
        hashtag_data['hashtag_stats'] = [{}]
        # hashtag_data['hashtag_stats'][0]['user'] = 17
        hashtag_data['hashtag_stats'][0]['user'] = user_id
        hashtag_data['hashtag_stats'][0]['youtube_stats'] = {}
        hashtag_data['hashtag_stats'][0]['instagram_stats'] = {}
        hashtag_data['hashtag_stats'][0]['twitter_stats'] = {}
        
        
        youTuberName = "https://youtube.com/@"+enteredName
        driver.get('https://commentpicker.com/youtube-channel-id.php')
        time.sleep(2)
        
        inputUrl = WebDriverWait(driver,20).until(EC.presence_of_element_located((By.XPATH,'//*[@id="js-youtube-link"]')))
        inputUrl.send_keys(youTuberName)
        time.sleep(5)
        
        number1 = WebDriverWait(driver,30).until(EC.presence_of_element_located((By.XPATH,'//*[@id="captcha-x"]')))
        number2 = WebDriverWait(driver,30).until(EC.presence_of_element_located((By.XPATH,'//*[@id="captcha-y"]')))
        sum=int(number1.text) +int( number2.text)
        time.sleep(2)
        
        input_answer = WebDriverWait(driver,20).until(EC.presence_of_element_located((By.XPATH,'//*[@id="captcha"]')))
        input_answer.send_keys(sum)
        time.sleep(20)
        
        print("Before the error point ___________________________")
        getButton = WebDriverWait(driver,20).until(EC.presence_of_element_located((By.XPATH,'//*[@id="js-start-button"]')))
        getButton.click()
        time.sleep(5)
        print("After the error point ___________________________")

        print("Before the error point 2 ___________________________")
        channel_ID = WebDriverWait(driver,20).until(EC.presence_of_element_located((By.XPATH,'//*[@id="js-results-id"]')))
        print("After the error point 2___________________________")        
        time.sleep(5)
    
        # channel_ID = "UC61Y04JVLkByFRv1K3V-KGQ"
        
        api_service_name = "youtube"
        api_version = "v3"
        
        youtube = googleapiclient.discovery.build(
            api_service_name, api_version, developerKey=DEVELOPER_KEY)

        
        request = youtube.channels().list(
            part="snippet,contentDetails,statistics",
            id=channel_ID.text,
            # id=channel_ID,
            maxResults=10
        )
        response = request.execute()
        # print(response)
        data=[]
        for i in range(1):
            finalinfo = dict(Name=response['items'][i]['snippet']['title'],
                            views_count=response['items'][i]['statistics']['viewCount'],
                            subscriber_count=response['items'][i]['statistics']['subscriberCount'],video_count=response['items'][i]['statistics']['videoCount'])
            data.append(finalinfo)
        # print(data)

        hashtag_data['hashtag_stats'][0]['youtube_stats']['name']=data[0]['Name']
        hashtag_data['hashtag_stats'][0]['youtube_stats']['current_status']=[]
        hashtag_data['hashtag_stats'][0]['youtube_stats']['current_status'].append({
            "current_date" : "2022-01-22",
            "views_count" : data[0]['views_count'],
            "subscriber_count" : data[0]['subscriber_count'],
            "video_count" : data[0]['video_count']
        })
        driver.quit()
        
        
        
        # # ############################################################### Instagram ###############################################################

        
        driver = webdriver.Chrome()
        
        
        #                                                                         # # chrome_options = webdriver.ChromeOptions()
        #                                                                         # # chrome_options.add_argument("--headless")
        #                                                                         # # driver = webdriver.Chrome(options=chrome_options)
        
        url = 'https://www.instagram.com/'
        driver.get(url)
        time.sleep(10)
        username = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.NAME,'username')))
        username.send_keys("codestarted01")
        time.sleep(10)
        password = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.NAME,'password')))
        password.send_keys("UnknownCoder")
        time.sleep(10)
        login = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,'//*[@id="loginForm"]/div/div[3]/button')))
        login.click()
        
        time.sleep(5)
        driver.get(url+enteredName)
        time.sleep(10)
        ul = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.TAG_NAME,'ul')))
        items = ul.find_elements(By.TAG_NAME,'li')
        numeric_part = ''.join(c for c in items[0].text if c.isdigit())

        posts_value = int(numeric_part)  
        
        hashtag_data['hashtag_stats'][0]['instagram_stats']['current_status']=[] 
        hashtag_data['hashtag_stats'][0]['instagram_stats']['current_status'].append({
                "current_date":"2022-01-11",
                "followers" : items[1].text,
                "followings" : items[2].text,
                "posts" : posts_value
            })

        driver.quit()
        
        ############################################################### Twitter ###############################################################

        driver = webdriver.Chrome()
        
        driver.get("https://twitter.com/"+enteredName)
        
        ############################################### ####### ################### ########################
        
        # driver.get('https://twitter.com/i/flow/login?redirect_after_login=%2Fsearch%3Fq%3Dbjp%26src%3Dtyped_query%26f%3Dlist')
        
        # time.sleep(10)
        
        # username = WebDriverWait(driver,20).until(EC.presence_of_element_located((By.XPATH,'//*[@id="react-root"]/div/div/div/main/div/div/div/div[2]/div[2]/div/div[5]/label/div/div[2]/div/input')))
        # username.send_keys("@DhruvPa15607876")
        
        # time.sleep(10)
        
        # password =  WebDriverWait(driver,20).until(EC.presence_of_element_located((By.XPATH,'//*[@id="layers"]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[3]/div/label/div/div[2]/div[1]/input')))
        # password.send_keys("Dhruv$$152002")
        # time.sleep(10)
        
        
        # driver.get(f'https://twitter.com/search?q={enteredName}&src=typed_query&f=list')
        
        # time.sleep(5)

        # for _ in range(3):
        #     driver.find_element_by_tag_name('body').send_keys(Keys.END)
        #     time.sleep(2)

        # results = driver.find_elements_by_css_selector(".css-1qaijid, .r-bcqeeo, .r-qvutc0")

        # for result in results:
        #     print(result.text)
        
        # ####################### ################## #################################### ###################
        
        time.sleep(10)
        following = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH,'//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/div/div/div[5]/div[1]/a/span[1]/span')))
        followers = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH,'//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/div/div/div[5]/div[2]/a/span[1]/span')))
        time.sleep(10)

        print("Following ",following.text,"Followers ",followers.text)
        hashtag_data['hashtag_stats'][0]['twitter_stats'] = {
        "current_status":[],
        "joining_date" : '2020-01-11', 
        "comments" : []
        }
        
        hashtag_data['hashtag_stats'][0]['twitter_stats']['current_status'].append({
            "current_date" : "2022-02-11",
            "followers" : followers.text,
            "followings" : following.text,
        })
        
    
        driver.quit()

        # scraper = Nitter(0)
        # print("before tweets -------------------------------------------------------------- ")
        # tweets = scraper.get_tweets(enteredName, mode = 'hashtag', number=10)  

        # # tweets = scraper.get_tweets(enteredName, mode = 'user', number=10)  
        # print("After tweets -------------------------------------------------------------- ")
        # print("tweets -------------------------------------------------------------- ",tweets)
        # final_tweets = []
        # for x in tweets['tweets']:
        # #     print(x)
        # #     print('------------------------')
        #     data = [x['link'], x['text'],x['date'],x['stats']['likes'],x['stats']['comments'],x['stats']['retweets']]
        #     # data = [x['stats']['likes'],x['stats']['comments']]
        #     final_tweets.append(data)
        #     # print(x['text'],x['stats']['likes'])
        # # # print("final_tweets -------------------------------------------------------------- ",final_tweets)

    

        # if(tweets['tweets']):
        #     for i in range(0,3):
        #         hashtag_data['hashtag_stats'][0]['twitter_stats']["comments"].append({
        #                         "text":final_tweets[i][1],
        #                         "url":final_tweets[i][0],
        #                         "likes":final_tweets[i][3],
        #                         "retweets": final_tweets[i][5],
        #                         "comments":final_tweets[i][4],
        #                         "comment_date": final_tweets[i][2]
        #     })



    ####################################################################################################################################################################

        
        
        ##########################################################
        # execute the code by the command line
        # create .bat 
        # task schedular
        # for the instagram and youtube
        ##########################################################        
        
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
        number_of_tweets = 25
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
        
        subject = 'Password Reset'
        message = f'Dear {user.user_id},\n\nOpen the following URL in the browser: http://127.0.0.1:8000/reset-password'

        msg = MIMEMultipart()
        msg.attach(MIMEText(message, 'plain'))

        # Setup the parameters of the message
        msg['From'] = EMAIL
        msg['To'] = user_email
        msg['Subject'] = subject
        print("before sending mail ",EMAIL,"password : ",EMAIL_PASSWORD)
        # Connect to the SMTP server, send the email, and close the connection
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
    

@method_decorator(csrf_exempt, name='dispatch')
class ResetPassword(View):
    
    def post(self, request, *args, **kwargs):
      
        print("inside the reset password")
        request_data = json.loads(request.body.decode('utf-8'))

            # Access the 'email' field
        user_email = request_data.get('email')
        user_password = request_data.get('password')
        
        print("email ",user_email,"password ",user_password)
        
        
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            print("User not find")
            return JsonResponse({"message": "This email address is not registered."}, status=404)        
        if(user):
            print("old password ",user.password)
            user.password = user_password
            print("New password ",user.password)
            print("after the user password")
            user.save()  
            print("after the save")    
            return HttpResponse("Password reset successfully!",status=200)
        
        return HttpResponse("This email address is not registered.")

