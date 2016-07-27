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
