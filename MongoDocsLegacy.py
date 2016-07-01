export PATH=/Users/loopback/Dropbox/Develop/MongoDB/mongodb-osx-x86_64-2.6.3/bin:$PATH
export PATH = "the complete path to your bin directory for Mongo":$PATH:

/*--------------------*/
db
show dbs
show collections
/*--------------------*/

/*--------------------*/
//FINDONE
db.users.findOne({"username":"dwight"},{"email":true,"_id":false})
/*--------------------*/

/*--------------------*/
//FIND
db.scores.find({"type":"essay","score":50},{"student":true,"_id":false})
/*--------------------*/


/*--------------------*/
// $REGEX, $EXIST, $TYPE
db.users.find({"profession":{$exists:true}})
db.users.find({"name":{$type:2}}) /* type2 = string */
db.users.find({"name":{$regex:"a$"}})
db.users.find({"name":{$regex:"q"},"email":{$exists:true}})
/*--------------------*/


/*--------------------*/
//$GT, $LT
db.scores.find({ score : { $gte : 50 , $lte : 60 } } );
db.users.find( { name : { $lte : "Q" , $gte : "F" } } );
/*--------------------*/


/*--------------------*/
//$OR
db.scores.find({$or:[{"score":{$lt:50}},{"score":{$gt:90}}]})
/*--------------------*/


/*--------------------*/
// $AND
db.scores.find( { score : { $gt : 50 }, score : { $lt : 60 } } );
db.scores.find({$and:[{"score":{$lt:50}},{"score":{$gt:90}}]})
/*--------------------*/


/*--------------------*/
//QUERYING INSIDE ARRAYS
db.products.find( { tags : "shiny" } );-->
{ _id : 42 , name : "Whizzy Wiz-o-matic", tags : [ "awesome", "shiny" , "yellow" ] }
{ _id : 1040 , name : "Snappy Snap-o-lux", tags : "shiny" }
/*--------------------*/


/*--------------------*/
//$IN, $ALL
db.users.find( { friends : { $all : [ "Joe" , "Bob" ] }, favorites : { $in : [ "running" , "pickles" ] } } )-->
{ name : "Cliff" , friends : [ "Pete" , "Joe" , "Tom" , "Bob" ] , favorites : [ "pickles", "cycling" ] }
/*--------------------*/


/*--------------------*/
//DOT NOTATION
db.catalog.find({price:{$gt:10000},"reviews.rating":{$gte:5}});
/*--------------------*/


/*--------------------*/
//QUERYING, CURSORS
cursor.hasNext()
cursor.next()
//descending:-1
db.scores.find({ type : "exam" }).sort({score:-1}).skip(50).limit(20)
/*--------------------*/


/*--------------------*/
//COUNT
db.scores.count({type:"essay",score:{$gt:90}})
/*--------------------*/



/*--------------------*/
//Wholesale Updating of a Document
{ "_id" : "Texas", "population" : 2500000, "land_locked" : 1 }
db.foo.update({_id:"Texas"},{population:30000000})-->
{ "_id" : "Texas", "population" : 30000000 }
/*--------------------*/


/*--------------------*/
//SET
{
	"_id" : "myrnarackham",
	"phone" : "301-512-7434",
	"country" : "US"
}-->
db.users.update({"_id":"myrnarackham"},{"$set":{"country":"RU"}})
/*--------------------*/



/*--------------------*/
//UNSET
{ 
    "_id" : "jimmy" , 
    "favorite_color" : "blue" , 
    "interests" : [ "debating" , "politics" ] 
}-->
db.users.update({"_id":"jimmy"},{"$unset":{"interests":"1"}}) ; 1 is ignored
/*--------------------*/


/*--------------------*/
//PUSH POP PULL PULLALL PUSHALL
{ _id : "Mike", interests : [ "chess", "botany" ] }
db.friends.update( { _id : "Mike" }, { $push : { interests : "skydiving" } } );
db.friends.update( { _id : "Mike" }, { $pop : { interests : -1 } } );
db.friends.update( { _id : "Mike" }, { $addToSet : { interests : "skydiving" } } ); If exist does not do nothing
db.friends.update( { _id : "Mike" }, { $pushAll: { interests : [ "skydiving" , "skiing" ] } } );-->
["botany","skydiving","skydiving","skiing"]
/*--------------------*/


/*--------------------*/
//UPDATE
db.foo.update({username:'bar'}, {'$set':{'interests':['cat', 'dog']}}, {upsert: true} );.-->
{ "_id" : ObjectId("507b78232e8dfde94c149949"), "interests" : [ "cat", "dog" ], "username" : "bar" }
/*--------------------*/


/*--------------------*/
//MULTIUPDATE
{
	"_id" : ObjectId("50844162cb4cf4564b4694f8"),
	"student" : 0,
	"type" : "exam",
	"score" : 75
}-->
db.scores.update({"score":{$lt:70}},{$inc:{score:20}},{multi:true})
/*--------------------*/

/*--------------------*/
//REMOVE
db.scores.remove({score:{$lt:60}})
/*--------------------*/


/*--------------------*/
//AGGREGATE
db.grades.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}}, {'$sort':{'average':-1}})
/*--------------------*/

**************************************************************
//-----------------------  RELATIONS -----------------------//
**************************************************************

/*---------------------*/
// ONE TO ONE RELATION //
/*---------------------*/

Employees -- Resume

1.-With foreign _id, in one or the other side
2.- Embedd one into another

1.- How to access? "READ"
If Only access the info of one of the types you dont want it Embedd
2.-Which grows? "WRITE"
If normally the reads are only in one type. Separate.
3.-"SIZE"
More than 16MB
4.-"ATOMIC"
If you need to update both types at same time 


/*----------------------*/
// ONE TO MANY RELATION //
/*----------------------*/

 City -- Person

 1.- Embed people in city: To many people in one city document
 2.- Embed city in people: To many duplicated city info. (In some cases can be ok.)
 3.- "TRUE LINKING": in People. save the id of city.
 4.- "ONE TO FEW": Blog -- Comments Number 2 here.  

/*-----------------------*/
// MANY TO MANY RELATION //
/*-----------------------*/

Books -- Authors --> "FEW TO FEW"
Students -- Teachers

1.- Array of ids of the other type. Put it depending on the access patterns.
2.- Embedded: Books in the Authors. Can be dulicated, inconsistence after updates, insertion of a Teacher before having students ...
**************************************************************
//-----------------------  INDEXES -----------------------//
**************************************************************

/*--------------*/
// CRUD INDEXES //
/*--------------*/

// CREATE
#Ascending and descending important for the sort
db.students.ensureIndex({'student_id':1}) 
db.students.ensureIndex({'student_id':1,'class':-1})
db.students.ensureIndex({'addresses.phones':1}) 

//FIND
db.system.indexes.find()
db.students.getIndexes()

// DELETE
db.students.dropIndex({'student_id':1})

/*------------------*/
// MULTIKEY INDEXES //
/*------------------*/
#index in arrays

/*----------------*/
// UNIQUE INDEXES //
/*----------------*/
db.students.ensureIndex({'student_id':1},{unique:true})

/*---------------------*/
// REMOVING DUPLICATES //
/*---------------------*/
db.students.ensureIndex({'student_id':1},{unique:true, dropDups:true})

/*----------------*/
// SPARSE INDEXES //
/*----------------*/
# can not be unique when there is no key.

db.students.ensureIndex({'student_id':1},{unique:true, sparse:true})

/*-------------------*/
// INDEXES BACKGROUND//
/*-------------------*/
#create indexex while others cna use the db, but not the elements of the index
/*----------*/
// EXPLAIN //
/*---------*/

db.students.find({'student_id':100}).explain()

{
	"cursor" : "BtreeCursor a_1", //Name of the index
	"isMultiKey" : false, //
	"n" : 1, // number of docs returned
	"nscannedObjects" : 1, // number of docs scanned, found the first and stop
	"nscanned" : 1, //
	"nscannedObjectsAllPlans" : 1,
	"nscannedAllPlans" : 1,
	"scanAndOrder" : false,
	"indexOnly" : false, // The Query could be satisfy wit only the index. See teh actual collection is not needed
	"nYields" : 0,
	"nChunkSkips" : 0,
	"millis" : 36,
	"indexBounds" : { // Bounds of the index
		"a" : [
			[
				500,
				500
			]
		]
	},
	"server" : "LoopBacks-MacBook-Pro.local:27017",
	"filterSet" : false
}

/*-------------*/
// INDEX STATS //
/*-------------*/
db.students.totalIndexSize()

db.students.stats()
{
	"ns" : "test.foo",
	"count" : 1,
	"size" : 48,
	"avgObjSize" : 48,
	"storageSize" : 8192,
	"numExtents" : 1,
	"nindexes" : 2,
	"lastExtentSize" : 8192,
	"paddingFactor" : 1,
	"systemFlags" : 1,
	"userFlags" : 1,
	"totalIndexSize" : 16352,
	"indexSizes" : {
		"_id_" : 8176,
		"a_1" : 8176
	},
	"ok" : 1
}
/*---------------------*/
// INDEX CARDINALLITY  //
/*---------------------*/
Regular: 1/1
Sparse: <=Docs
MultiKey:>Docs

/*------------*/
// INDEX HINT //
/*------------*/
db.students.find({'student_id':100}).hint({'a':1})
db.students.find({'student_id':100}).hint({$natural:1})

// 'PYMONGO'
foo.find(query).hint([('c',pymongo.ASCENDING)]) // Needs an array so the dictionarz is ordered

/*-------------------*/
// INDEX EFFICEIENCY //
/*-------------------*/
#inspection lot of element
$gt
$lt
#inspection every  element
$ne
#needs somethign at the start
no: abcd 
yes:*abcd

# choosing the correct index (hint)
find($gt{'score':5}, {'class':20}).hint('class':1)

/*------------------*/
// GEOSPATIAL INDEX //
/*------------------*/
#in the doc
shops = {'shop_name':'name', 'location':[x,y]}

db.shops.ensureIndex({'location':'2d'})
db.shops.find({'location':{$near:[50,50]}})

/*----------------------*/
// GEOSPATIAL SPHERICAL //
/*----------------------*/
db.shops.ensureIndex({'location':'2dsphere'})


/*------------------------*/
// FULL TEXT SEARCH INDEX //
/*------------------------*/
db.sentences.ensureIndex({'words':'text'})
db.shops.find({$text:{$search:'dog'}})
db.shops.find({$text:{$search:'dog cat food'}},{score:{$meta:'textScore'}}).sort({score:{$meta:'textScore'}})

/*---------*/
// LOGGING //
/*---------*/
Logs built in, logs queries that take longer than 100ms


/*----------*/
// PROFILER //
/*----------*/
LEVELS: 
-0:off
-1:slow queries
-2:all

db.getProfilingLevel()
db.getProfilingStatus()
db.setProfilingStatus(1,4)
db.system.profile.find()

/*-----------*/
// MONGOSTAT //
/*-----------*/

/*--------*/
// MONGOP //
/*--------*/

**************************************************************



