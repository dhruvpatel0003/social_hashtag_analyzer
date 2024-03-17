from django.urls import path

from .views import AnalizeText, AnalysisReportListCreateView, CreateHashTag, CreateUserHistory, CreateUserView, DeleteAllHashTag, DeleteAnalysisReport, DeleteHistory, DeleteUser, ForgotPassword, GetAllAnalysisReport, GetAnalysisReport, GetHashTagData, GetStoreApifyHashtag, GetUser, GetUserHistoryByID, GetUserProfilePhoto, HashTagListView, HashTagTwitterSearch, HistoryView, PasswordResetHandler, TokenExpirationChecker, UserLogin, UserProfilePhotoView, UserView, SearchFromChrome

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
    path('get-analysis-reports/<str:user_id>',GetAnalysisReport.as_view()),
    path('get-all-analysis-reports/',GetAllAnalysisReport.as_view()),
    path('delete-analysis-reports',DeleteAnalysisReport.as_view()),
    # path('user-profile-photo/', UserProfilePhotoView.as_view()),
    path('forgot-password',ForgotPassword.as_view()),
    path('check-token-expiration/<str:token>',TokenExpirationChecker.as_view()),
    path('reset-password/<str:token>',PasswordResetHandler.as_view()),
    # path('my-reports/<str:user_id>',GetDocumentURLView.as_view())
    path('user-profile-photo',UserProfilePhotoView.as_view()),
    path('get-user-profile-photo/<str:user_id>/profile_photos/<str:png_id>', GetUserProfilePhoto.as_view()),
    path('analize-text',AnalizeText.as_view()),
    path('get-stored-apify-hashtag/<str:hashtag>',GetStoreApifyHashtag.as_view())
]
    