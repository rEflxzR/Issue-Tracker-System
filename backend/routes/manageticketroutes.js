const express = require("express")
const mongodb = require("mongodb").MongoClient
const router = express.Router()
const { ObjectID } = require("mongodb")
const Ticket = require('../models/ticket')


//======================================================= GET ROUTES ==============================================================

router.get('/projecttickets', async (req, res) => {
	const {title, manager} = req.headers
	const {userId, dbname} = req.session
	const databaseName = dbname ? dbname : "bugtracker"

	const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, { useUnifiedTopology: true })
    .then(async (client) => {

		const allUserTickets = await client.db().collection('users').findOne({"_id": ObjectID(userId)}, {projection: {"_id": 0, tickets: 1}})
		const ticketIds = allUserTickets.tickets
		const ticketDetails = await client.db().collection('tickets').find({"_id": {$in: ticketIds}, projectName: title}).toArray()
		await client.close()
		return ticketDetails
    })
    .catch((err) => {
		console.log("Some Error Occurred")
        console.log(err)
    })


	if(result) {
		const finalResult = []
		for(let ticket of result) {
			const {title, status, priority} = ticket
			finalResult.push({title, status, priority})
		}

		res.status(200).send(finalResult)
	}
	else {
		res.status(406).send("Fail")
	}
})



router.get('/projectdevsandtesters', async(req, res) => {
	const {title, manager, requirement} = req.headers
	const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"

	const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, {useUnifiedTopology: true})
	.then(async (client) => {
		if(requirement=="only project") {
			const project = await client.db().collection('projects').findOne({title, manager})
			const projectId = ObjectID(project["_id"])
			const users = await client.db().collection('users').find({projects: {$in: [projectId]}, role: {$in: ["developer", "tester"]}}).toArray()
			await client.close()
			return users
		}
		else {
			const users = await client.db().collection('users').find({role: {$in: ["developer", "tester"]}}).toArray()
			await client.close()
			return users
		}
	})
	.catch((err) => {
		console.log("Some Error Occurred")
		console.log(err)
	})

	if(result) {
		const finalDevs = []
		const finalTesters = []
		result.forEach((user) => {
			if(user.role=="developer") {
				finalDevs.push(user.username)
			}
			else {
				finalTesters.push(user.username)
			}
		})

		res.status(206).json({devs: finalDevs, testers: finalTesters})
	}
	else {
		res.status(406).send("Fail")
	}
})



router.get('/ticketdetails', async (req, res) => {
	const {title, currentuserproject} = req.headers
	const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"

	const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, {useUnifiedTopology: true})
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



//================================================= POST ROUTES ====================================================================



router.post('/newticket', async (req, res) => {
	const {title, description, type, priority, assignedDeveloper, assignedTester, currentUserProject, currentProjectManager} = req.body
	// REFACTOR TICKET ID ADDITION CODE BELOW
	const {userId, dbname} = req.session
	const databaseName = dbname ? dbname : "bugtracker"

	const currentdate = new Date() 
	const datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" 
	+ currentdate.getFullYear() + ", " + currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
	
	const newTicket = new Ticket({ title, description, type, priority, dateOpened: datetime, tester: assignedTester, developer: assignedDeveloper, projectName: currentUserProject })

	const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, {useUnifiedTopology: true})
	.then(async (client) => {
		const existingTicket = await client.db().collection('tickets').findOne({ title, projectName: currentUserProject })

		if(existingTicket) {
			await client.close()
			throw new Error("Ticket with Same Title Already Exists")
		}
		else {
			const temp = await client.db().collection('tickets').insertOne(newTicket)
			const ticketId = temp.ops[0]["_id"]
			await client.db().collection('users').updateMany({username: {$in: [assignedDeveloper, assignedTester]}}, {$addToSet: {tickets: ticketId}})
			await client.db().collection('projects').findOneAndUpdate({title: currentUserProject, manager: currentProjectManager}, {$addToSet: {tickets: ticketId}})
			
			if(assignedTester=="") {
				const tester = await client.db().collection('users').findOneAndUpdate({ "_id": ObjectID(userId) }, {$addToSet: {tickets: ticketId}})
				await client.db().collection('tickets').findOneAndUpdate({title, projectName: currentUserProject}, {$set: {tester: tester.value.username}}, {returnOriginal: false})
			}
			if(assignedDeveloper!="") {
				await client.db().collection('tickets').findOneAndUpdate({title}, {$set: {status: "In Progress"}})
			}

			await client.db().collection('users').findOneAndUpdate({role: "admin"}, {$addToSet: {tickets: ticketId}})
			await client.db().collection('users').findOneAndUpdate({username: currentProjectManager}, {$addToSet: {tickets: ticketId}})
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



router.post('/updateticketdetails', async(req, res) => {
	const { oldTitle, title, description, developer, prevDeveloper, status, comment, type, priority, projectName } = req.body
	const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"
	
	const currentdate = new Date()
	const datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + ", " + currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
	const structuredComment = comment!=="" ? {comment, dateCreated: datetime} : null

	const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, {useUnifiedTopology: true})
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
			await client.db().collection('users').findOneAndUpdate({ username: prevDeveloper }, {$pull: {tickets: ticketId }}, {returnOriginal: false})
			await client.db().collection('users').findOneAndUpdate({ username: developer }, {$addToSet: {tickets: ticketId }}, {returnOriginal: false})
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


//======================================================== DELETE ROUTES ==================================================================


router.delete('/deleteticket', async(req, res) => {
	const {title, projectName} = req.body
	const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"

	const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, {useUnifiedTopology: true})
	.then(async (client) => {
		const temp = await client.db().collection('tickets').findOneAndDelete({title, projectName})
		const ticketId = ObjectID(temp.value["_id"])
		const developer = temp.value.developer
		const tester = temp.value.tester

		await client.db().collection('users').updateMany({username: {$in: [developer, tester]}}, {$pull: {tickets: ticketId}})
		const project = await client.db().collection('projects').findOneAndUpdate({tickets: ticketId}, {$pull: {tickets: ticketId}}, {returnOriginal: false})
		await client.db().collection('users').findOneAndUpdate({username: project.value.manager}, {$pull: {tickets: ticketId}})
		await client.db().collection('users').updateMany({role: "admin"}, {$pull: {tickets: ticketId}})
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