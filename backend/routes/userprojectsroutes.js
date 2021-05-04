const express = require("express")
const ObjectId = require('mongodb').ObjectID;
const mongodb = require("mongodb").MongoClient
const router = express.Router()

//========================================= GET ROUTES ===============================================

router.get('/userprojects', async (req, res) => {
    const {userId, dbname} = req.session
	const databaseName = dbname ? dbname : "bugtracker"

    const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, { useUnifiedTopology: true })
    .then(async (client) => {
        const userProjectIds = await client.db().collection('users').findOne({"_id": ObjectId(userId)})
        const userProjects = await client.db().collection('projects').find({"_id": {$in: userProjectIds.projects}}, {projection: {"_id": 0, title: 1, manager: 1, status: 1}}).toArray()
        await client.close()
        return userProjects
        
    })
    .catch((err) => {
        console.log("Some Error Occurred")
        console.log(err)
    })


    if(result) {
        const finalResult = []
        for(let project of result) {
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
    const {title, manager} = req.headers
    const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"

    const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, { useUnifiedTopology: true })
    .then(async (client) => {
        const temp = await client.db().collection('projects').findOne({title, manager}, { projection: { _id: 0 }})
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



//========================================= POST ROUTES ===============================================

router.post('/updateprojectdetails', async (req, res) => {
    const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"
    const { title, oldTitle, description, status, developers, testers, manager } = req.body
    const newProjectUsers = [...developers, ...testers]

    const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, { useUnifiedTopology: true })
    .then(async (client) => {
        const existingProject = await client.db().collection('projects').findOne({title, manager})
        if(existingProject && oldTitle!=title) {
            await client.close()
            throw new Error("Project with Same Title Already Exists")
        }
        else {
            const temp = await client.db().collection('projects').findOneAndUpdate({ title: oldTitle, manager }, {$set: {title, description, status, developers, testers}}, {returnOriginal: false})
            const projectId = ObjectId(temp.value["_id"])
            const projectName = temp.value.title
            const allTickets = temp.value.tickets
            const ticketIds = []
            for(let ticket of allTickets) {
                ticketIds.push(ObjectId(ticket))
            }
            await client.db().collection('tickets').updateMany({"_id": {$in: ticketIds}}, {$set: {projectName}})
            
            await client.db().collection('users').updateMany({username: {$nin: newProjectUsers}, role: {$in: ["developer", "tester"]}, projects: projectId}, {$pull: {projects: projectId }, $pullAll: {tickets: ticketIds}})
            await client.db().collection('users').updateMany({username: {$in: newProjectUsers}}, {$addToSet: {projects: projectId}})
            await client.close()
            return temp
        }
    })
    .catch((err) => {
        console.log("Some Error Occurred")
        console.log(err)
    })


    if(result) {
        res.status(200).json("Success")
    }
    else {
        res.status(406).send("Fail")
    }
})



//========================================= DELETE ROUTES ===============================================

router.delete('/deleteproject', async(req, res) => {
    const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"
    const {title, manager} = req.body
    
    const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, { useUnifiedTopology: true })
    .then(async (client) => {
        const temp = await client.db().collection('projects').findOneAndDelete({title, manager})
        // const projectName = temp.value.title
        const projectId = temp.value["_id"]
        const ticketIds = temp.value.tickets
        const allProjectUsers = [temp.value.manager, ...temp.value.developers, ...temp.value.testers]

        // await client.db().collection('tickets').deleteMany({ projectName })
        await client.db().collection('tickets').deleteMany({"_id": {$in: ticketIds}})
        await client.db().collection('users').updateMany({username: {$in: allProjectUsers}}, {$pullAll: {tickets: ticketIds}, $pull: {projects: projectId}})
        await client.db().collection('users').updateMany({role: "admin"}, {$pullAll: {tickets: ticketIds}, $pull: {projects: projectId}})
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