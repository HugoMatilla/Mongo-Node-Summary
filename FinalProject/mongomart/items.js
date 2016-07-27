/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";

        /*
         * TODO-lab1A
         *
         * LAB #1A: Implement the getCategories() method.
         *
         * Write an aggregation query on the "item" collection to return the
         * total number of items in each category. The documents in the array
         * output by your aggregation should contain fields for "_id" and "num".
         *
         * HINT: Test your mongodb query in the shell first before implementing
         * it in JavaScript.
         *
         * In addition to the categories created by your aggregation query,
         * include a document for category "All" in the array of categories
         * passed to the callback. The "All" category should contain the total
         * number of items across all categories as its value for "num". The
         * most efficient way to calculate this value is to iterate through
         * the array of categories produced by your aggregation query, summing
         * counts of items in each category.
         *
         * Ensure categories are organized in alphabetical order before passing
         * to the callback.
         *
         */
        var query = [{ $project: { title: 1, category: 1 } }, {
            $group: {
                _id: "$category",
                num: { $sum: 1 }
            }
        }, { $sort: { "_id": 1 } }];

        this.db.collection('item').aggregate(query).toArray(function(err, docs) {
            if (err) throw err;
            var categories = docs;
            var itemsCount = 0
            for (var i = 0; i < categories.length; i++) {
                itemsCount += categories[i].num;
            }
            var category = {
                _id: "All",
                num: itemsCount
            };
            categories.unshift(category);
            callback(categories);
        });
    }



    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab1B
         *
         * LAB #1B: Implement the getItems() method.
         *
         * Create a query on the "item" collection to select only the items
         * that should be displayed for a particular page of a given category.
         * The category is passed as a parameter to getItems().
         *
         * Use sort(), skip(), and limit() and the method parameters: page and
         * itemsPerPage to identify the appropriate products to display on each
         * page. Pass these items to the callback function.
         *
         * Sort items in ascending order based on the _id field. You must use
         * this sort to answer the final project questions correctly.
         *
         * Note: Since "All" is not listed as the category for any items,
         * you will need to query the "item" collection differently for "All"
         * than you do for other categories.
         *
         */


        var options = {
            "limit": itemsPerPage,
            "skip": page * itemsPerPage,
            "sort": "_id"
        }
        if (category == "All") {
            this.db.collection('item').find({}, options).toArray(function(err, docs) {
                if (err) throw err;
                var pageItems = docs;
                callback(pageItems);
            });
        } else {
            this.db.collection('item').find({ "category": category }, options).toArray(function(err, docs) {
                if (err) throw err;
                var pageItems = docs;
                callback(pageItems);
            });
        }
    }


    this.getNumItems = function(category, callback) {
        "use strict";

        var numItems = 0;

        /*
         * TODO-lab1C:
         *
         * LAB #1C: Implement the getNumItems method()
         *
         * Write a query that determines the number of items in a category
         * and pass the count to the callback function. The count is used in
         * the mongomart application for pagination. The category is passed
         * as a parameter to this method.
         *
         * See the route handler for the root path (i.e. "/") for an example
         * of a call to the getNumItems() method.
         *
         */

        this.getItems(category, 0, 10000000, function(docs) {
            callback(docs.length)
        });

    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab2A
         *
         * LAB #2A: Implement searchItems()
         *
         * Using the value of the query parameter passed to searchItems(),
         * perform a text search against the "item" collection.
         *
         * Sort the results in ascending order based on the _id field.
         *
         * Select only the items that should be displayed for a particular
         * page. For example, on the first page, only the first itemsPerPage
         * matching the query should be displayed.
         *
         * Use limit() and skip() and the method parameters: page and
         * itemsPerPage to select the appropriate matching products. Pass these
         * items to the callback function.
         *
         * searchItems() depends on a text index. Before implementing
         * this method, create a SINGLE text index on title, slogan, and
         * description. You should simply do this in the mongo shell.
         *
         */
        console.log("------------------");
        console.log("query: " + query);
        var rgxQuery = "/" + query + "/";
        console.log("rgxQuery: " + rgxQuery);
        console.log("------------------");
        var mainQuery = {
            "$or": [
                { "title": { $regex: query } },
                { "slogan": { $regex: query } },
                { "description": { $regex: query } }
            ]
        }
        var options = {
            "limit": itemsPerPage,
            "skip": page * itemsPerPage,
            "sort": "_id"
        }
        this.db.collection('item').find(mainQuery, options).toArray(function(err, docs) {
            if (err) throw err;
            callback(docs);
        });
    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        /*
         * TODO-lab2B
         *
         * LAB #2B: Using the value of the query parameter passed to this
         * method, count the number of items in the "item" collection matching
         * a text search. Pass the count to the callback function.
         *
         * getNumSearchItems() depends on the same text index as searchItems().
         * Before implementing this method, ensure that you've already created
         * a SINGLE text index on title, slogan, and description. You should
         * simply do this in the mongo shell.
         */
        this.searchItems(query, 0, 10000000, function(docs) {
            callback(docs.length)
        });
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        /*
         * TODO-lab3
         *
         * LAB #3: Implement the getItem() method.
         *
         * Using the itemId parameter, query the "item" collection by
         * _id and pass the matching item to the callback function.
         *
         */

        this.db.collection('item').findOne({ _id: itemId }, function(err, doc) {
            if (err) throw err;
            callback(doc);
        });
    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        /*
         * TODO-lab4
         *
         * LAB #4: Implement addReview().
         *
         * Using the itemId parameter, update the appropriate document in the
         * "item" collection with a new review. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields:
         * "name", "comment", "stars", and "date".
         *
         */

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }
        var idQuery = {"_id":itemId};
        var updateQuery = {$push:
                        {"reviews":reviewDoc}
                    };

        this.db.collection('item').update(idQuery,updateQuery, function (err, doc) {
            if (err) return handleError(err);
            callback(doc);
        });
}


this.createDummyItem = function() {
    "use strict";

    var item = {
        _id: 1,
        title: "Gray Hooded Sweatshirt",
        description: "The top hooded sweatshirt we offer",
        slogan: "Made of 100% cotton",
        stars: 0,
        category: "Apparel",
        img_url: "/img/products/hoodie.jpg",
        price: 29.99,
        reviews: []
    };

    return item;
}
}
module.exports.ItemDAO = ItemDAO;
