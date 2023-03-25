import json
import typing
from collections import defaultdict

import numpy as np

from pathlib import Path

class CocoCategory:
    def __init__(self, category_dict: dict) -> None:
        self.name = category_dict.get("name")


class CocoImage:
    def __init__(self, image_dict: dict, id: int) -> None:
        self.id = id
        self.filename = image_dict.get("file_name")
        self.height = image_dict.get("height")
        self.width = image_dict.get("width")

        self.annotations: list[CocoAnnotation] = []

    def register_annotation(self, annotation) -> None:
        self.annotations.append(annotation)

    def to_json(self) -> dict:
        return {
            "_id": self.id,
            "name": self.filename,
            "height": self.height,
            "width": self.width,
            "annotations": [annotation.to_json() for annotation in self.annotations]
        }


class CocoAnnotation:
    def __init__(self, anno_dict: dict, category: CocoCategory, image: CocoImage) -> None:
        bbox = anno_dict.get("bbox", [])
        self.xtl = bbox[0]
        self.ytl = bbox[1]
        self.width = bbox[2]
        self.height = bbox[3]
        self.area = anno_dict.get("area")
        self.segmentation = anno_dict.get("segmentation")
        self.iscrowd = anno_dict.get("iscrowd")

        self.category = category
        self.image = image

        self.image.register_annotation(self)

    def to_json(self) -> dict:
        return {
            "category": self.category.name,
            "xtl": self.xtl,
            "ytl": self.ytl,
            "width": self.width,
            "height": self.height,
            "area": self.area,
            "segmentation": self.segmentation,
            "iscrowd": self.iscrowd,
        }


class CocoDataset:
    def __init__(self, annotation_fp: typing.TextIO | typing.BinaryIO) -> None:
        self.ds_name = annotation_fp.name.removesuffix(".json").split("/")[-1]
        self.annotation_fp = annotation_fp

        self.categories: list[CocoCategory] = []
        self.images: list[CocoImage] = []
        self.annotations: list[CocoAnnotation] = []

        self._parse()

    def _parse(self) -> None:
        annotations: dict = json.load(self.annotation_fp)
        
        category_map = {}
        for category in annotations.get("categories"):
            id = category.get("id")
            coco_category = CocoCategory(category_dict=category)
            category_map[id] = coco_category
            self.categories.append(coco_category)

        image_map = {}
        for i, image in enumerate(annotations.get("images")):
            id = image.get("id")
            coco_image = CocoImage(image_dict=image, id=i)
            image_map[id] = coco_image
            self.images.append(coco_image)

        for annotation in annotations.get("annotations"):
            image_id = annotation.get("image_id")
            category_id = annotation.get("category_id")

            self.annotations.append(CocoAnnotation(
                anno_dict=annotation, category=category_map.get(category_id), image=image_map.get(image_id)
            ))
    
    def export_metadata(self) -> dict:
        return {
            "dataset_name": self.ds_name,
            "number_of_images": len(self.images),
            "number_of_categories": len(self.categories),
            "number_of_annotations": len(self.annotations),
            "categories": [category.name for category in self.categories],
        }

    def export_images(self) -> list[dict]:
        return [image.to_json() for image in self.images]
    
    def export_statistics(self):
        instances_per_image = defaultdict(int)
        categories_per_image = defaultdict(int)
        instances_per_category = defaultdict(int)
        normalized_instance_areas = []
        bbox_centers = np.zeros((100, 100))

        for image in self.images:
            categories = set()
            instances_per_image[str(len(image.annotations))] += 1
            image_area = image.height * image.width

            for annotation in image.annotations:
                bbox_center_x = int((annotation.xtl + (annotation.width / 2)) / image.width * 100)
                bbox_center_y = int((annotation.ytl + (annotation.height / 2)) / image.height * 100)

                bbox_centers[bbox_center_y][bbox_center_x] += 1

                categories.add(annotation.category.name)
                instances_per_category[str(annotation.category.name)] += 1
                normalized_instance_areas.append(annotation.area / image_area)
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
            },
            "bbox_centers": {
                "z": list(reversed(bbox_centers.tolist()))
            }
        }

