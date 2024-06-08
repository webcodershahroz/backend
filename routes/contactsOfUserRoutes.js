const express = require('express')
const router = express.Router();
const UserContact = require('../models/UserContact')
const User = require('../models/User')
const ConversationId = require('../models/ConversationId')


//add contact of user
router.post('/addContact', async (req, res) => {
    //adderId = email of person adding a new contact
    try {
        const { name, adderEmail, email } = req.body;
        const userExists = await User.findOne({ email })
        if (!userExists) {
            return res.status(202).send('Invite your friend')
        }
        const userAlreadyExists = await UserContact.findOne({ adderEmail, email });
        if (userAlreadyExists) {
            return res.send("Already added");
        }
        const pic = userExists.pic;
        const newContact = await UserContact.create({
            pic,
            name,
            adderEmail,
            email
        }).catch((err) => { console.log(err) });

        const opUserAddedU = await UserContact.findOne({ adderEmail: email, email: adderEmail });
        if (!opUserAddedU) {
            var opUser = await User.findOne({ email: adderEmail  });
            const newContact2 = await UserContact.create({
                pic : opUser.pic ,
                name : opUser.name,
                adderEmail: email,
                email: adderEmail
            }).catch((err) => { console.log(err) });

            if (newContact2) {
                await ConversationId.create({
                    conId: newContact2._id,
                    senderId: email,
                    reciverId: adderEmail
                })

            }
        }
        if (newContact) {
            await ConversationId.create({
                conId: newContact._id,
                senderId: adderEmail,
                reciverId: email
            })
            return res.status(200).send(newContact);
        }

        else {
            return res.status(400).send("Error occurs")
        }
    } catch (error) {
        console.log(error)
    }

})

//get contacts for user
router.post('/getContact', async (req, res) => {
    try {
        const { adderEmail } = req.body;
        const contactOfUser = await UserContact.find({ adderEmail });
        if (contactOfUser) {
            return res.status(200).send(contactOfUser);
        }

        else if (contactOfUser.length !== 0) {
            return res.send('No Contacts founds');
        }
        else {
            return res.status(400).send("Error occurs")
        }

    } catch (error) {
        console.log(error)
    }
})

module.exports = router;