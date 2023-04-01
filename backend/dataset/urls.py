from django.urls import path

from . import views

urlpatterns = [
    path("", views.ListDatasets.as_view()),
    path("<str:ds_name>/image_upload/", views.ImageUpload.as_view()),
    path("<str:ds_name>/annotation_upload/", views.AnnotationsUpload.as_view())
]