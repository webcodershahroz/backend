const express = require('express')
const router = express.Router();
const Messages = require('../models/Messages')
const ConversationId = require('../models/ConversationId')

//save messages to database
router.post('/saveMessages', async (req, res) => {

    try {
        const { senderId, reciverId, sentMessage, sendOrRecive } = req.body;
        const getId = await ConversationId.findOne({ senderId, reciverId });

        if (getId) {
            var conId = getId.conId;
            var messageDetail = null;

            if (sendOrRecive === 'sent') {
                messageDetail = await Messages.create(
                    {
                        conId,
                        senderId,
                        reciverId,
                        sentMessage
                    }
                )
            }
            else if (sendOrRecive === 'recived') {
                messageDetail = await Messages.create(
                    {
                        conId,
                        senderId: reciverId,
                        reciverId: senderId,
                        sentMessage
                    }
                )
            }
        }


        if (messageDetail) {
            console.log(messageDetail)
            return res.send(messageDetail)
        }
        else {
            return res.send('Message not sent')
        }
    } catch (error) {
        console.log(error)
    }

})
//get messages from database

router.post('/showMessages', async (req, res) => {
    try {
        const { senderId, reciverId } = req.body;

        const getId = await ConversationId.findOne({ senderId, reciverId });

        if (getId) {
            conId = getId.conId
            var messages = await Messages.find({ conId })

            if (messages) {
                return res.send(messages)
            }
        }

        else {
            return res.send("no messages")
        }
    } catch (error) {
        console.log(error)
    }

})


module.exports = router;