const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieSession = require("cookie-session")
const path = require("path")
const authroutes = require("./routes/authroutes.js")
const dashboardroutes = require("./routes/dashboardroutes.js")
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
	keys: ["swordbreaker"]
}))
app.use(express.static(path.join(__dirname, '../build')))
app.use(authroutes)
app.use(dashboardroutes)

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, '../build', 'index.html'))
})


app.listen(port, () => {
	console.log(`Server Up and Running on Port - ${port}`)
})