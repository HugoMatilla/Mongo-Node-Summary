# 1. BASICS
## INIT
1. Start server
`> mongod`
2. Launch the mongo shell 
`> mongo`

## CRUD
show database names

`> show dbs`         

show collections in current database            

`> show collections` 

### Insert
`db.movies.insertOne({ "title": "Jaws", "year": 1975, "imdb": "tt0073195" });`

### Find
All
`db.movies.find()`

One
`db.movies.findOne({"year":1975})`


### Cursor
Create a cursor
`var cursor = db.movies.find()`

Iterate through a cursor
`cursor.next()`

Cursor finished
`cursor.hasNext()`

## NODE
Connection
`var url = 'mongodb://<MACHINE>:<PORT>/<DB_NAME>';`


```javascript
	
	var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

	var url = 'mongodb://localhost:27017/video';

	MongoClient.connect(url, function(err, db) {

	    assert.equal(null, err);
	    console.log("Successfully connected to server");

	    // Find some documents in our collection
	    db.collection('movies').find({}).toArray(function(err, docs) {

	        // Print the documents returned
	        docs.forEach(function(doc) {
	            console.log(doc.title);
	        });

	        // Close the DB
	        db.close();
	    });

	    // Declare success
	    console.log("Called find()");
	});
```
## EXPRESS AND TEMPLATE
**consolidate**
Allow express to use several templating engines [consolidate.js](https://github.com/tj/consolidate.js)

**__dirname**
This file path

```javascript

	var express = require('express'),
    app = express(),
    engines = require('consolidate');

	app.engine('html', engines.nunjucks);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');

	app.get('/', function(req, res) {
	    res.render('hello', { name : 'Templates' });
	});

	app.use(function(req, res){
	    res.sendStatus(404); 
	});

	var server = app.listen(3000, function() {
	    var port = server.address().port;
	    console.log('Express server listening on port %s', port);
	});

```

## ALL TOGETHER

```javascript

	var express = require('express'),
	    app = express(),
	    engines = require('consolidate'),
	    MongoClient = require('mongodb').MongoClient,
	    assert = require('assert');

	app.engine('html', engines.nunjucks);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');

	MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

	    assert.equal(null, err);
	    console.log("Successfully connected to MongoDB.");

	    app.get('/', function(req, res){

	        db.collection('movies').find({}).toArray(function(err, docs) {
	            res.render('movies', { 'movies': docs } );
	        });

	    });

	    app.use(function(req, res){
	        res.sendStatus(404);
	    });
	    
	    var server = app.listen(3000, function() {
	        var port = server.address().port;
	        console.log('Express server listening on port %s.', port);
	    });

	});
```

## HW1
### 1
`mongod --dbpath=/data/db`
`mongorestore dump`
#2. CRUD
## Creating Documents
insert
```javascript
	
	db.moviesScratch.insertOne({ "title": "Rocky", "year": "1976", "imdb": "tt0075148"});
	db.moviesScratch.insertOne({ "_id": "tt0075148", "title": "Rocky", "year": "1976" });
```

insertMany
```javascript

	db.moviesScratch.insertMany(
	    [
	        {
		    "_id" : "tt0084726",
		    "title" : "Star Trek II: The Wrath of Khan",
		    "year" : 1982,
		    "type" : "movie"
	        },
	        {
		    "_id" : "tt0796366",
		    "title" : "Star Trek",
		    "year" : 2009,
		    "type" : "movie"
	        },
	        {
		    "_id" : "tt0084726",
		    "title" : "Star Trek II: The Wrath of Khan",
		    "year" : 1982,
		    "type" : "movie"
	        },
	        {
		    "_id" : "tt1408101",
		    "title" : "Star Trek Into Darkness",
		    "year" : 2013,
		    "type" : "movie"
	        },
	        {
		    "_id" : "tt0117731",
		    "title" : "Star Trek: First Contact",
		    "year" : 1996,
		    "type" : "movie"
	        }
	    ],
	    {
	        "ordered": false  
	    }
	);

```
`"ordered": false` allow to make all the insert but the ones that give errors. If the default `"ordered": true` is set, once there is an error no more inserts will take place.

## Reading Documents

`db.movies.find({"name":"Star Wars"})`
`db.movies.find({rated:"PG"})`
`db.movies.find({"tomate.meter":"100"})`
### Equality matches on Scalars
### Equality matches on embedded Documents
### Equality matches on arrays
* On the entire Array
* Based on any element
* Based on specific element
* More complex matches using operators

#### On the entire Array
`writers` is an array of elements    
They have to be in the same ordered   
`db.movies.find({"writers":["Joel","Ethan"]}`

#### Based on any element
`actor` is an array of elements   
Find any document with an occurrence.   
`db.movies.find({"actor":"John Doe"})`   
## Based on specific element
Find any document with an occurrence as firs element.  
`db.movies.find({"actor.0":"John Doe"})`

### Cursors
`find` returns a cursor.
If we add it to a variable we can use it.
`var cursor = db.movies.find({"tomato.meter":"100"})`

We can use  a function to use the cursor   
`var doc function(){return cursor.hasNext() ? cursor.next() : null;}`

See how many objects are left in the Batch
`cursor.objsLeftInBatch()`

### Projections
Reducing size of elements returned by the queries.
`db.movies.find({rated:"PG"},{title:1})`  
Explicit `_id` exclusion
`db.movies.find({rated:"PG"},{title:1, _id:0})`  
Explicit exclusion
`db.movies.find({rated:"PG"},{writers:0, actors:0})`  

## Comparison Operators
[Query Selectors](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors)
### More, less, equals than $gt,$gte,$lt,$lte
`db.movies.find({runtime:{$gt:90}})`   
`db.movies.find({runtime:{$gte:90, $lte:120}})`  

### Not equal and In $ne, $in
Also returns the ones that do not have the field at all.  
`db.movies.find({rated:{$ne:"UNRATED"}})`  
In   
`db.movies.find({rated:{$in:["G","PG"]}})`    

## Element Operators
[Element Operators](https://docs.mongodb.com/manual/reference/operator/query/#element)
### exists
Matches documents that have the specified field    
`db.movies.find({"tomate.meter":{$exists:true}})`  
### type
Selects documents if a field is of the specified type.
`db.movies.find({"_id":{$type:"string"}})`  

## Logical Operators
[Logical Operators](https://docs.mongodb.com/manual/reference/operator/query/#logical)
### Or
`db.movies.find({"$or":[{tomato.meter:{$gt:90}},{"metacritic":{$gt:80}}]})`  
### And
`db.movies.find({"$and":[{tomato.meter:{$gt:95}},{"metacritic":{$gt:95}}]})`   
Is the same as:
`db.movies.find({tomato.meter:{$gt:95}},{"metacritic":{$gt:95}})`   
`$and` is used if we need to specify the same field more than once in the same query.
`db.movies.find({"$and":[{"metacritic":{$ne:null}},{"metacritic":{$exists:true}}]})`   

## Regex Operators
[Regex Operators](https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_regex)
`db.movies.find({"awards.text":{$regex:/^Won\s.*/}})`   


## Array Operators
[Array Operators](https://docs.mongodb.com/manual/reference/operator/query/#array)

### All
`db.movies.find({genres:{$all:["Comedy","Action"]}})`   
### Size
`db.movies.find({countries:{$size:1}})`   
### Element Match
For embedded documents
`db.movies.find({boxOffice:{$elemMatch{{country:"UK", revenue:{$gt:15}}}})`   
Is not the same as:   
`db.movies.find({boxOffice:{country:"UK", revenue:{$gt:15}}})`   
here the query search in the box office element as an all. So it will retrieve if there is an element in the array with country UK and if there is any element with revenue grater than 15.

## Update


### Update one
#### Update Field
[Update Field](https://docs.mongodb.com/manual/reference/operator/update-field/)

`db.movies.updateOne({title:"StarWars"},{$set:{poster:"img.jpg"}})`

* `$set`			Sets the value of a field in a document.
* `$unset`			Removes the specified field from a document.
* `$inc`			Increments the value of the field by the specified amount.
* `$min` 			Only updates the field if the specified value is less than the existing field value.
* `$max`			Only updates the field if the specified value is greater than the existing field value.
* `$mul`			Multiplies the value of the field by the specified amount.
* `$rename`			Renames a field.
* `$setOnInsert`	Sets the value of a field if an update results in an insert of a document.
* `$currentDate`	Sets the value of a field to current date, either as a Date or a Timestamp.

`db.movies.updateOne({title:"StarWars"}{$inc:{tomato.reviews:5}})`

#### Update Array
[Update Array](https://docs.mongodb.com/manual/reference/operator/update-array/#update-operators)
* `$addToSet`	Adds elements to an array only if they do not already exist in the set.
* `$pop`		Removes the first or last item of an array.
* `$pullAll`	Removes all matching values from an array.
* `$`			Acts as a placeholder to update the first element that matches the query condition in an update.
* `$pull`		Removes all array elements that match a specified query.
* `$pushAll`	Deprecated. Adds several items to an array.
* `$push`		Adds an item to an array.

```javascript

	db.movieDetails.updateOne({title: "The Martian"},
                          {$push: { reviews: { rating: 4.5,
                                               date: ISODate("2016-01-12T09:00:00Z"),
                                               reviewer: "Spencer H.",
                                               text: ".34.."} } })

```

#### Update Array modifiers
[Update Operator Modifiers](https://docs.mongodb.com/manual/reference/operator/update-array/#update-operator-modifiers)

* `$each`		Modifies the $push and $addToSet operators to append multiple items for array updates.
* `$slice`		Modifies the $push operator to limit the size of updated arrays.
* `$sort`		Modifies the $push operator to reorder documents stored in an array.
* `$position`	Modifies the $push operator to specify the position in the array to add elements.

For more than one use    
**$each**
```javascript
	
	db.movieDetails.updateOne({title: "The Martian"},
                          {$push: { reviews:
                                    { $each: [
                                        { rating: 0.5,
                                          date: ISODate("2016-01-12T07:00:00Z"),
                                          reviewer: "Yabo A.",
                                          text: "..."},
                                        { rating: 4.5,
                                          date: ISODate("2016-01-12T09:00:00Z"),
                                          reviewer: "Spencer H.",
                                          text: "..."} ] } } } )

```

To keep a maximum number of elements in an array (do not forget to set the position `$position`)    
**$slice**

```javascript

	db.movieDetails.updateOne({ title: "The Martian" },
                          {$push: { reviews:
                                    { $each: [
                                        { rating: 0.5,
                                          date: ISODate("2016-01-13T07:00:00Z"),
                                          reviewer: "Shannon B.",
                                          text: "Enjoyed watching with my kids!" } ],
                                      $position: 0,
                                      $slice: 5 } } } )
```
### Update many
`db.movieDetails.updateMany( { rated: null },{ $unset: { rated: "" } } )`

#### Upsert
```javascript

	db.movieDetails.updateOne(
    	{"imdb.id": detail.imdb.id},
    	{$set: detail},
    	{upsert: true}
    );
```

### ReplaceOne
`db.movies.replaceOne({"imdb": detail.imdb.id},detail);`

# 3. THE NODE.JS DRIVER
## find() and Cursors in the Node.js Driver 
**mongoimport**
`> mongoimport -d crunchbase -c companies companies.json`

### Connection
```javascript

	var MongoClient = require('mongodb').MongoClient,
	    assert = require('assert');


	MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

	    assert.equal(err, null);
	    console.log("Successfully connected to MongoDB.");
		...
	});

```

### Query
```javascript

	
	    var query = {"category_code": "biotech"};

	    db.collection('companies').find(query).toArray(function(err, docs) {

	        assert.equal(err, null);
	        assert.notEqual(docs.length, 0);
	        
	        docs.forEach(function(doc) {
	            console.log( doc.name + " is a " + doc.category_code + " company." );
	        });
        
        db.close();
        
    });

```

### Cursors
You get a cursor object and then you iterate through it. Until there is no iteration there is no call to the database.
```javascript

	var query = {"category_code": "biotech"};

    var cursor = db.collection('companies').find(query);

    cursor.forEach(
        function(doc) {
            console.log( doc.name + " is a " + doc.category_code + " company." );
        },
        function(err) { // Called always when there are no more documents
            assert.equal(err, null);
            return db.close(); 
        }
    );
```

### toArray vs forEch
`forEch` works with batches of information that it automatically retrieve from the database every time the previous batch runs out, until it reaches the end of the result set. With `forEch` we can process the data as it comes from the database.

`toArray` callback is not call until the entire data is retrieve from the database system, and the entire array is built.

## Projection in the Node.js Driver 
Get only the fields we really need, we can reduce the amount of data transferred.

```javascript

	var query = {"category_code": "biotech"};
    var projection = {"name": 1, "category_code": 1, "_id": 0};

    var cursor = db.collection('companies').find(query);
    cursor.project(projection);
```
## Query Operators in the Node.js Driver 
```javascript

	function queryDocument(options) {

	    var query = {
	        "founded_year": {
	            "$gte": options.firstYear,
	            "$lte": options.lastYear
	        }
	    };

	    if ("employees" in options) {
	        query.number_of_employees = { "$gte": options.employees };
	    }
	        
	    return query;
	}

```
## $regex in the Node.js Driver 
`"$options": "i"` case insensitive.

`>node app.js -m "billion.+valuation`
```javascript

	function queryDocument(options) {

	    var query = {};

	    if ("overview" in options) {
	        query.overview = {"$regex": options.overview, "$options": "i"};
	    }

	    if ("milestones" in options) {
	        query["milestones.source_description"] =
	            {"$regex": options.milestones, "$options": "i"};
	    }

	    return query;
	    
	}


	function projectionDocument(options) {

	    var projection = {
	        "_id": 0,
	        "name": 1,
	        "founded_year": 1
	    };

	    if ("overview" in options) {
	        projection.overview = 1;
	    }

	    if ("milestones" in options) {
	        projection["milestones.source_description"] = 1;
	    }

	    return projection;
	}
```

## Dot Notation in the Node.js Driver 

```javascript

	if ("ipo" in options) {
        if (options.ipo == "yes") {
            query["ipo.valuation_amount"] = {"$exists": true, "$ne": null};
        } else if (options.ipo == "no") {
            query["ipo.valuation_amount"] = null;
        }               
    }
```

## Dot Notation on Embedded Documents in Arrays
```javascript

    if ("country" in options) {
        query["offices.country_code"] = options.country;
    }
```

## Sort, Skip, and Limit in the Node.js Driver 
It doesn't matter in which order we apply sort, skip and limit. Mongo always do it in the same order.
* 1.-`sort`
* 2.-`skip`
* 3.-`limit`

### Sort
Passing an array of **tuples** (not objects) we set the order of the sorts.
```javascript

	cursor.sort([["founded_year", 1], ["number_of_employees", -1]]); 
```

### Skip

```javascript

    cursor.limit(options.limit);
    cursor.skip(options.skip);
    cursor.sort({"founded_year", 1}); 
```

## insertOne() and insertMany() in the Node.js Driver
### insertOne
```javascript
	
	db.collection("statuses").insertOne(status, function(err, res) {
        console.log("Inserted document with _id: " + res.insertedId + "\n");
    });
```

### insertMany
```javascript
	
	db.collection("statuses").insertMany(statuses, function(err, res) {

        console.log(res);
        
        done += 1;
        if (done == screenNames.length) {
            db.close();
        }
   	});

```
## deleteOne() and deleteMany() in the Node.js Driver 
### deleteOne
```javascript

	db.collection('companies').deleteOne(filter, function(err, res) {
        assert.equal(err, null);
        console.log(res.result);

    });
```
### deleteMany
```javascript
	
	var filter = {"_id": {"$in": markedForRemoval}};

	db.collection("companies").deleteMany(filter, function(err, res) {
        console.log(res.result);
        console.log(markedForRemoval.length + " documents removed.");

        return db.close();
    });
```
# SCHEMA DESIGN

* Rich Documents
* PreJoin / Embed Data
* No Mongo Joins
* No Constrains
* Atomic Operations
* No Declared Schema

## No Constrains
Keeping your data consistent even though MongoDB lacks foreign key constraints, by embedding documents. 

## No transactions (ACID)
* **Restructure**: Use atomic operations to achieve it, because the documents (if they are so prepared) are embedded and there is no need to access several documents.
* **Implement in Software**
* **Tolerate**

## One to One Relationships
### Employees  Resume Sample

_Options_

* **1.-SQL style**: With foreign _id, in one or the other side
* **2.-MongoDB Style**: Embed one into another 

#### Considerations to avoid embedding

* **1.-Frequently access (READ)**
If we access rearely to the `Resume` and it is a big document we don't want to embed the `Resume` in the `Employee` document.   
If Only access the info of one of the types you don't want it embed 

* **2.-Growing documents(WRITE)**
If we write a lot in the `Resume` document but not in the `Employee`
If the writes are mostly in one document we don't want to incur in overhead in the other.

* **3.-Size**
If the document is larger than 16MB it can not be embedded.

* **4.-Not Atomic**
If you need to update both types at same time is better to have the documents embedded in into the other.

## One to Many Relationships

### City Person Sample

 * 1.- Embed people in city: To many people in one city document
 * 2.- Embed city in people: To many duplicated city info. (In some cases can be ok.)
 * 3.- "TRUE LINKING": in People. save the `id` of city.
 * 4.- "ONE TO FEW": Blog vs Comments. Embed the many in the one. One post with few comments.

## Many to Many
### Books Authors, Students Teachers Samples
Normally they are  "FEW TO FEW"


**Options**

* 1.- Array of ids of the other type. Put it depending on the access patterns.You can also have ids in both documents.
* 2.- Embedded: Books in the Authors. Can be **duplicated**, **inconsistence** after updates, wont work if you wnat to insert a Teacher before it have students.

## Multikey indexes
### Students Teachers Sample

Student
```json

	{
		_id:0,
		name: "Hugo",
		teachers:[1,4,6,8]
	}
```
Teacher
```json
	
	{
		_id:0,
		name: "Dr Who",
	}
```
Find all teachers from a Student. Direct.
Find all students from a teacher. Use a Multikey index.
Add index   
`db.students.ensureIdex({'teachers:1'})`
Find    
`db.students.find({'teachers':{$all:[0,1]}}).explain` teachers whose `id` is 0 and 1

`explain` will tell us how the query was execute. Use or not of the index

## Trees
Use ancestors
```json
	
	{
		_id:89
		category_name:"movies"
		parent_id:6,
		ancestors:[2,5,7,8]
	}

## When Denormalize
We normalize to not have inconsistence because of duplicate data.

We can avoid having duplicate data:

* 1:1 Embed There is no duplication
* 1:Many From the many to the one
* Many : Many Link
```

# 5 INDEXES AND PERFORMANCE
## Indexes
`db.students.explain().find({student_id:5})`   
`db.students.explain(true).find({student_id:5})`// more detail

`db.students.createIndex({student_id:1})` // Take some time

`db.students.createIndex({student_id:1, class_id:-1})` // -1 descending (good for sorting)

### Discover
`db.students.getIndexes()`
### Delete
`db.students.dropIndexes({student_id:1})`
### Multikey indexes
One array and the other a scalar
`db.foo.createIndex({a:1,b:1})` 
`db.foo.explain().find({a:1,b:1})` 
`db.foo.insert({a:1,b:[2,4,5]})`
`db.foo.explain().find({a:1,b:1})` // isMultikey : true
`db.foo.insert({a:[5,6,8],b:[2,4,5]})` // Can't put index when both `a` and `b` are arrays
`db.foo.insert({a:[5,6,8],b:2})`// Legal
### Dot Notations and Multikey 
`db.students.createIndex({'scores.score':1})`
`db.people.createIndex({'work_history.company':-1})`
`db.students.explain().find({'scores': {elemMatch:{type:'exam', score:{'$gt':99.8})`
### Unique indexes
`db.students.createIndex({'studen_id':1},{unique:true})`
### Sparse Indexes
```

	{a:1,b:1,c:5}
	{a:10,b:5,c:10}
	{a:31,b:41}
	{a:12,b:23}
```
Sparse option :unique indexes that do not include docs that has a null value.
`db.people.createIndex({'phone_number':1},{sparse:true})`
### Index creation in background
**Foreground**:Fast, Blocks writes and reads  
**Background**:Slow, Don't blocks writes and reads
## Explain
```

	db.example.find( { a : 1, b : 2 } ).explain()
	db.example.explain().remove( { a : 1, b : 2 } )// Does not work because remove does not return a cursor
	var exp = db.example.explain(); exp.find( { a : 1, b : 2 } )
	db.example.remove( { a : 1, b : 2 } ).explain()
	db.example.explain().find( { a : 1, b : 2 } )
	curs = db.example.find( { a : 1, b : 2 } ); curs.explain()
```
### Explain Verbosity
Options:

* executionStats: Stat for the winning plan
* allPlansExecution: Stat for all the plans

## Covered Queries
Satisfy a query only with the index  
Make searches that project only what is in the index


```
	//Indexes
	{ name : 1, dob : 1 }
	{ _id : 1 }
	{ hair : 1, name : 1 }

	db.example.find( { name : { $in : [ "Alfred", "Bruce" ] } }, { name : 1, hair : 1 } )
	db.example.find( { _id : 1117008 }, { _id : 0, name : 1, dob : 1 } )
	db.example.find( { name : { $in : [ "Bart", "Homer" ] } }, {_id : 0, hair : 1, name : 1} )
    ->db.example.find( { name : { $in : [ "Bart", "Homer" ] } }, {_id : 0, dob : 1, name : 1} )// Only this one is covered
```



## Special Indexes
### Geospatial Index
`shops = {'shop_name':'name', 'location':[x,y]}`

`db.shops.ensureIndex({'location':'2d'})`

`db.shops.find({'location':{$near:[50,50]}})`


### Geospatial spherical  Index
`db.shops.ensureIndex({'location':'2dsphere'})`

`db.stores.find({ loc:{ $near: { $geometry: { type: "Point", coordinates: [-130, 39]}, $maxDistance:1000000 } } })`

### Full Text Search Indexes
```

	db.sentences.ensureIndex({'words':'text'})
	db.shops.find({$text:{$search:'dog'}})
	db.shops.find({$text:{$search:'dog cat food'}},{score:{$meta:'textScore'}}).sort({score:{$meta:'textScore'}})
```
## Efficiency
`hint` Use it to give to mongo the index you want to use.	

## Profiler
[Docs](http://docs.mongodb.org/manual/reference/database-profiler/)

Status: 

* 0: off
* 1: slow ones
* 2: all

`db.system.profile.find( { millis : { $gt:1000 } } ).sort( { ts : -1 } )`
## Mongotop
Where mongo is spending his time
## Mongostat
get statistics that happened in mongo in 1 seconds

# AGGREGATIONS
## Operations
* Match (find)
* Project
* Sort
* Skip
* Limit

```javascript

	db.companies.aggregate([
	    { $match: { founded_year: 2004 } },
	    { $project: {
	        _id: 0,
	        name: 1,
	        founded_year: 1
	    } }
	])
```

Be careful with the order, here if `limit` goes before than `skip` the result will be erroneous.
```javascript

	db.companies.aggregate([
	    { $match: { founded_year: 2004 } },
	    { $sort: { name: 1} },
	    { $skip: 10 },
	    { $limit: 5 },
	    { $project: {
	        _id: 0,
	        name: 1 } },
	])

```
[Aggregation Pipeline Quick Reference](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/)
## Expressions
[Expressions reference](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#expressions)

## Reshaping. Promoting Nested fields
```javascript

	db.companies.aggregate([
	    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
	    { $project: {
	        _id: 0, 
	        name: 1,
	        ipo: "$ipo.pub_year",
	        valuation: "$ipo.valuation_amount",
	        funders: "$funding_rounds.investments.financial_org.permalink"
	    } }
	]).pretty()

```

Create our own objects
```javascript

	db.companies.aggregate([
	    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
	    { $project: {
	        _id: 0, 
	        name: 1,
	        founded: {
	            year: "$founded_year",
	            month: "$founded_month",
	            day: "$founded_day"
	        }
	    } }
	]).pretty()
```

## $unwind 
Covert documents with arrays to an array of documents each with one doc.
```javascript

	// unwind
	db.companies.aggregate([
	    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
	    { $unwind: "$funding_rounds" },
	    { $project: {
	        _id: 0,
	        name: 1,
	        amount: "$funding_rounds.raised_amount",
	        year: "$funding_rounds.funded_year"
	    } }
	])
```

Multiple stages
```javascript

	// If we don't care about the funder we can simplify.
	// Let's sort as well.
	db.companies.aggregate([
	    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
	    { $unwind: "$funding_rounds" },
	    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
	    { $project: {
	        _id: 0,
	        name: 1,
	        amount: "$funding_rounds.raised_amount",
	        year: "$funding_rounds.funded_year" } },
	    { $sort: { year: 1 } }
	])
	
```

## Array Expressions 
### Filters

```javascript

	db.companies.aggregate([
	    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
	    { $project: {
	        _id: 0,
	        name: 1,
	        founded_year: 1,
	        rounds: { $filter: {
	            input: "$funding_rounds",
	            as: "round",
	            cond: { $gte: ["$$round.raised_amount", 100000000] } } }
	    } },
	    { $match: {"rounds.investments.financial_org.permalink": "greylock" } },    
	]).pretty()
```
*$arrayElemAt*
```javascript
	
	db.companies.aggregate([
	    { $match: { "founded_year": 2010 } },
	    { $project: {
	        _id: 0,
	        name: 1,
	        founded_year: 1,
	        first_round: { $arrayElemAt: [ "$funding_rounds", 0 ] },
	        last_round: { $arrayElemAt: [ "$funding_rounds", -1 ] }
	    } }
	]).pretty()


	
```
*$slice*
```javascript

	db.companies.aggregate([
		    { $match: { "founded_year": 2010 } },
		    { $project: {
		        _id: 0,
		        name: 1,
		        founded_year: 1,
		        first_round: { $slice: [ "$funding_rounds", 1 ] },
		        last_round: { $slice: [ "$funding_rounds", -1 ] }
		    } }
		]).pretty()
```
*$size*
```javascript

	db.companies.aggregate([
	    { $match: { "founded_year": 2004 } },
	    { $project: {
	        _id: 0,
	        name: 1,
	        founded_year: 1,
	        total_rounds: { $size: "$funding_rounds" }
	    } }
	]).pretty()
```
## Accumulators 
$max, $min, $avg, $first...

```javascript
	
	db.companies.aggregate([
	    { $match: { "funding_rounds": { $exists: true, $ne: [ ]} } },
	    { $project: {
	        _id: 0,
	        name: 1,
	        largest_round: { $max: "$funding_rounds.raised_amount" }
	    } }
	])

```
```javascript

	db.companies.aggregate([
	    { $match: { "funding_rounds": { $exists: true, $ne: [ ]} } },
	    { $project: {
	        _id: 0,
	        name: 1,
	        total_funding: { $sum: "$funding_rounds.raised_amount" }
	    } }
	])

```
```javascript

	db.companies.aggregate([
	    { $group: {
	        _id: { founded_year: "$founded_year" },
	        average_number_of_employees: { $avg: "$number_of_employees" }
	    } },
	    { $sort: { average_number_of_employees: -1 } }
	    
	])
```
## $group

```javascript
	
	db.companies.aggregate([
	    { $group: {
	        _id: { founded_year: "$founded_year" },
	        average_number_of_employees: { $avg: "$number_of_employees" }
	    } },
	    { $sort: { average_number_of_employees: -1 } }
	    
	])
```
```javascript
	
	db.companies.aggregate( [
	    { $match: { "relationships.person": { $ne: null } } },
	    { $project: { relationships: 1, _id: 0 } },
	    { $unwind: "$relationships" },
	    { $group: {
	        _id: "$relationships.person",
	        count: { $sum: 1 }
	    } },
	    { $sort: { count: -1 } }
	] )


```
Set a proper `_id`

Ex1:
```javascript

	db.companies.aggregate([
	    { $match: { "relationships.person": { $ne: null } } },
	    { $project: { name: 1, relationships: 1, _id: 0 } },
	    { $unwind: "$relationships" }, {
	        $group: {
	            _id: "$relationships.person.permalink",
	            company: { $addToSet: "$name" }
	        }
	    },
	    { $unwind: "$company" }, {
	        $group: {
	            _id: "$_id",
	            count: { $sum: 1 }
	        }
	    },
	    { $sort: { count: -1 } }
	]);
```
Ex2
```javascript

	db.grades.aggregate([
	    { $project: { "class_id": 1, "student_id": 1, "scores.type": 1, "scores.score": 1, _id: 0 } },
	    { $unwind: "$scores" },
	    { $match: { "scores.type": { $ne: "quiz" } } }, {
	        $group: {
	            _id: "$class_id",
	            stdDev: { $stdDevPop: "$scores.score" }
	        }
	    }
	]);

```
Why the result is differnt if we dont have `"student_id": 1` in the project stage?

Ex3
```javascript
	
	db.companies.aggregate([
	    { $match: { founded_year: 2004 } }, {
	        $project: {
	            _id: 1,
	            name: 1,

	            rounds: { $size: "$funding_rounds" },
	            founded_year: 1,
	            "funding_rounds.raised_amount": 1
	        }
	    },
	    { $match: { rounds: { $gte: 5 } } },
	    { $unwind: "$funding_rounds" }, {
	        $group: {
	            _id: "$name",
	            stdDev: { $sum: "$funding_rounds.raised_amount" }
	        }
	    },
	    { $sort: { stdDev: 1 } }
	])
```
# 7. APPLICATION ENGINEERING
## Write Concern 
*Journal* part on memory where documents are stored before writing them to disk.   
`w = 1` wait to respond of the write. 
`j = false` wait for the journal to write on disk.

| w | j     |                                             | 									|
|---|-------|---------------------------------------------|-------------------------------------|
| 1 | false | wait for the server but not for the journal | Fast, Small window of vulnerability	|
| 1 | true  | Wait until is write directly in the disk    | Slow 								|
| 0 | 	    | Unacknowledged write                        | Don't 								|

## Network Errors 
What if we can not see the response?

* *Insert*: Just try again until is done
* *Update*: problem in cases like in `$inc`. In the case of the need of to avoid this error use inserts instead.

##Introduction to Replication 
* Availability
* Fault Tolerance

#### Replica Set
Nodes  
Primary and secondaries   
Writes only in primaries  
Minimun number of nodes in a Replica set is 3  
If primary is down, there is an `election` in which of the secondaries is the new primary.

## Replica Set Elections 
Type of nodes: 

* Regular
* Arbiter: for voting purposes. No data on it.
* Delayed: for back ups. `Priority = 0` can not be primary
* Hidden: Can not be primary. `Priority= 0`

## Write Consistency 
* Writes goes to the primary  
* Reads can go to secondaries, but there are options that the info is not updated.  
* *Replication is asynchronous*  
* Use for read scaling.  


## Creating Replica Set
```
	
	#!/usr/bin/env bash
	mkdir -p /data/rs1 /data/rs2 /data/rs3
	mongod --replSet m101 --logpath "1.log" --dbpath /data/rs1 --port 27017 --oplogSize 64 --fork --smallfiles
	mongod --replSet m101 --logpath "2.log" --dbpath /data/rs2 --port 27018 --oplogSize 64 --smallfiles --fork
	mongod --replSet m101 --logpath "3.log" --dbpath /data/rs3 --port 27019 --oplogSize 64 --smallfiles --fork
```

*Configuration*
```javascript
	
	config = { _id: "m101", members:[
          { _id : 0, host : "localhost:27017" priority:0, slaveDelay:5 },
          { _id : 1, host : "localhost:27018"},
          { _id : 2, host : "localhost:27019"} ]
	};

	rs.initiate(config);
	rs.status();

```

Can not read in a secondary by default
`rs.slaveOk()`

## Replica Set Internals 
* _oplog_ is the operations log. Inserts, updates...  
* _oplog_ is in sync.  
* Secondaries are constantly reading the primary _oplog_

Command to see which mongo servers are we running  
`ps -ef | grep mongod`

In the server in the local database `use local`  there is a _oplog.rs_ collection  

```javascript

	m101:PRIMARY> db.oplog.rs.find().pretty()
	...
	{
		"ts" : Timestamp(1467796049, 1),
		"t" : NumberLong(1),
		"h" : NumberLong("-2180104970022902937"),
		"v" : 2,
		"op" : "c",
		"ns" : "test.$cmd",
		"o" : {
			"create" : "people"
		}
	}
	{
		"ts" : Timestamp(1467796049, 2),
		"t" : NumberLong(1),
		"h" : NumberLong("7319531361958625272"),
		"v" : 2,
		"op" : "i",
		"ns" : "test.people",
		"o" : {
			"_id" : ObjectId("577cca5151c935c6195553ad"),
			"name" : "Hugo"
		}
	}

```

`rs.status()` Give us the `optime`

```javascript

		{
			"_id" : 0,
			"name" : "localhost:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 1088,
			"optime" : { 			//<-- when was the last update
				"ts" : Timestamp(1467796049, 2),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2016-07-06T09:07:29Z"),
			"lastHeartbeat" : ISODate("2016-07-06T09:12:47.037Z"),
			"lastHeartbeatRecv" : ISODate("2016-07-06T09:12:47.683Z"),
			"pingMs" : NumberLong(0),
			"syncingTo" : "localhost:27018", //<-- where the info comes from
			"configVersion" : 1
		},

```
_oplog_ is a capped collection. It is going to roll off after a certain amount of time. 
Have a big enough _oplog_ when the secondary can not see the primary.
Depens on how fast the it is growing 

## Failover and Rollback 
If the primary stops and when it comes back up sees that he has writes that are not in the 'new' primary, these writes are rolled back and saved in a file in case a we want to manually add them.

## Connecting to a Replica Set from the Node.js Driver 
If you leave a replica set node out of the seedlist within the driver, the missing node will be discovered as long as you list at least one valid node.

```javascript

	var MongoClient = require('mongodb').MongoClient;

	MongoClient.connect("mongodb://localhost:30001,localhost:30002,localhost:30003/course", function(err, db) {
	    if (err) throw err;

	    db.collection("repl").insert({ 'x' : 1 }, function(err, doc) {
	        if (err) throw err;

	        db.collection("repl").findOne({ 'x' : 1 }, function(err, doc) {
	            if (err) throw err;

	            console.log(doc);
	            db.close();
	        });
	    });
	});

```

## Failover in the Node.js Driver 

If a insert happens during a primary election, the insert will be buffered until the election completes, then the callback will be called after the operation is sent and a response is received.

## Write Concern Revisited 

| w 		| j     |                                             | 									|
|-----------|-------|---------------------------------------------|-------------------------------------|
| 1 		| false | wait for the server but not for the journal | Fast, Small window of vulnerability	|
| 1 		| true  | Wait until is write directly in the disk    | Slow 								|
| 0			| 	    | Unacknowledged write                        | Don't 								|
| X 		| false |Wait until X nodes are acknowledge the write | Slow 								|
| majority 	| 	    |Wait for the majority of Nodes               | will (in most cases) avoid rollbacks|
	

**wtimeout** How long you wait	

`j` only wait for writing in the primary node.

```javascript

	pymongo.MongoClient(host="mongodb://localhost:27017",
                        replicaSet="rs1",
                        w=3, wtimeout=10000, j=True, 
                        read_preference=read_pref)
```

## Read Preferences 
Read and writes go to the primary.

* Primary
* Primary Preferred
* Secondary   
* Secondary Preferred  
* Nearest

When reading from secondaries we get _Eventually consistent reads_
## Review of Implications of Replication 
* Seed Lists
* Write Concern: w,j, wtimeout
* Read Preferences
* Errors can happen

## Introduction to Sharding 
Use for scalability.  
Shards typically are replica sets.   
`mongos` handle the shards.
Shard contain chunks (bunch of documents) sort in some way (`shard_key`), any access to the database is done in its own shard. `mongos` know depending in the `shard_key` to whom send the request.
To work with shards we will work with `mongos` instead of `mongod`.  `mongod` is used to work with replica sets but not with shards.

## Building a Sharded Environment 

How to separate documents into shards: 

* Range based: documents from 1..100 to s1
* Hash based: using an key that match a document to a shard. 
	* Does not need to be unique.
	* Every document must have a `shard_key`

## Implications of Sharding 
 * Every doc includes the `shard_key`	
 * `shard_key` is immutable
 * Is needed an index that starts with the `shard_key`	(could be multi index)
 * On updates `shard_keys` must be specified
 * No `shard_key` -> scatter gather operation (expensive)
 * You can not have a unique key unless is part of the `shard_key`.

## Sharding + Replication 
Drivers ¯\_(ツ)_/¯
## Choosing a Shard Key 
* Sufficient cardinality (enough values)
* Hotspotting writes: Write everything in the same place. Like using time creation values.

