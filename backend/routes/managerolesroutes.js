const express = require("express")
const mongodb = require("mongodb").MongoClient
const router = express.Router()


//======================================= GET ROUTES =============================================

router.get('/users', async (req, res) => {
	const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"
	
	const result = await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, { useUnifiedTopology: true })
	.then(async (client) => {
		const temp = await client.db().collection('users').find({}).toArray()
		await client.close()
		if(temp.legnth==0) {
			throw new Error("Error Finding Users in the Collection")
		}
		else {
			return temp
		}
	})
	.catch((err) => {
		console.log(err)
		console.log("Database Connection Failed")
	})

	if(result) {
		const users = []
		result.map((user) => {
			let {username, email, role} = user
			role = role=="projectmanager" ? "Project Manager" : role
			users.push({username, email, role})
		})

		res.status(200).send(users)
	}
	else {
		res.status(406).send("Fail")
	}
})




//======================================= POST ROUTES =============================================

router.post('/updateusers', async (req, res) => {
	const { dbname } = req.session
	const databaseName = dbname ? dbname : "bugtracker"
	const { personName, personRole } = req.body
	
	await mongodb.connect(`mongodb://localhost:27017/${databaseName}`, { useUnifiedTopology: true })
	.then(async (client) => {
		await client.db().collection('users').updateMany({username: {$in: personName}}, {$set: {role: personRole}})
		await client.close()
	})
	.catch((err) => {
		console.log(err)
	})

	res.status(200).send("Success")
})



module.exports = router