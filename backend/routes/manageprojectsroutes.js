const express = require("express")
const mongodb = require("mongodb").MongoClient
const router = express.Router()
const Project = require('../models/project')


//======================================= GET ROUTES =============================================


router.get('/userandprojectdetails', async (req, res) => {
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
		const { title, dateOpened, manager, status } = project
		projects.push({title, manager, status, dateOpened})
=	})

	if(result.length) {
		res.status(200).json({msg: "Success", content: {managers, developers, testers, projects}})	
	}
	else {
		res.status(204).send("No Such Users and Projects Found")
	}
})


router.get('/allprojects', async (req, res) => {
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
		result.forEach((project) => {
			const { title, dateOpened, manager, status } = project
			finalresult.push({ title, manager, status, dateOpened })
		})
		res.status(200).json({ msg: "Success", content: {finalresult} })
	}
	else {
		res.status(400).send("Fail")
	}
})



//======================================= POST ROUTES =============================================


router.post('/newproject', async (req, res) => {
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


module.exports = router