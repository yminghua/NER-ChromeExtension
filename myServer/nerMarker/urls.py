from django.urls import path
from . import views

urlpatterns = [
    path('gettext/', views.NER_processing)
]
