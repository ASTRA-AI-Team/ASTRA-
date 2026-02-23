from django.urls import path
from .views import MyAPIView
from . import views
from django.shortcuts import render
from .views import chatbot_response


urlpatterns = [
    path('api/data/', MyAPIView.as_view(), name='api-data'),
    path('', views.index, name='index'),
    path('', views.frontend, name='frontend'),
    path('', lambda request: render(request, 'myapp/index.html'), name='home'),
    path('chatbot/', chatbot_response, name='chatbot_response'),
]
