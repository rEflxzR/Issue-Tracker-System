const express = require("express")
const mongodb = require("mongodb").MongoClient
const dashboardrouter = express.Router()
const Project = require('../models/project')


//======================================= GET ROUTES =============================================

dashboardrouter.get('/users', async (req, res) => {
	const users = []
	await mongodb.connect('mongodb://localhost:27017/bugtracker')
	.then((client) => {
		return client.db().collection('users').find({}).toArray().then((res) => {
			client.close()
			res.map((user) => {
				[ username, email, role ] = [user.username, user.email, user.role]
				if(role=="projectmanager") {
					role = "Project Manager"
				}
				users.push({username, email, role})
			})
			return
		}).catch((err) => {
			console.log(err)
		})
	})
	.catch((err) => {
		console.log(err)
		console.log("Database Connection Failed")
	})

	res.status(200).send(users)
})


dashboardrouter.get('/userandprojectdetails', async (req, res) => {
	const result = []
	await mongodb.connect('mongodb://localhost:27017/bugtracker')
	.then(async (client) => {
		const userDetails = await client.db().collection('users').find({role: {$ne: "admin"}}).toArray()
		.then(res => {return res})
		.catch((err) => {console.log("Error Finding Users in Database")})
		result.push(userDetails)
		
		const projectDetails = await client.db().collection('projects').find({}).toArray()
		.then((res) => {
			client.close()
			return res
		})
		.catch((err) => {console.log("Cannot Find Projects in Database")})
		result.push(projectDetails)
	})
	.catch((err) => {
		console.log("Could Not Connect to the Database")
		console.log(err)
	})

	const managers = []
	const developers = []
	const testers = []
	const projects = []
	const projectsFullDetails = []
	result[0].forEach((user) => {
		const { username, role } = user
		if(role=="projectmanager") {
			managers.push({ username, role })
		}
		else if(role=="developer") {
			developers.push({ username, role })
		}
		else {
			testers.push({ username, role })
		}
	})

	result[1].forEach((project) => {
		const { title, description, dateOpened, manager, developers, testers, tickets, status } = project
		projects.push({title, manager, status, dateOpened})
		projectsFullDetails.push({title, description, dateOpened, manager, developers, testers, tickets, status})
	})

	if(result.length) {
		res.status(200).json({msg: "Success", content: {managers, developers, testers, projects, projectsFullDetails}})	
	}
	else {
		res.status(204).send("No Such Users Found")
	}
})


dashboardrouter.get('/allprojects', async (req, res) => {
	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker')
	.then((client) => {
		return client.db().collection('projects').find({}).toArray()
		.then((res) => {
			client.close()
			return res
		})
		.catch((err) => {console.log("Error Finding Projects from the Database"); client.close()})
	})
	.catch((err) => {console.log("Could Not Connect to the Database")})

	if(result.length) {
		const finalresult = []
		const finalresultFullDetails = []
		result.forEach((project) => {
			const { title, description, dateOpened, manager, developers, testers, tickets, status } = project
			finalresult.push({ title, manager, status, dateOpened })
			finalresultFullDetails.push({ title, description, dateOpened, manager, developers, testers, tickets, status })
		})
		res.status(200).json({ msg: "Success", content: {finalresult, finalresultFullDetails} })
	}
	else {
		res.status(400).send("Fail")
	}
})




//======================================= POST ROUTES =============================================

dashboardrouter.post('/updateusers', async (req, res) => {
	const { personName, personRole } = req.body
	await mongodb.connect('mongodb://localhost:27017/bugtracker')
	.then((client) => {
		personName.forEach((name) => {
			client.db().collection('users').findOneAndUpdate({ username: name }, { $set: { role: personRole } })
		})
		client.close()
	})
	.catch((err) => {
		console.log("Could Not Connect to the Database Server")
	})

	res.status(200).send("Success")
})


dashboardrouter.post('/newproject', async (req, res) => {
	const { title, description, Manager, Developer, Tester, datetime } = req.body
	const newProject = new Project({ title, description, dateOpened: datetime, manager: Manager, developers: Developer, testers: Tester })
	const project = await mongodb.connect('mongodb://localhost:27017/bugtracker')
	.then((client) => {
		return client.db().collection('projects').findOneAndUpdate({title}, {$set: newProject}, {upsert: true, returnOriginal: false})
		.then((res) => {

			const projectId = res.lastErrorObject.upserted

			client.db().collection('sampleUsers').findOneAndUpdate({username: Manager}, {$push: {projects: projectId}})
			Developer.forEach((dev) => {
				client.db().collection('sampleUsers').findOneAndUpdate({username: dev}, {$push: {projects: projectId}})
			})
			Tester.forEach((tester) => {
				client.db().collection('sampleUsers').findOneAndUpdate({username: tester}, {$push: {projects: projectId}})
			})
			client.close()
			return res
		})
		.catch((err) => {
			console.log("Project With Same Title Already Exists")
			client.close()
		})
	})
	.catch((err) => {
		console.log("Could Not Connect to the Database")
	})

	if(project) {
		const projectInfo = {"title": project.value.title, "manager": project.value.manager}
		res.status(200).json({msg: "Success", content: projectInfo})
	}
	else {
		res.status(406).send("Fail")
	}
})



module.exports = dashboardrouter