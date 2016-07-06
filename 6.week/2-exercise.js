db.grades.aggregate([
    { $project: { "class_id": 1, "student_id": 1, "scores.type": 1, "scores.score": 1, _id: 0 } },
    { $unwind: "$scores" },
    { $match: { "scores.type": { $ne: "quiz" } } }, {
        $group: {
            _id: "$class_id",
            stdDev: { $stdDevPop: "$scores.score" }
        }
    }
]);
