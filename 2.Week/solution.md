#1
Which of the choices below is the title of a movie from the year 2013 that is rated PG-13 and won no awards? Please query the video.movieDetails collection to find the answer.

`db.movieDetails.find({year:2013, rated:'PG-13', 'awards.wins':0}).pretty()`

#3
How many movies list "Sweden" second in the the list of countries.

`db.movieDetails.find({'countries.1':'Sweden'}).count()`

#4
How many documents in our video.movieDetails collection list just the following two genres: "Comedy" and "Crime" with "Comedy" listed first.

`db.movieDetails.find({genres:["Comedy","Crime"]}).count()`
#5
As a follow up to the previous question, how many documents in the video.movieDetails collection list both "Comedy" and "Crime" as genres regardless of how many other genres are listed?

`db.movieDetails.find({genres:{$all:["Comedy","Crime"]}}).count()`

#Extra 1
What query would we use in the Mongo shell to return all movies in the video.movieDetails collection that either won or were nominated for a best picture Oscar? You may assume that an award will appear in the oscars array only if the movie won or was nominated. You will probably want to create a little sample data for yourself in order to work this problem.
```

	db.movieDetails.insertOne({title:"TestFilm", "awards" : {
	    "oscars" : [
	        {"award": "bestAnimatedFeature", "result": "won"},
	        {"award": "bestMusic", "result": "won"},
	        {"award": "bestPicture", "result": "nominated"},
	        {"award": "bestSoundEditing", "result": "nominated"},
	        {"award": "bestScreenplay", "result": "nominated"}
	    ],
	    "wins" : 56,
	    "nominations" : 86,
	    "text" : "Won 2 Oscars. Another 56 wins and 86 nominations."
	}})
```

`db.movieDetails.find({'awards.oscars.award':'bestPicture'})`

#Extra 2

Write an update command that will remove the "tomato.consensus" field for all documents matching the following criteria:

* The number of imdb votes is less than 10,000
* The year for the movie is between 2010 and 2013 inclusive
* The tomato.consensus field is null
How many documents required an update to eliminate a "tomato.consensus" field?

`db.movieDetails.find({'imdb.votes':{$lt:10000}, year:{$gte:2010,$lte:2013},$and:[{'tomato.consensus':null},{'tomato.consensus':{$exists:true}}]}).count()`

```

	db.movieDetails.updateMany({ year: {$gte: 2010, $lte: 2013},
                             "imdb.votes": {$lt: 10000},
                             $and: [{"tomato.consensus": {$exists: true} },
                                    {"tomato.consensus": null} ] },
                           { $unset: { "tomato.consensus": "" } });
```
