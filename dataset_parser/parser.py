import json

from pathlib import Path

from pymongo import MongoClient


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
            "segmentation": self.segmentation,
            "iscrowd": self.iscrowd
        }


class CocoDataset:
    def __init__(self, annotation_file_path: Path) -> None:
        self.ds_name = annotation_file_path.stem
        self.annotation_file_path = annotation_file_path

        self.categories: list[CocoCategory] = []
        self.images: list[CocoImage] = []
        self.annotations: list[CocoAnnotation] = []

        self._parse()

    def _parse(self) -> None:
        with open(self.annotation_file_path, "r") as annotation_file:
            annotations: dict = json.load(annotation_file)
        
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



def main():
    ds = CocoDataset(Path("/home/matthias/Downloads/annotations_trainval2017/annotations/instances_val2017.json"))
    images = ds.export_images()
    for image in images:
        for annotation in image.get("annotations"):
            if annotation.get("iscrowd") == 0:
                print(annotation)
                break
        else:
            continue
        break

    # client = MongoClient("localhost", 27017, username="mongoadmin", password="secret")
    # db = client[ds.ds_name]
    # db["metadata"].insert_one(ds.export_metadata())
    # db["images"].insert_many(ds.export_images())


if __name__ == "__main__":
    main()
