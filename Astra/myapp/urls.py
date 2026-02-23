from django.urls import path
# from .views import MyAPIView
from . import views
from django.shortcuts import render
from .views import ChatbotResponseAPIView
from .views import chatbot_response



urlpatterns = [
   path('', views.index, name='index'),  # Index page
    path('frontend/', views.frontend, name='frontend'),  # Frontend page
    path('chatbot-response/', ChatbotResponseAPIView.as_view(), name='chatbot_response'),  # API endpoint
      path('api/chat', views.chatbot_response, name='chatbot_response'),
       path('chatbot-response/', chatbot_response, name='chatbot_response'),

]