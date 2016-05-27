var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    
var bodyParser = require('body-parser');    

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res){

        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('movies', { 'movies': docs } );
        });

    });

    app.post('/', function(req, res){
        var title = req.body.title;
        var year = req.body.year;
        var imdb_id = req.body.imdb_id;
        console.log(`Inserting ${title} ${year} ${imdb_id}`)

        db.collection('movies').insert({'title':title,'year':year,'imdb':imdb_id},function(err, res) {
            console.log(`Result: ${res}`)
        });

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
