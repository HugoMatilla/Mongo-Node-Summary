{
    "_id": 4,
    "title": "Track Jacket",
    "slogan": "Go to the track in style!",
    "description": "Crafted from ultra-soft combed cotton, this essential jacket features sporty contrast tipping and MongoDB's signature embroidered leaf.",
    "stars": 0,
    "category": "Apparel",
    "img_url": "/img/products/track-jacket.jpg",
    "price": 45,
    "reviews": [{
        "name": "Shannon",
        "comment": "This is so warm and comfortable.",
        "stars": 2,
        "date": 1455800194995
    }, {
        "name": "Bob",
        "comment": "Love this.",
        "stars": 5,
        "date": 1455804800769
    }, {
        "name": "Jorge",
        "comment": "Brown. It's brown.",
        "stars": 4,
        "date": 1455804825509
    }]
}
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

db.item.aggregate([
    { $project: { title: 1, category: 1 } }, {
        $group: {
            _id: "$category",
            count: { $sum: 1 }
        }
    },
    { $sort: { "_id": 1 } }
]);

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

if (category === "All")
    pageItems = db.item.find().skip(page * itemsPerPage).limit(itemsPerPage).sort({ "_id": 1 })
else
    pageItems = db.item.find({ "category": category }).skip(page * itemsPerPage).limit(itemsPerPage).sort({ "_id": 1 });

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

db.item.find({ "category": category }).count();
