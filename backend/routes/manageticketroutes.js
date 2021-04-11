const express = require("express")
const mongodb = require("mongodb").MongoClient
const router = express.Router()
const { ObjectID } = require("mongodb")
// const Ticket = require('../models/ticket')


router.get('/projecttickets', async (req, res) => {
	const {title} = req.headers
	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then((client) => {
        return client.db().collection('projects').aggregate([
            {$match: {title}},
            {$lookup: {
                from: 'tickets',
                localField: 'tickets',
                foreignField: '_id',
                as: 'projectTickets'
            }},
            {$project: {"_id": 0}}
        ]).toArray()
    })
    .catch((err) => {
        console.log(err)
		console.log("Could Not Connect to the Database Server")
    })


	if(result) {
		const finalResult = []
		for(let ticket of result[0].projectTickets) {
			const {title, status, priority} = ticket
			finalResult.push({title, status, priority})
		}

		res.status(200).send(finalResult)
	}
	else {
		res.status(406).send("Fail")
	}
})



router.post('/newticket', async (req, res) => {
	const {title, description, type, priority, datetime, tester, currentUserProject} = req.body
	const newTicket = new Ticket({ title, description, type, priority, dateOpened: datetime, tester, projectName: currentUserProject })

	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', {useUnifiedTopology: true})
	.then((client) => {
		return client.db().collection('tickets').findOneAndUpdate({title}, {$set: newTicket}, {upsert: true, returnOriginal: false})
		.then(async (res) => {
			const ticketId = res.lastErrorObject.upserted
			await client.db().collection('sampleUsers').findOneAndUpdate({username: tester}, {$addToSet: {tickets: ticketId}})
			await client.db().collection('projects').findOneAndUpdate({title: currentUserProject}, {$addToSet: {tickets: ticketId}})
			await client.close()
			return res
		})
		.catch((err) => {
			client.close()
			console.log("Error In Upsert Function")
		})
	})
	.catch((err) => {
		console.log(err)
		console.log("Could Not Connect to the Database")
	})

	if(result) {
		const {title, status, priority} = result.value
		const finalResult = {title, status, priority}
		res.status(200).json(finalResult)
	}
	else {
		console.log("Failed to make a Ticket")
		res.status(406).send("Fail")
	}
})


router.get('/ticketdetails', async (req, res) => {
	const {title, currentuserproject} = req.headers
	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', {useUnifiedTopology: true})
	.then(async (client) => {
		const temp = await client.db().collection('tickets').findOne({ projectName: currentuserproject, title }, { projection: { _id: 0 }})
		await client.close()
		return temp
	})
	.catch((err) => {
		console.log(err)
		console.log("Could Not Connect to the Database Server")
	})

	if(result) {
		delete result["projectName"]
		result["developer assigned"] = result["developer"]==="" ? "---Not Assigned Yet---" : result["developer"]
		delete result["developer"]
		result["ticket comments"] = result["comments"].length
		result["ticket submitter"] = result["tester"]
		delete result["tester"]
		result["created"] = result["dateOpened"]
		delete result["dateOpened"]
		result["type"] += " Issue"

		res.status(200).send(result)
	}
	else {
		res.status(406).send("Fail")
	}
})



router.post('/updateticketdetails', async(req, res) => {

	const { oldTitle, title, description, developer, prevDeveloper, status, comment, type, priority } = req.body
	const currentdate = new Date()
	const datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + ", " + currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
	const structuredComment = comment!=="" ? {comment, dateCreated: datetime} : null

	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', {useUnifiedTopology: true})
	.then(async (client) => {
		if(structuredComment) {
			const temp = await client.db().collection('tickets').findOneAndUpdate({ title: oldTitle }, {$set: { title, description, developer, status, type, priority}, $push: {comments: structuredComment} }, {returnOriginal: false})
			const ticketId = ObjectID(temp.value["_id"])
			await client.db().collection('sampleUsers').findOneAndUpdate({ username: prevDeveloper }, {$pull: {tickets: ticketId }}, {returnOriginal: false})
			await client.db().collection('sampleUsers').findOneAndUpdate({ username: developer }, {$addToSet: {tickets: ticketId }}, {returnOriginal: false})
			await client.close()
			return temp
		}
		else {
			const temp = await client.db().collection('tickets').findOneAndUpdate({ title: oldTitle }, {$set: { title, description, developer, status, type, priority} }, {returnOriginal: false})
			const ticketId = ObjectID(temp.value["_id"])
			await client.db().collection('sampleUsers').findOneAndUpdate({ username: prevDeveloper }, {$pull: {tickets: ticketId }}, {returnOriginal: false})
			await client.db().collection('sampleUsers').findOneAndUpdate({ username: developer }, {$addToSet: {tickets: ticketId }}, {returnOriginal: false})
			await client.close()
			return temp
		}
	})
	.catch((err) => {
		console.log(err)
		console.log("Could Not Estabilish a Connection to the Database")
	})

	if(result) {
		res.status(200).send(result)
	}
	else {
		res.status(406).send("Fail")
	}
})


router.delete('/deleteticket', async(req, res) => {
	const {title} = req.body
	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', {useUnifiedTopology: true})
	.then(async (client) => {
		const temp = await client.db().collection('tickets').findOneAndDelete({title})
		const ticketId = ObjectID(temp.value["_id"])
		const developer = temp.value.developer
		const tester = temp.value.tester
		const projectTitle = temp.value.projectName
		await client.db().collection('sampleUsers').updateMany({username: {$in: [developer, tester]}}, {$pull: {tickets: ticketId}})
		await client.db().collection('projects').updateMany({title: projectTitle}, {$pull: {tickets: ticketId}})
		await client.close()
		return temp
	})
	.catch((err) => {
		console.log(err)
		console.log("Could Not Connect to the Database Server")
	})

	if(result) {
		res.status(200).send(result)
	}
	else {
		res.status(406).send("Fail")
	}
})



module.exports = router