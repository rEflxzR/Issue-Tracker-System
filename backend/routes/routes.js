const { Router, response } = require("express")
const express = require("express")
const { check, validationResult } = require('express-validator')
const mongodb = require("mongodb").MongoClient
const router = express.Router()
const path = require("path")
const nodemailer = require('nodemailer')
const User = require('../models/users')



// GET ROUTES

router.get('/logout', (req, res) => {
    req.session = null
    res.send("You Have Been Logged Out")
})

router.get('/cookie-session', (req, res) => {
    // console.log(req.session.userId)
    if(req.session.userId) {
        res.status(200).send("Success")
    }
    else {
        res.status(200).send("Fail")
    }
})

router.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});



// POST ROUTES

router.post("/signin", 
[
    check('username').trim().custom(async (username, {req}) => {
        const password = req.body.password
        const result = await mongodb.connect('mongodb://localhost:27017/bugtracker')
        .then((client) => {
            return client.db().collection('developers').findOne({username})
            .then((res) => {
                client.close()
                return res
            })
            .catch((err) => {
                console.log(err)
                client.close()
            })
        })
        .catch((err) => {
            console.log("Unable to Connect to the Database")
        })

        if(result==null) {
            throw new Error('Username Does Not Exists')
        }
        else if(result.password!=password) {
            throw new Error('Incorrect Password')
        }
    })
], 
async (req, res) => {
    const error = validationResult(req)
    if(error.errors.length) {
        res.status(200).send(error.errors)
    }
    else if(req.session.userId) {
        res.status(200).send("Success")
    }
    else {
        const username = req.body.username
        const userid = await mongodb.connect('mongodb://localhost:27017/bugtracker')
        .then((client) => {
            return client.db().collection('developers').findOne({username})
            .then((res) => {
                client.close()
                return res
            })
            .catch((err) => {
                client.close()
                console.log("Could Not Find any User with that Username")
            })
        })
        .catch((err) => {
            console.log("Cannot Connect to the Database")
        })

        req.session.userId = userid._id
        console.log(req.session.userId)
        res.status(200).send("Success")
    }
})

router.post("/signup", 
[
    check('email').trim().normalizeEmail().isEmail().withMessage("Email Address is Invalid"), 
    check('password').trim().isLength({min: 4}).withMessage("Password Must be Atleast 8 Characters Long"), 
    check('username').trim().custom(async (username) => {
        const result = await mongodb.connect('mongodb://localhost:27017/bugtracker')
        .then((client) => {
            return client.db().collection('developers').findOne({username})
            .then((res) => {
                client.close()
                return res
            })
            .catch((err) => {
                console.log(err)
                client.close()
            })
        })
        .catch((err) => {
            console.log("Error Occurred while Connecting to the Database")
        })

        if(result) {
            throw new Error('Username Already Exists')
        }
    })
], 
async (req, res) => {
    const error = validationResult(req)
    if(!error.errors.length) {
        const { username, password, email, role } = req.body
        const newUser = new User({ username, email, password, role })

        const userid = await mongodb.connect('mongodb://localhost:27017/bugtracker')
        .then((client) => {
            return client.db().collection('developers').insertOne(newUser)
            .then((res) => {
                client.close()
                return res.insertedId
            })
            .catch((err) => {
                client.close()
                console.log("There was an Error Inserting the User into the Database")
            })
        })
        .catch((err) => {
            console.log("Could NOT Connect to MongoDB Server")
        })

        req.session.userId = userid
        res.status(200).send("Success")
    }
    else {
        res.status(200).send(error.errors)
    }
})


router.post('/passwordreset', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'qlimaxzftw@gmail.com',
          pass: 'yourpassword'
        }
      });
      
      var mailOptions = {
        from: 'youremail@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
})



module.exports = router