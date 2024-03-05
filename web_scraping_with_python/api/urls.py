from django.urls import path

from .views import AnalysisReportListCreateView, CreateHashTag, CreateUserHistory, CreateUserView, DeleteAllHashTag, DeleteHistory, DeleteUser, ForgotPassword, GetAnalysisReport, GetHashTagData, GetUser, GetUserHistoryByID, GetUserProfilePhoto, HashTagListView, HashTagTwitterSearch, HistoryView, ResetPassword, UserLogin, UserProfilePhotoView, UserView, SearchFromChrome

urlpatterns = [
    path('user',UserView.as_view()),
    path('create-user',CreateUserView.as_view()),
    path('get-user',GetUser.as_view()),
    path('user-login',UserLogin.as_view()),
    path('delete-user',DeleteUser.as_view()),
    path('create-hashtag',CreateHashTag.as_view()),
    path('get-all-hashtag',HashTagListView.as_view()),
    path('get-hashtag',GetHashTagData.as_view()),
    path('delete-hashtag',DeleteAllHashTag.as_view()),
    path('search',SearchFromChrome.as_view()),
    path('twitter/search',HashTagTwitterSearch.as_view()),
    path('create-user-history',CreateUserHistory.as_view()),
    path('my-history/<str:user_id>',GetUserHistoryByID.as_view()),
    path('delete-all-history',DeleteHistory.as_view()),
    path('history',HistoryView.as_view()),
    path('save-analysis-reports', AnalysisReportListCreateView.as_view()),
    path('get-analysis-reports',GetAnalysisReport.as_view()),
    # path('user-profile-photo/', UserProfilePhotoView.as_view()),
    path('forgot-password',ForgotPassword.as_view()),
    path('reset-password',ResetPassword.as_view()),
    # path('my-reports/<str:user_id>',GetDocumentURLView.as_view())
    path('user-profile-photo',UserProfilePhotoView.as_view()),
    path('api/get-user-profile-photo/<str:user_id>/profile_photos/<str:png_id>/', GetUserProfilePhoto.as_view()),

]
    