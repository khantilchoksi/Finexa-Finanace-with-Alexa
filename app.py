#!flask/bin/python

import datetime
import pprint
import sys
from flask import Flask, request 
from flask import jsonify
from pymongo import MongoClient 


client = MongoClient("mongodb://localhost:27017/")
db = client['finexaPrimary']
collection = db['fakeData']
app = Flask(__name__)

@app.route('/',methods=['GET'])
def get_Expenses():
    print('Hello world!')
    print db
    print collection
    print '--------------'
    pp = collection.find({})
    print pp
    print '--------------'
    print pp.count()
    sum = 0
    for post in collection.find({}):
        sum+= post['amount']
    return jsonify(
        amount = sum
    )

@app.route('/userAndCategory',methods=['GET', 'POST'])
def get_ExpensesFromUserAndCategory():
    print('Hello world!')
    user = request.json['user']
    category = request.json['category']
    sum = 0
    for post in collection.find({'$and' : [{'user':user}, {'category' : category}]}):
        sum+= post['amount']
    return str(sum)


@app.route('/date',methods=['GET', 'POST'])
def get_ExpensesSinceDate():
    print('Hello world!')
    date = request.json['date']
    sum = 0
    for post in collection.find({'datetime' : {'$gt':date}}):
        sum+= post['amount']
    return str(sum)


if __name__ == '__main__':
    app.run(debug=True)

