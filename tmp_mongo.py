from pymongo import MongoClient


client = MongoClient("mongodb+srv://Vishrut_Patel:93Vishrut95!@cluster0-pdqdm.mongodb.net/test")
db = client.test

print client
print db
