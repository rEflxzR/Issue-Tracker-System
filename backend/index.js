const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieSession = require("cookie-session")
const path = require("path")
const authroutes = require("./routes/authroutes.js")
const managerolesroutes = require("./routes/managerolesroutes.js")
const manageprojectsroutes = require("./routes/manageprojectsroutes.js")
const userprojectsroutes = require("./routes/userprojectsroutes.js")
const ticketroutes = require("./routes/manageticketroutes")
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
	keys: ["swordbreaker"]
}))
app.use(express.static(path.join(__dirname, '../build')))
app.use(authroutes)
app.use(managerolesroutes)
app.use(manageprojectsroutes)
app.use(userprojectsroutes)
app.use(ticketroutes)

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, '../build', 'index.html'))
})


app.listen(port, () => {
	console.log(`Server Up and Running on Port - ${port}`)
})