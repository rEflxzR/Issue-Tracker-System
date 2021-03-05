const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieSession = require("cookie-session")
const path = require("path")
const routes = require("./routes/routes.js")
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
	keys: ["swordbreaker"],
	maxAge: 24 * 60 * 60 * 1000
}))
app.use(express.static(path.join(__dirname, '../build')));
app.use(routes)


app.listen(port, () => {
	console.log(`Server Up and Running on Port - ${port}`)
})