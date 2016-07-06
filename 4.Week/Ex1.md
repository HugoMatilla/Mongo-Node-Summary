Please review the data model for the Crunchbase companies data set. The document from this collection for Facebook is attached in the handout for convenience. Documents in this collection contain several array fields including one for "milestones".

Suppose we are building a web site that will display companies data in several different views. Based on the lessons in this module and ignoring other concerns, which of the following conditions favor embedding milestones (as they are in the facebook.json example) over maintaining milestones in a separate collection. Check all that apply.

Note: Schema design is as much an art as a science. If you get the answer wrong on your first attempt. Please visit the forum to discuss with your fellow students.


* YES:  The number of milestones for a company rarely exceeds 10 per year.
* Milestones will never contain more than 15 fields
* An individual milestone entry will always be smaller than 16K bytes
* YES: One frequently displayed view of our data displays company details such as the "name", "founded_year", "twitter_username", etc. as well as milestones.
* Some of the milestone fields such as "stoneable_type" and "stoneable" are frequently the same from one milestone to another.


## Ex2
Suppose you are working with a set of categories defined using the following tree structure. "Science" is a sub-category of "Books"; "Chemistry" and "Physics" are sub-categories of "Science"; and "Classical Mechanics" and "Quantum Mechanics" are sub categories of "Physics".

```
Books
    Science
        Chemistry
        Physics
            Classical Mechanics
            Quantum Mechanics
```

For this tree, each node is represented by a document in a collection called categories.

Which of the following schemas will make it possible to find() all descendants of a category using a single query. For example, all descendants of "Science" are "Chemistry", "Physics", "Classical Mechanics", and "Quantum Mechanics".

A)
```
db.categories.insertOne({"_id": "Books", "parent": 0, "left": null, "right": "Science"})
db.categories.insertOne({"_id": "Science", "parent": "Books", "left": "Chemistry", "right": "Physics"})
db.categories.insertOne({"_id": "Chemistry", "parent": "Science", "left": null, "right": null})
db.categories.insertOne({"_id": "Physics", "parent": "Science", "left": "Classical Mechanics", "right": "Quantum Mechanics"})
db.categories.insertOne({"_id": "Classical Mechanics", "parent": "Physics", "left": null, "right": null})
db.categories.insertOne({"_id": "Quantum Mechanics", "parent": "Physics", "left": null, "right": null})
```

B)
```
db.categories.insertOne({"_id": "Quantum Mechanics", "ancestors": ["Books", "Science", "Physics"], "parent": "Physics"})
db.categories.insertOne({"_id": "Classical Mechanics", "ancestors": ["Books", "Science", "Physics"], "parent": "Physics"})
db.categories.insertOne({"_id": "Physics", "ancestors": ["Books", "Science"], "parent": "Science"})
db.categories.insertOne({"_id": "Chemistry", "ancestors": ["Books", "Science"], "parent": "Science"})
db.categories.insertOne({"_id": "Science", "ancestors": ["Books"], "parent": "Books"})
db.categories.insertOne({"_id": "Books", "ancestors": [], "parent": null})
```
C)
```
db.categories.insertOne({"_id": "Classical Mechanics", "parent": "Physics"})
db.categories.insertOne({"_id": "Quantum Mechanics", "parent": "Physics"})
db.categories.insertOne({"_id": "Physics", "parent": "Science"})
db.categories.insertOne({"_id": "Chemistry", "parent": "Science"})
db.categories.insertOne({"_id": "Science", "parent": "Books"})
db.categories.insertOne({"_id": "Books", "parent": null})
```
D)
```
db.categories.insertOne({"_id": "Classical Mechanics", "children": []})
db.categories.insertOne({"_id": "Quantum Mechanics", "children": []})
db.categories.insertOne({"_id": "Physics", "children": ["Classical Mechanics", "Quantum Mechanics"]})
db.categories.insertOne({"_id": "Chemistry", "children": []})
db.categories.insertOne({"_id": "Science", "children": ["Physics", "Chemistry"]})
db.categories.insertOne({"_id": "Books", "children": ["Science"]})
```
E)
```
db.categories.insertOne({"_id": "Classical Mechanics", "children": [], "descendants": []})
db.categories.insertOne({"_id": "Quantum Mechanics", "children": [], "descendants": []})
db.categories.insertOne({"_id": "Physics", "children": ["Classical Mechanics", "Quantum Mechanics"], "descendants": ["Classical Mechanics", "Quantum Mechanics"] })
db.categories.insertOne({"_id": "Chemistry", "children": [], "descendants": []})
db.categories.insertOne({"_id": "Science", "children": ["Chemistry", "Physics"], "descendants": ["Chemistry", "Physics", "Classical Mechanics", "Quantum Mechanics"]})
db.categories.insertOne({"_id": "Books", "children": ["Science"], "descendants": ["Science", "Chemistry", "Physics", "Classical Mechanics", "Quantum Mechanics"]})

Answer
B
##Ex 3

Suppose you are working with a library catalog system containing collections for patrons, publishers, and books. Book documents maintain a field "available" that identifies how many copies are currently available for checkout. There is also a field "checkout" that holds a record of all patrons that are currently borrowing a copy of the book. For example, the document below indicates that the library owns four copies of "Good Book". Three are currently available for checkout. One has been checked out by patron "33457".
```javascript
{
    _id: 123456789,
    title: "Good Book",
    author: [ "Sam Goodman", "Mike Smith" ],
    published_date: ISODate("2010-09-24"),
    publisher_id: "Smith Publishing",
    available: 3,
    checkout: [ { patron_id: "33457", date: ISODate("2012-10-15") } ]
}
```

Which of the following is the primary advantage to this design?


* YES: Can make atomic updates as books are checked out or turned in.
* We maintain the ability to update patrons, publishers, and books independently and safely rely on MongoDB's foreign key constraints.
* We get the ability to retrieve a complete checkout history for books as a side effect.
* Can retrieve all data about a book, its publisher, and any patrons who checked out the book with a single query.
* Books will not grow beyond the MongoDB document size limit of 16MB.