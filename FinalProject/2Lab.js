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


// Not correct. sort is missing
db.item.find({ "$or": [{ "title": { $regex: /leaf/ } }, { "slogan": { $regex: /leaf/ } }, { "description": { $regex: /leaf/ } }] })

db.item.createIndex({ title: 1 })
db.item.createIndex({ slogan: 1 })
db.item.createIndex({ description: 1 })
