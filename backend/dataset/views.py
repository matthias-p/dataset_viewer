from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request
import redis

from . import serializers


r = redis.Redis("redis", 6379, decode_responses=True)

class ListDatasets(views.APIView):
    def get(self, request):
        result = []

        datasets = r.smembers("datasets")

        for dataset in datasets:
            annotations = r.smembers(f"{dataset}:annotations")
            result.append({
                "dataset": dataset,
                "annotations": annotations
            })
        
        return Response(result)


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
