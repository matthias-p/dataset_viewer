from pathlib import Path

import redis
from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound
from django.views import View
from pymongo import MongoClient
from rest_framework import status, views
from rest_framework.request import Request
from rest_framework.response import Response

from . import serializers

r = redis.Redis("redis", 6379, decode_responses=True)
mongo = MongoClient("mongo", 27017, username="mongoadmin", password="secret")


class ListDatasets(views.APIView):
    def get(self, request):
        result = []

        datasets = r.smembers("datasets")

        for dataset in datasets:
            annotations = r.smembers(f"{dataset}:annotations")
            temp = []
            for annotation in annotations:
                temp.append({
                    "name": annotation,
                    "categories": r.smembers(f"{dataset}:{annotation}:categories")
                })
            result.append({
                "dataset": dataset,
                "annotations": temp
            })
        
        return Response(result)
    

class DatasetDetail(views.APIView):
    def get(self, request: Request, ds_name):
        if "ann" in request.query_params and "cat" in request.query_params:
            db = mongo[ds_name]

            annotation_files = request.query_params.getlist("ann")
            categories = request.query_params.getlist("cat")
            filter_mode = request.query_params.get("fm", "union")

            results = []
            if filter_mode == "union":
                for annotation_file in annotation_files:
                    results += db[annotation_file].find({"annotations.category": {"$in": categories}}, {"_id": 1})
            else:
                for annotation_file in annotation_files:
                    results += db[annotation_file].find({"annotations.category": {"$all": categories}}, {"_id": 1})
            
            results = [doc.get("_id") for doc in results]
            return Response({"ids": set(results)})

        return Response({"ids": r.smembers(f"{ds_name}:ids")})  # default which returns all ids of the dataset
    

class ImageDetail(views.APIView):
    def get(self, request: Request, ds_name, image_name):
        if "annotation_files" not in request.query_params:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        db = mongo[ds_name]

        images = [db[file].find_one({"_id": image_name}) for file in request.query_params.getlist("annotation_files")]
        return Response(images)
    

class ImageData(View):
    def get(self, request, ds_name, image_name):
        image_path: Path = settings.BASE_DIR / "images" / ds_name / image_name
        if image_path.exists():
            return FileResponse(open(image_path, "rb"))
        else:
            return HttpResponseNotFound()


class ImageUpload(views.APIView):
    serializer_class = serializers.ImageUploadSerializer

    def post(self, request: Request, ds_name):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save(dataset_name=ds_name)
            return Response("valid" ,status=status.HTTP_201_CREATED)
        
        return Response("invalid" ,status=status.HTTP_400_BAD_REQUEST)
    

class AnnotationsUpload(views.APIView):
    serializer_class = serializers.AnnotationUploadSerializer

    def post(self, request: Request, ds_name):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save(dataset_name=ds_name)
            return Response("valid" ,status=status.HTTP_201_CREATED)
        
        return Response("invalid" ,status=status.HTTP_400_BAD_REQUEST)
