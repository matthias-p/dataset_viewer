from pymongo import MongoClient
import time


def main():
    client = MongoClient("localhost", 27017, username="mongoadmin", password="secret")

    db = client["instances_val2017"]

    
    t1 = time.time()
    cursor = db["images"].find({"annotations.category": {"$in": ["broccoli", "boat"]}}, {"_id": 1})
    # cursor = db["images"].find({}, {"_id": 1})
    result = [doc for doc in cursor]
    t2 = time.time()
    print(t2 - t1)

if __name__ == "__main__":
    main()