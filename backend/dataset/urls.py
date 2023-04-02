from django.urls import path

from . import views

urlpatterns = [
    path("", views.ListDatasets.as_view()),
    path("<str:ds_name>/", views.DatasetDetail.as_view()),
    path("<str:ds_name>/image_upload/", views.ImageUpload.as_view()),
    path("<str:ds_name>/annotation_upload/", views.AnnotationsUpload.as_view()),
    path("<str:ds_name>/<str:image_name>/", views.ImageDetail.as_view()),
    path("<str:ds_name>/<str:image_name>/annotations/", views.AnnotationDetail.as_view()),
    path("<str:ds_name>/<str:image_name>/data/", views.ImageData.as_view()),
]