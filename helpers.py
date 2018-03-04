

def genNextTID():
    tmp = countersCollection.find({'_id' : 'tId'})[0]['sequence_value']
	countersCollection.update({'_id':'tId'},{'$set':{'sequence_value':tmp+1}})
	return tmp