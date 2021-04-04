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


router.get('/myprojectdetails', async (req, res) => {
    const {title} = req.headers
    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then((client) => {
        return client.db().collection('projects').findOne({ title }, { projection: { _id: 0 }})
        .then((res) => {
            client.close()
            return res
        })
        .catch((err )=> {
            client.close()
            console.log("Could Not Find a Project with the given Title")
            return false
        })
    })
    .catch((err) => {
        console.log("Could Not Connect to the Database Server")
        console.log(err)
    })

    if(result) {
        result["created"] = result["dateOpened"]
		delete result["dateOpened"]
		result["tickets"] = result["tickets"].length
        
        res.status(200).send(result)
    }
    else {
        res.status(406).send("Fail")
    }
})


router.get('/devsandtesters', async (req, res) => {
    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then((client) => {
        return client.db().collection('sampleUsers').find({ "role": {$in: ["developer", "tester"]} }).toArray()
        .then((res) => {
            client.close()
            return res
        })
        .catch((err) => { client.close(); console.log("Could Not Find any Users in the Database") })
    })
    .catch((err) => {
        console.log(err)
        console.log("Failed to Connect to the Database")
    })

    if(result) {
        res.status(200).send(result)
    }
    else {
        res.status(406).send("Fail")
    }
})





//========================================= POST ROUTES ===============================================

router.post('/updateprojectdetails', async (req, res) => {
    const { title, oldTitle, description, status, developers, testers } = req.body
    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then(async (client) => {
        const tempresult = await client.db().collection('projects').find({title: {$in: [title, oldTitle]}}).count()
        if(tempresult==2) {
            throw new Error('Project with Same Title Already Exists')
        }
        else {
            const temp = await client.db().collection('projects').findOneAndUpdate({ title: oldTitle }, {$set: {title, description, status, developers, testers}}, {returnOriginal: false})
            client.close()
            return temp
        }
    })
    .catch((err) => {
        console.log(err)
    })

    if(result) {
        res.status(200).json({ title, description, status, developers, testers })
    }
    else {
        res.status(406).send("Fail")
    }
})



//========================================= DELETE ROUTES ===============================================

router.delete('/deleteproject', async(req, res) => {
    const {title} = req.body
    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then(async (client) => {
        const temp = await client.db().collection('projects').findOne({ title })
        client.close()
        return temp
    })
    .catch((err) => {
        console.log(err)
        console.log("Could Not Connect to the Database Server")
    })

    if(result) {
        res.status(200).send("Success")
    }
    else {
        res.status(406).send("Fail")
    }
})




module.exports = router