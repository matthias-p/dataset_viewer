from django.urls import path

from . import views

urlpatterns = [
    path("", views.ListDatasets.as_view()),
    path("upload/", views.DatasetUpload.as_view()),
    path("<str:ds_name>/", views.ImageDetail.as_view()),
    path("<str:ds_name>/indexes/", views.DatasetIndexes.as_view()),
    path("<str:ds_name>/metadata/", views.DatasetMetadata.as_view()),
    path("<str:ds_name>/statistics/", views.DatasetStatistics.as_view()),
    path("<str:ds_name>/images/<str:image_name>/", views.ImageData.as_view())
]