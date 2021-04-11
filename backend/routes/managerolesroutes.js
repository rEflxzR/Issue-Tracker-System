const express = require("express")
const mongodb = require("mongodb").MongoClient
const router = express.Router()


//======================================= GET ROUTES =============================================

router.get('/users', async (req, res) => {
	const users = []
	await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
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




//======================================= POST ROUTES =============================================

router.post('/updateusers', async (req, res) => {
	const { personName, personRole } = req.body
	await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
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



module.exports = router