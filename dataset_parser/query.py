from pymongo import MongoClient
import time


def main():
    client = MongoClient("localhost", 27017, username="mongoadmin", password="secret")

    db = client["instances_val2017_test"]

    print(db.list_collection_names())

    
    # cursor = db["images"].find({"annotations.category": {"$all": ["broccoli", "carrot"]}}, {"_id": 1})
    # cursor = db["images"].find({}, {"_id": 1})
    # result = [doc for doc in cursor]
    # print(len(result))

if __name__ == "__main__":
    main()