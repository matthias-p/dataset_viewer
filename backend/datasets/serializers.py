import logging
import os
from zipfile import ZipFile
from threading import Thread
import tempfile
from pathlib import Path
import shutil

from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
from pymongo import MongoClient
from rest_framework import serializers

from . import cocoparser

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")


def handleUploadedData(zip):
    # with ZipFile(file, "r") as zip:
    logger.warning("reading archive")
    zip_infos = zip.infolist()
    annotation = [zip for zip in zip_infos if zip.filename.endswith(".json")][0]
    zip_infos.remove(annotation)

    logger.warning("Parsing annotations")
    fp = zip.open(annotation)
    parser = cocoparser.CocoDataset(fp)
    fp.close()

    logger.warning("Writing annotations to db")
    client = MongoClient("mongo", 27017, username="mongoadmin", password="secret")
    db = client[parser.ds_name]
    db["metadata"].insert_one(parser.export_metadata())
    db["images"].insert_many(parser.export_images())

    logger.warning("Extracting images")
    extract_to = settings.BASE_DIR / "images" / parser.ds_name
    for zip_info in zip_infos:
        if zip_info.is_dir():
            continue
        zip_info.filename = os.path.basename(zip_info.filename)
        zip.extract(zip_info, extract_to)


def handleData(tempdir: tempfile.TemporaryDirectory):
    tempdir_path = Path(tempdir.name)

    logger.warning("Parsing annotations")
    annotation_file = list(tempdir_path.glob("*.json"))[0]
    annotation_fp = open(annotation_file, "r")
    parser = cocoparser.CocoDataset(annotation_fp)
    annotation_fp.close()

    logger.warning("Writing annotations to db")
    logger.warning(parser.ds_name)
    client = MongoClient("mongo", 27017, username="mongoadmin", password="secret")
    db = client[parser.ds_name]
    db["metadata"].insert_one(parser.export_metadata())
    db["images"].insert_many(parser.export_images())
    db["statistics"].insert_one(parser.export_statistics())

    logger.warning("Extracting images")
    image_dir = [dir for dir in tempdir_path.iterdir() if dir.is_dir()][0]
    copy_to: Path = settings.BASE_DIR / "images" / parser.ds_name
    shutil.copytree(image_dir, copy_to)

    logger.warning("Done with data")
    tempdir.cleanup()


class UploadSerializer(serializers.Serializer):
    dataset = serializers.FileField()

    def save(self, **kwargs):
        file: UploadedFile = self.validated_data["dataset"]

        temp_dir = tempfile.TemporaryDirectory()
        logger.warning("extracting archive")
        with ZipFile(file) as zip:
            zip.extractall(temp_dir.name)

        t = Thread(target=handleData, args=[temp_dir])
        t.start()

        # zipfile = ZipFile(file)
        # t = Thread(target=handleUploadedData, args=[zipfile])
        # t.start()


class ImageUploadSerializer(serializers.Serializer):
    dataset_name = serializers.CharField()
    images = serializers.FileField()

    def save(self, **kwargs):
        dataset_name = self.validated_data["dataset_name"]
        file: UploadedFile = self.validated_data["images"]

        extract_to: Path = settings.BASE_DIR / "images" / dataset_name

        with ZipFile(file) as zip:
            zip.extractall(str(extract_to))


class AnnotationUploadSerializer(serializers.Serializer):
    dataset_name = serializers.CharField()
    annotations = serializers.FileField()

    def save(self, **kwargs):
        dataset_name = self.validated_data["dataset_name"]
        file: UploadedFile = self.validated_data["annotations"]

        parser = cocoparser.CocoDataset(file)
