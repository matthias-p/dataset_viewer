import shutil
from collections import defaultdict
from pathlib import Path

import numpy as np
from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound
from django.views import View
from pymongo import MongoClient
from rest_framework import status, views
from rest_framework.request import Request
from rest_framework.response import Response

from . import serializers

client = MongoClient("mongo", 27017, username="mongoadmin", password="secret")


class ListDatasets(views.APIView):
    default_dbs = ["admin", "config", "local"]

    def get(self, request):
        dbs = client.list_database_names()
        return Response({
            "datasets": set(dbs).difference(ListDatasets.default_dbs)
        })
    

class DatasetUpload(views.APIView):
    serializer_class = serializers.UploadSerializer

    def post(self, request: Request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("valid")

        return Response("invalid", status=status.HTTP_400_BAD_REQUEST)


class DatasetMetadata(views.APIView):
    def get(self, request, **kwargs):
        db = client[kwargs.get("ds_name")]
        metadata = db["metadata"].find_one({}, {"_id": 0})
        return Response(metadata)
    

class DatasetStatistics(views.APIView):
    def get(self, request, ds_name):
        db = client[ds_name]

        if "category" in request.query_params:
            if request.query_params.get("filterMode") == "union":
                result = db["images"].find({"annotations.category": {"$in": request.query_params.getlist("category")}})
            else:
                result = db["images"].find({"annotations.category": {"$all": request.query_params.getlist("category")}})

            statistics = self.statistics_from_images(result)
            
        else:
            statistics = db["statistics"].find_one({}, {"_id": 0})

        return Response(statistics)
    
    def statistics_from_images(self, images):
        instances_per_image = defaultdict(int)
        categories_per_image = defaultdict(int)
        instances_per_category = defaultdict(int)
        normalized_instance_areas = []

        for image in images:
            categories = set()
            instances_per_image[str(len(image.get("annotations")))] += 1
            image_area = image.get("height") * image.get("width")

            for annotation in image.get("annotations"):
                categories.add(annotation.get("category"))
                instances_per_category[str(annotation.get("category"))] += 1
                normalized_instance_areas.append(annotation.get("area") / image_area)
            categories_per_image[str(len(categories))] += 1
        
        values, bins = np.histogram(normalized_instance_areas, bins=10)
        bins = np.around(bins, decimals=2)
        values = values / np.sum(values)

        return {
            "instances_per_category": [{"key": k, "value": v} for k, v in instances_per_category.items()],
            "categories_per_image": [{"key": k, "value": v} for k, v in categories_per_image.items()],
            "instances_per_image": [{"key": k, "value": v} for k, v in instances_per_image.items()],
            "instance_size": {
                "bins": bins.tolist(),
                "values": values.tolist()
            }
        }

    

class DatasetIndexes(views.APIView):
    def get(self, request: Request, **kwargs):
        db = client[kwargs.get("ds_name")]

        if "category" in request.query_params:
            if request.query_params.get("filterMode") == "union":
                result = db["images"].find({"annotations.category": {"$in": request.query_params.getlist("category")}}, {"_id": 1})
            else:
                result = db["images"].find({"annotations.category": {"$all": request.query_params.getlist("category")}}, {"_id": 1})
        else:
            result = db["images"].find({}, {"_id": 1})

        return Response({
            "indexes": [doc.get("_id") for doc in result]
        })
    

class DatasetDetail(views.APIView):
    def delete(self, request, ds_name):
        client.drop_database(ds_name)
        image_dir = settings.BASE_DIR / "images" / ds_name
        shutil.rmtree(str(image_dir))

        return Response("ok")
    

class ImageDetail(views.APIView):
    def get(self, request: Request, ds_name: str, index: int, **kwargs):
        db = client[ds_name]
        image = db["images"].find_one({"_id": index})

        if image:
            return Response(image)
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        

class ImageData(View):
    def get(self, request, **kwargs):
        image_path: Path = settings.BASE_DIR / "images" / kwargs.get("ds_name") / kwargs.get("image_name")
        if image_path.exists():
            return FileResponse(open(image_path, "rb"))
        else:
            return HttpResponseNotFound()
