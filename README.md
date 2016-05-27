#1. BASICS
##INIT
1. Start server
`> mongod`
2. Launch the mongo shell 
`> mongo`

##CRUD
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


###Cursor
Create a cursor
`var cursor = db.movies.find()`

Iterate through a cursor
`cursor.next()`

Cursor finished
`cursor.hasNext()`

##NODE
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
##EXPRESS AND TEMPLATE
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

##HW1
###1
`mongod --dbpath=/data/db`
`mongorestore dump`

