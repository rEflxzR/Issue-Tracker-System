const express = require("express")
const mongodb = require("mongodb").MongoClient
const router = express.Router()
const Project = require('../models/project')


//======================================= GET ROUTES =============================================


router.get('/userandprojectdetails', async (req, res) => {
	const result = []
	await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
	.then(async (client) => {
		const userDetails = await client.db().collection('users').find({role: {$ne: "admin"}}).toArray()
		const projectDetails = await client.db().collection('projects').find({}).toArray()
		await client.close()
		if(userDetails.length==0 && projectDetails.length==0) {
			throw new Error("Error Finding all Users or Projects in the Database")
		}
		else {
			result.push(userDetails)
			result.push(projectDetails)
		}
	})
	.catch((err) => {
		console.log("Some Error Occurred")
		console.log(err)
	})

	const managers = []
	const developers = []
	const testers = []
	const projects = []
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
		const { title, manager, status } = project
		projects.push({title, manager, status})
	})

	if(result.length) {
		res.status(200).json({msg: "Success", content: {managers, developers, testers, projects}})	
	}
	else {
		res.status(204).send("No Such Users Found")
	}
})


router.get('/allprojects', async (req, res) => {
	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker')
	.then(async (client) => {
		const temp = await client.db().collection('projects').find({}).toArray()
		await client.close()

		if(temp.length==0) {
			throw new Error("Error Finding Projects in the Database")
		}
		else {
			return temp
		}
	})
	.catch((err) => {
		console.log("Some Error Occurred")
		console.log(err)
	})

	if(result.length) {
		const finalresult = []
		result.forEach((project) => {
			const { title, manager, status } = project
			finalresult.push({ title, manager, status })		})
		res.status(200).json({ msg: "Success", content: {finalresult} })
	}
	else {
		res.status(400).send("Fail")
	}
})


router.get('/projectdetails', async (req, res) => {
	const {title} = req.headers
	const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
	.then(async (client) => {
		const temp = await client.db().collection('projects').findOne({ title }, { projection: { _id: 0 } })
		await client.close()
		if(temp) {
			return temp
		}
		else {
			throw new Error("Cannot Find A Project with the Given Title")
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



//======================================= POST ROUTES =============================================


router.post('/newproject', async (req, res) => {
	const { title, description, Manager, Developer, Tester, datetime } = req.body
	const newProject = new Project({ title, description, dateOpened: datetime, manager: Manager, developers: Developer, testers: Tester })
	const allProjectPersonals = []
	allProjectPersonals.push(Manager)
	Developer.forEach((dev) => {allProjectPersonals.push(dev)})
	Tester.forEach((tester) => {allProjectPersonals.push(tester)})

	const project = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
	.then(async (client) => {
		const existingProject = await client.db().collection('projects').findOne({ title, manager: Manager })
		if(existingProject) {
			await client.close()
			throw new Error("Project With Same Title Already Exists")
		}
		else {
			const temp = await client.db().collection('projects').insertOne(newProject)
			const projectId = temp.ops[0]["_id"]
			await client.db().collection('sampleUsers').updateMany({ username: { $in: allProjectPersonals } }, { $addToSet: { projects: projectId } })
			await client.close()
			return temp.ops[0]
		}
	})
	.catch((err) => {
		console.log("Some Error Occurred")
		console.log(err)
	})

	if(project) {
		const projectInfo = {"title": project.title, "manager": project.manager}
		res.status(200).json({msg: "Success", content: projectInfo})
	}
	else {
		res.status(406).send("Fail")
	}
})


module.exports = router