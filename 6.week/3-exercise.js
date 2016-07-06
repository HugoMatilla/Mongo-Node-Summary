db.companies.aggregate([
    { $match: { founded_year: 2004 } }, {
        $project: {
            _id: 1,
            name: 1,

            rounds: { $size: "$funding_rounds" },
            founded_year: 1,
            "funding_rounds.raised_amount": 1
        }
    },
    { $match: { rounds: { $gte: 5 } } },
    { $unwind: "$funding_rounds" }, {
        $group: {
            _id: "$name",
            stdDev: { $sum: "$funding_rounds.raised_amount" }
        }
    },
    { $sort: { stdDev: 1 } }
])
