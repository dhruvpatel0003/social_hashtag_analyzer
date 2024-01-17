from django.shortcuts import render
from rest_framework import generics, status
from .serializers import UserSerializer, CreateUserSerializer
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response

class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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