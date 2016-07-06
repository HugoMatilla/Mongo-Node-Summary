
Which of the following statements are true about choosing and using a shard key? Check all that apply.

* YES: Inserts and updates. Any update that does not contain the shard key will be sent to all shards.
* YES. There must be an index on the collection that starts with the shard key.
* NO: `shard_key` is immutable. You can change the shard key on a collection if you desire.
* NO: The shard key must be unique.
* YES: MongoDB cannot enforce unique indexes on a sharded collection other than the shard key itself or indexes preferred by the shard key.

