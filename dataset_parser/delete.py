from pymongo import MongoClient

client = MongoClient("localhost", 27017, username="mongoadmin", password="secret")
print(client.list_database_names())
client.drop_database("instances_val2017_test")
print(client.list_database_names())