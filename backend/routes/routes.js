const express = require("express")
const { check, validationResult } = require('express-validator')
const mongodb = require("mongodb").MongoClient
const router = express.Router()
const path = require("path")

const fs = require('fs')
const crypto = require('crypto')
const util = require('util')
const scrypt = util.promisify(crypto.scrypt)
const nodemailer = require('nodemailer')
const User = require('../models/users')



// ------------------------------------GET ROUTES---------------------------------

router.get('/logout', (req, res) => {
    req.session = null
    res.send("You Have Been Logged Out")
})


router.get('/cookie-session', (req, res) => {
    if(req.session.userId) {
        res.status(200).json({msg: "Success", content: null})
    }
    else {
        res.status(400).send("Fail")
    }
})


router.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});



// -------------------------------POST ROUTES----------------------------------

router.post("/signin", async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const userData = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then((client) => {
        return client.db().collection('users').findOne({username})
        .then((res) => {
            client.close()
            return res
        })
        .catch((err) => {
            client.close()
            console.log("Could Not Find any User with that Username")
            return null
        })
    })
    .catch((err) => {
        console.log("Cannot Connect to the Database")
        return null
    })


    const errors = []
    if(!userData) {
        errors.push("Username Does Not Exists")
        res.status(400).send(errors)
    }

    else if(userData.username==username) {
        const salt = userData.salt
        const hashedPassword = await scrypt(password, salt, 16).then((res) => {
            return res.toString('hex')
        })

        if(userData.password==hashedPassword) {
            req.session.userId = userData._id
            res.status(200).json({msg: "Success", content: {Name: userData.username, Role: userData.role}})
        }
        else {
            errors.push("Invalid Password")
            res.status(400).send(errors)
        }
    }
})

// ====================================================================================

router.post("/signup", 
[
    check('email').trim().normalizeEmail({"gmail_remove_dots": false}).isEmail().withMessage("Email Address is Invalid").custom(async (email) => {
        const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
        .then((client) => {
            return client.db().collection('users').findOne({email})
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
            throw new Error('Email Address Already In Use')
        }
    }), 
    check('password').trim().isLength({min: 4}).withMessage("Password Must be Atleast 8 Characters Long"), 
    check('username').trim().isLength({min: 3}).withMessage("Username Must be Atleast 3 Characters Long").custom(async (username) => {
        const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
        .then((client) => {
            return client.db().collection('users').findOne({username})
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

        const salt = crypto.randomBytes(8).toString('hex')
        const hashedPassword = await scrypt(password, salt, 16).then((res) => {
            return res.toString('hex')
        })

        const newUser = new User({ username, email, password: hashedPassword, salt, role })

        const userid = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
        .then((client) => {
            return client.db().collection('users').insertOne(newUser)
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
            console.log("Could NOT Connect to Database Server")
        })

        req.session.userId = userid
        res.status(200).json({msg: "Success", content: null})
    }
    else {
        res.status(400).send(error.errors)
    }
})

// ====================================================================================

router.post('/passwordreset', async (req, res) => {
    const { email } = req.body

    // Find the User detail with the sent username
    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then((client) => {
        return client.db().collection('users').findOne({email})
        .then((res) => {
            const username = res.username
            const newpassword = Buffer.from(`${username}`).toString('base64')
            client.db().collection('users').updateOne({username}, {$set: {password: newpassword, salt: ""}})
            client.close()
            return newpassword
        })
        .catch((err) => {
            client.close()
            return null
        })
    })
    .catch((err) => {
        console.log("Could Not Establish Connection to the Database")
        return null
    })

    if(result) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'qlimaxzftw@gmail.com',
                pass: 'Bfeb@24165'
            }
        })
          
        const mailOptions = {
            from: 'qlimaxzftw@gmail.com',
            to: `${email}`,
            subject: 'Password Reset for Bug Tracker Account',
            text: `Your Bug Tracker Account Password has been Reset\n\nYour New Current Password is: "${result}"\n\nPlease Set your New Password Again`
        }
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
            } else {
                console.log('Email Sent Successfully: ' + info.response)
                res.status(200).json({msg: "Success", content: null})
            }
        })
    }

    // Send an Error If Email Address is Incorrect
    if(!result) {
        res.status(400).send("Fail")
    }


})

// ====================================================================================

router.post('/newpassword', async (req, res) => {

    const { currentPassword, newPassword } = req.body
    const username = Buffer.from(`${currentPassword}`, 'base64').toString('ascii')
    const salt = crypto.randomBytes(8).toString('hex')
    const hashedPassword = await scrypt(newPassword, salt, 16).then((res) => {
        return res.toString('hex')
    })

    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then((client) => {
        return client.db().collection('users').findOne({username})
        .then((res) => {
            if(res) {
                client.db().collection('users').updateOne({username}, {$set: {password: hashedPassword, salt}})
            }
            client.close()
            return res ? true : false
        })
        .catch((err) => {
            client.close()
            return false
        })
    })
    .catch((err) => {
        console.log("Could Not Connect to the Database")
        return null
    })

    if(result) {
        res.status(200).json({msg: "Success", content: null})
    }
    else {
        res.status(400).send("Fail")
    }

})


module.exports = router