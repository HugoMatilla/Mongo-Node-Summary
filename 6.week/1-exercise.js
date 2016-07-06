db.companies.aggregate([
    { $match: { "relationships.person": { $ne: null } } },
    { $project: { name: 1, relationships: 1, _id: 0 } },
    { $unwind: "$relationships" }, {
        $group: {
            _id: "$relationships.person.permalink",
            company: { $addToSet: "$name" }
        }
    },
    { $unwind: "$company" }, {
        $group: {
            _id: "$_id",
            count: { $sum: 1 }
        }
    },
    { $sort: { count: -1 } }
]);
