from pathlib import Path

from pymongo import MongoClient
from rest_framework import status, views
from rest_framework.request import Request
from rest_framework.response import Response

from django.views import View
from django.http import FileResponse, HttpResponseNotFound
from django.conf import settings

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
    

class DatasetIndexes(views.APIView):
    def get(self, request: Request, **kwargs):
        db = client[kwargs.get("ds_name")]

        if "category" in request.query_params:
            result = db["images"].find({"annotations.category": {"$in": request.query_params.getlist("category")}}, {"_id": 1})
        else:
            result = db["images"].find({}, {"_id": 1})

        return Response({
            "indexes": [doc.get("_id") for doc in result]
        })
    

class ImageDetail(views.APIView):
    def get(self, request: Request, **kwargs):
        id = 0
        if "index" in request.query_params:
            id = int(request.query_params.get("index"))

        db = client[kwargs.get("ds_name")]
        image = db["images"].find_one({"_id": id})

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
        

class Testview(View):
    def get(self, request):
        filepath = Path(__file__).parent / "bridge.jpg"
        fp = open(filepath, "rb")
        return FileResponse(fp)
