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
        console.log("Some Error Occurred")
        console.log(err)
    })


    if(result) {
        const finalResult = []
        for(let project of result[0].userProjectsData) {
            const { title, manager, status } = project
            finalResult.push({title, manager, status})
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
    .then(async (client) => {
        const temp = await client.db().collection('projects').findOne({ title }, { projection: { _id: 0 }})
        await client.close()
        if(temp) {
            return temp
        }
        else {
            throw new Error("Could Not Find any Project in the Collection with the Given Title")
        }
    })
    .catch((err) => {
        console.log("Some Error Occurred")
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
    .then(async (client) => {
        const temp = await client.db().collection('sampleUsers').find({ "role": {$in: ["developer", "tester"]} }).toArray()
        await client.close()
        if(temp.length==0) {
            throw new Error("Cannot Find any Developers or Testers in the Collection")
        }
        else {
            return temp
        }
    })
    .catch((err) => {
        console.log("Some Error Occurred")
        console.log(err)
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
    const {userId} = req.session

    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then(async (client) => {
        const projectManagerName = await client.db().collection('sampleUsers').findOne({ "_id": ObjectId(userId) })
        const existingProject = await client.db().collection('projects').findOne({ title, manager: projectManagerName.username })
        if(existingProject) {
            await client.close()
            throw new Error("Project with Same Title Already Exists")
        }
        else {
            const temp = await client.db().collection('projects').findOneAndUpdate({ title: oldTitle }, {$set: {title, description, status, developers, testers}}, {returnOriginal: false})
            const projectName = temp.value.title
            const allTickets = temp.value.tickets
            const ticketIds = []
            for(let ticket of allTickets) {
                ticketIds.push(ObjectId(ticket))
            }

            await client.db().collection('tickets').updateMany({ "_id": { $in: ticketIds } }, {$set: {projectName}})
            await client.close()
            return temp
        }
    })
    .catch((err) => {
        console.log("Some Error Occurred")
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
        const temp = await client.db().collection('projects').findOneAndDelete({ title })
        await client.close()
        if(temp) {
            return temp
        }
        else {
            throw new Error("Could Not Find any Project in the Collection with the Given Title")
        }
    })
    .catch((err) => {
        console.log("Some Error Occurred")
        console.log(err)
    })


    if(result) {
        res.status(200).send("Success")
    }
    else {
        res.status(406).send("Fail")
    }
})




module.exports = router