#!/usr/bin/python
import time
import datetime
import pytz
import numpy
import random
import gzip
import zipfile
import sys
import argparse
from random import randint
from faker import Faker
from random import randrange
from tzlocal import get_localzone
from pymongo import MongoClient

local = get_localzone()

client = MongoClient("mongodb//localhost:27017/")
db = client['finexaPrimary']
collection = db['fakeData']
countersCollection = db['counters']

print client
print db

#todo:
# allow writing different patterns (Common Log, Apache Error log etc)
# log rotation


class switch(object):
    def __init__(self, value):
        self.value = value
        self.fall = False

    def __iter__(self):
        """Return the match method once, then stop"""
        yield self.match
        raise StopIteration

    def match(self, *args):
        """Indicate whether or not to enter a case suite"""
        if self.fall or not args:
            return True
        elif self.value in args: # changed for v1.5, see below
            self.fall = True
            return True
        else:
            return False

parser = argparse.ArgumentParser(__file__, description="Fake Apache Log Generator")
parser.add_argument("--output", "-o", dest='output_type', help="Write to a Log file, a gzip file or to STDOUT", choices=['LOG','GZ','CONSOLE'] )
parser.add_argument("--num", "-n", dest='num_lines', help="Number of lines to generate (0 for infinite)", type=int, default=1)
parser.add_argument("--prefix", "-p", dest='file_prefix', help="Prefix the output file name", type=str)
parser.add_argument("--sleep", "-s", help="Sleep this long between lines (in seconds)", default=0.0, type=float)

args = parser.parse_args()

log_lines = args.num_lines
file_prefix = args.file_prefix
output_type = args.output_type

faker = Faker()

timestr = time.strftime("%Y%m%d-%H%M%S")
otime = datetime.datetime.now()

outFileName = 'access_log_'+timestr+'.log' if not file_prefix else file_prefix+'_access_log_'+timestr+'.log'

for case in switch(output_type):
	if case('LOG'):
		f = open(outFileName,'w')
		break
	if case('GZ'):
		f = gzip.open(outFileName+'.gz','w')
		break
	if case('CONSOLE'): pass
	if case():
		f = sys.stdout


users = ["ronaldo", "dad", "mom", "sister"]
# transaction is auto gen
# amount is radnom
category = ["food", "travel", "entertainment", "education", "shopping", "grocery", "utilities"] 
cities = ["Raleigh", "Charlotte", "Greensboro"]

flag = True
while (flag):
	if args.sleep:
		increment = datetime.timedelta(seconds=args.sleep)
	else:
		increment = datetime.timedelta(seconds=random.randint(30, 300))
	otime += increment

	# category = ["food", "travel", "entertainment", "education", "shopping", "grocery", "utilities"] 
	r_user = numpy.random.choice(users,p=[0.3,0.2,0.1,0.4])
	r_amt = random.uniform(0.90, 15)
	r_category = numpy.random.choice(category,p=[0.18,0.15,0.18,0.10,0.20,0.11, 0.08])
	r_desc = 'RANDOM_DESCRIPTION'
	r_receiver = 'RANDOM_RECEIVER'
	r_city = numpy.random.choice(cities,p=[0.50,0.30,0.20])
	r_dt = otime.strftime('%d/%b/%Y:%H:%M:%S')

	data_dict = dict()

	data_dict["user"] = r_user
	data_dict["tId"] = genNextTID
	data_dict["amount"] = r_amt
	data_dict["category"] = r_category
	data_dict["description"] = r_desc
	data_dict["receiver"] = r_receiver
	data_dict["location"] = r_city
	data_dict["datetime"] = r_dt

	collection.insert_one(data_dict)

	

	f.write('%s %.2f %s %s %s %s %s\n' % (r_user, r_amt, r_category, r_desc, r_receiver, r_city, r_dt))
	f.flush()

	log_lines = log_lines - 1
	flag = False if log_lines == 0 else True
	if args.sleep:
		time.sleep(args.sleep)



