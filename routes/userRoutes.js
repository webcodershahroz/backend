const express = require('express')
const router = express.Router();
const User = require('../models/User')
const generateToken = require('../config/jwt');
const bcrypt = require('bcryptjs')

//Post API to register a new user
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;
        let userExists = await User.findOne({ email })
        if (userExists) {
            return res.send("User already exists");
        }
        const salt = await bcrypt.genSalt(10)
        const encryptPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: encryptPassword,
            pic
        });
        if (newUser) {
            return res.send({
                _id: newUser._id,
                name: newUser.name,
                pic: newUser.pic,
                email: newUser.email,
                password: newUser.password,
                token: generateToken(newUser._id)
            })
        }
        return res.status(401).send("Try Again");
    } catch (error) {
        console.log(error)
    }


})
//Login api to give access
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await User.findOne({ email });
        if (userData) {
            const checkPassword = await bcrypt.compare(password, userData.password)
            if (checkPassword) {
                return res.status(200).send({
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    pic: userData.pic,
                    password: userData.password,
                    token: generateToken(userData._id)
                })
            }
            else {
                res.status(400).send("Incorrect Password")
            }
        }
        else {
            res.status(400).send("User not exists")
        }
    } catch (error) {
        console.log(error)
    }

})

module.exports = router;