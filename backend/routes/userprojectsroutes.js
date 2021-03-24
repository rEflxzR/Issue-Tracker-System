const express = require("express")
const ObjectId = require('mongodb').ObjectID;
const mongodb = require("mongodb").MongoClient
const router = express.Router()

//========================================= GET ROUTES ===============================================

router.get('/userprojects', async (req, res) => {
    const {userId} = req.session
    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then((client) => {
        return client.db().collection('sampleUsers').aggregate([
            {$match: {"_id": ObjectId(userId)}},
            {$lookup: {
                from: 'projects',
                localField: 'projects',
                foreignField: '_id',
                as: 'userProjectsData'
            }},
            {$project: {"_id": 0}}
        ], {"_id": 0}).toArray()
    })
    .catch((err) => {
        console.log("Could Not Connect to the Database Server")
        console.log(err)
    })

    if(result) {
        const finalResult = []
        for(let project of result[0].userProjectsData) {
            delete project["_id"]
            finalResult.push(project)
        }

        res.status(200).send(finalResult)
    }
    else {
        res.status(406).send("Fail")
    }
})





//========================================= POST ROUTES ===============================================


module.exports = router