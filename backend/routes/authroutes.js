const express = require("express")
const { check, validationResult } = require('express-validator')
const mongodb = require("mongodb").MongoClient
const router = express.Router()
const crypto = require('crypto')
const util = require('util')
const scrypt = util.promisify(crypto.scrypt)
const nodemailer = require('nodemailer')
const User = require('../models/users')



// ---------------------------------------------GET ROUTES---------------------------------------------

router.get('/logout', (req, res) => {
    req.session = null
    res.status(200).send("Successfully Logged Out")
})


router.get('/cookie-session', (req, res) => {
    if(req.session.userId) {
        res.status(200).json({msg: "Success", content: null})
    }
    else {
        res.status(400).send("Fail")
    }
})


// -----------------------------------------POST ROUTES------------------------------------------------

router.post("/demosignin", async (req, res) => {

    const { role } = req.body
    const userData = await mongodb.connect('mongodb://localhost:27017/bugtrackerdemo', { useUnifiedTopology: true })
    .then(async (client) => {
        const temp = await client.db().collection('users').findOne({ role })
        await client.close()
        if(temp) {
            return temp
        }
        else {
            throw new Error('Some Error Occurred while Searching for Users')
        }
    })
    .catch((err) => {
        console.log("Some Error Occurred")
        console.log(err)
    })

    if(userData) {
        req.session.userId = userData._id
        req.session.dbname = "bugtrackerdemo"
        res.status(200).json({msg: "Success", content: {Name: userData.username, Role: userData.role}})
    }
    else {
        res.status(400).send("Fail")
    }
})



router.post("/signin", async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const userData = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then(async (client) => {
        const temp = await client.db().collection('users').findOne({username})
        await client.close()
        if(temp) {
            return temp
        }
        else {
            throw new Error("Could Not Find any User in the Collection")
        }
    })
    .catch((err) => {
        console.log("Some Error Occurred")
        console.log(err)
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

// =====================================================================================================

router.post("/signup", 
[
    check('email').trim().normalizeEmail({"gmail_remove_dots": false}).isEmail().withMessage("Email Address is Invalid").custom(async (email) => {
        const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
        .then(async (client) => {
            const temp = await client.db().collection('users').findOne({email})
            await client.close()
            return temp
        })
        .catch((err) => {
            console.log("Some Error Occurred")
            console.log(err)
        })

        if(result) {
            throw new Error('Email Address Already In Use')
        }
    }), 
    check('password').trim().isLength({min: 4}).withMessage("Password Must be Atleast 8 Characters Long"), 
    check('username').trim().isLength({min: 3}).withMessage("Username Must be Atleast 3 Characters Long").custom(async (username) => {
        const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
        .then(async (client) => {
            const temp = await client.db().collection('users').findOne({username})
            await client.close()
            return temp
        })
        .catch((err) => {
            console.log("Some Error Occurred")
            console.log(err)
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
        .then(async (client) => {
            const temp = await client.db().collection('users').insertOne(newUser)
            await client.close()
            return temp.ops[0]["_id"]
        })
        .catch((err) => {
            console.log("Some Error Occurred")
            console.log(err)
        })

        req.session.userId = userid
        res.status(200).json({msg: "Success", content: null})
    }
    else {
        res.status(400).send(error.errors)
    }
})

// ===================================================================================================

router.post('/passwordreset', async (req, res) => {
    const { email } = req.body

    // Find the User detail with the sent username
    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then((client) => {
        return client.db().collection('users').findOne({email})
        .then(async (res) => {
            const username = res.username
            const newpassword = Buffer.from(`${username}`).toString('base64')
            await client.db().collection('users').updateOne({username}, {$set: {password: newpassword, salt: ""}})
            client.close()
            return newpassword
        })
        .catch((err) => {
            client.close()
            return null
        })
    })
    .catch((err) => {
        console.log("Some Error Occurred")
        console.log(err)
    })

    if(result) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'noreply.bugtrackermgmt@gmail.com',
                pass: 'this is not the actual password :P'
            }
        })
          
        const mailOptions = {
            from: 'noreply.bugtrackermgmt@gmail.com',
            to: `${email}`,
            subject: 'Password Reset for Bug Tracker Account',
            text: `Your Bug Tracker Account Password has been Reset\n\nYour New Current Password is: ${result}\n\nPlease Set your New Password Again`
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

// ====================================================================================================

router.post('/newpassword', async (req, res) => {

    const { currentPassword, newPassword } = req.body
    const username = Buffer.from(`${currentPassword}`, 'base64').toString('ascii')
    const salt = crypto.randomBytes(8).toString('hex')
    const hashedPassword = await scrypt(newPassword, salt, 16).then((res) => {
        return res.toString('hex')
    })

    const result = await mongodb.connect('mongodb://localhost:27017/bugtracker', { useUnifiedTopology: true })
    .then(async (client) => {
        const temp = await client.db().collection('users').findOneAndUpdate({username}, {$set: {password: hashedPassword, salt}}, {returnOriginal: false})
        await client.close()
        return temp ? true : false
    })
    .catch((err) => {
        consolg.log("Some Error Occurred")
        console.log(err)
    })

    if(result) {
        res.status(200).json({msg: "Success", content: null})
    }
    else {
        res.status(400).send("Fail")
    }

})




module.exports = router