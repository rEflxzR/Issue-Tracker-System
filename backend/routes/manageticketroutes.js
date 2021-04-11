const express = require("express")
const mongodb = require("mongodb").MongoClient
const router = express.Router()
const { ObjectID } = require("mongodb")
const Ticket = require('../models/ticket')


router.get('/projecttickets', async (req, res) => {
	const {title} = req.headers
	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then(async (client) => {
        const temp = await client.db().collection('projects').aggregate([
            {$match: {title}},
            {$lookup: {
                from: 'tickets',
                localField: 'tickets',
                foreignField: '_id',
                as: 'projectTickets'
            }},
            {$project: {"_id": 0}}
        ]).toArray()

		await client.close()
		if(temp.length==0) {
			throw new Error("Could Not Find any Tickets for the Given Project Title")
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
	.then(async (client) => {
		const existingTicket = await client.db().collection('tickets').findOne({ title, projectName: currentUserProject })

		if(existingTicket) {
			throw new Error("Ticket with Same Title Already Exists")
		}
		else {
			const temp = await client.db().collection('tickets').insertOne(newTicket)
			const ticketId = temp.ops[0]["_id"]
			await client.db().collection('sampleUsers').findOneAndUpdate({username: tester}, {$addToSet: {tickets: ticketId}})
			await client.db().collection('projects').findOneAndUpdate({title: currentUserProject}, {$addToSet: {tickets: ticketId}})
			await client.close()
			return temp.ops[0]
		}
	})
	.catch((err) => {
		console.log("Some Error Occurred")
		console.log(err)
	})


	if(result) {
		const {title, status, priority} = result
		const finalResult = {title, status, priority}
		res.status(200).json(finalResult)
	}
	else {
		res.status(406).send("Fail")
	}
})



router.get('/ticketdetails', async (req, res) => {
	const {title, currentuserproject} = req.headers
	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', {useUnifiedTopology: true})
	.then(async (client) => {
		const temp = await client.db().collection('tickets').findOne({ projectName: currentuserproject, title }, { projection: { _id: 0 }})
		await client.close()
		if(temp) {
			return temp
		}
		else {
			throw new Error("Cannot Find any Ticket in the Collection with the given Title")
		}
	})
	.catch((err) => {
		console.log("Some Error Occurred")
		console.log(err)
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

	const { oldTitle, title, description, developer, prevDeveloper, status, comment, type, priority, projectName } = req.body
	const currentdate = new Date()
	const datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + ", " + currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
	const structuredComment = comment!=="" ? {comment, dateCreated: datetime} : null

	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', {useUnifiedTopology: true})
	.then(async (client) => {
		const existingTicket = await client.db().collection('tickets').findOne({ projectName, title })
		if(existingTicket && oldTitle!=title) {
			await client.close()
			throw new Error("Ticket with Same Title Already Exists")
		}
		else {
			let temp = null
			if(structuredComment) {
				temp = await client.db().collection('tickets').findOneAndUpdate({ title: oldTitle }, {$set: { title, description, developer, status, type, priority}, $push: {comments: structuredComment} }, {returnOriginal: false})
			}
			else {
				temp = await client.db().collection('tickets').findOneAndUpdate({ title: oldTitle }, {$set: { title, description, developer, status, type, priority} }, {returnOriginal: false})
			}
			const ticketId = ObjectID(temp.value["_id"])
			await client.db().collection('sampleUsers').findOneAndUpdate({ username: prevDeveloper }, {$pull: {tickets: ticketId }}, {returnOriginal: false})
			await client.db().collection('sampleUsers').findOneAndUpdate({ username: developer }, {$addToSet: {tickets: ticketId }}, {returnOriginal: false})
			await client.close()
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



module.exports = router