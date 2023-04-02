from pathlib import Path
from zipfile import ZipFile

from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
from pymongo import MongoClient
from rest_framework import serializers
from PIL import Image
import redis

from . import cocoparser


class ImageUploadSerializer(serializers.Serializer):
    images = serializers.FileField()

    def save(self, dataset_name, **kwargs):
        file: UploadedFile = self.validated_data["images"]

        extract_to: Path = settings.BASE_DIR / "images" / dataset_name

        with ZipFile(file) as zip:
            zip.extractall(str(extract_to))

        r = redis.Redis(host="redis", port=6379)
        r.sadd("datasets", dataset_name)

        fps = sorted(extract_to.iterdir())
        ids = [file.name for file in fps]

        r.sadd(f"{dataset_name}:ids", *ids)

        images = []
        for path in fps:
            w, h = Image.open(path).size
            images.append({
                "_id": path.name,
                "height": h,
                "width": w
            })
        
        client = MongoClient("mongo", 27017, username="mongoadmin", password="secret")
        client.drop_database(dataset_name)
        db = client[dataset_name]
        db["images"].insert_many(images)


class AnnotationUploadSerializer(serializers.Serializer):
    annotations = serializers.FileField()

    def save(self, dataset_name, **kwargs):
        file: UploadedFile = self.validated_data["annotations"]
        annotation_file = file.name

        parser = cocoparser.CocoDataset(file)

        client = MongoClient("mongo", 27017, username="mongoadmin", password="secret")
        db = client[dataset_name]
        db[annotation_file].insert_many(parser.export_image_annotations())
        db[f"{annotation_file}_metadata"].insert_one(parser.export_metadata())
        db[f"{annotation_file}_statistics"].insert_one(parser.export_statistics())

        r = redis.Redis(host="redis", port=6379)
        r.sadd(f"{dataset_name}:annotations", annotation_file)
        r.sadd(f"{dataset_name}:{annotation_file}:categories", *parser.export_metadata().get("categories"))
