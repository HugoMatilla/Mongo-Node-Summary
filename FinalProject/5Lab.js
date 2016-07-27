        this.db.collection('cart').findOne({ "userId": userId }, function(err, doc) {
            if (err) throw err;
            callback(doc);
        });
