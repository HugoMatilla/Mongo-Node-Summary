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



    this.getItem(itemId, function(doc) {
        doc.reviews.push(reviewDoc);
        docs.save(function(err) {
                if (err) return handleError(err)
                console.log('Success!');
                callback('Success!')
            }
        });
    });


    db.item.updateOne({ _id: 10 }, {
        $push: {
            reviews: {
                stars: 4.5,
                date: ISODate("2016-01-12T09:00:00Z"),
                name: "Spencer H.",
                coment: "asdasd"
            }
        }
    })
