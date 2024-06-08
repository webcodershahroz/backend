const express = require('express')
const dotenv = require('dotenv');
const connectToMongodb = require('./config/mongodb')
const auth = require('./routes/userRoutes')
const contact = require('./routes/contactsOfUserRoutes')
const messages = require('./routes/MessagesRoutes')
const cors = require('cors')
const app = express();
const path = require('path');
const io = require('socket.io')('8081', {
    cors: {
        origin: 'http://localhost:3000'
    }
})
dotenv.config();
//connecting to mongodb atlas
connectToMongodb();
//app
app.use(cors())
//to accept json value
app.use(express.json())
//routes
app.get('/',(req,res)=>{
    res.send("Hello World")
})
app.use('/auth', auth)
app.use('/user', contact)
app.use('/messages', messages)

//server listening on port 2000
const PORT = process.env.PORT || 3000
app.listen(PORT, (req, res) => {
    console.log(`app is listenig on http://localhost:${PORT}`)
})

var users = [];
io.on('connection', (socket) => {
    console.log('connected with socket');
    socket.on('addUser', async (userId) => {
        if (users.length === 0) {
            users.push({ userId, socketId: socket.id });
        }
        else {
            const userExists = await users.find(user => userId === user.userId)
            if (!userExists) {
                users.push({ userId, socketId: socket.id })
            }
        }
        io.emit('getUsers', users)
    })
    socket.on('sendMessage', async (data) => {
        // console.log(data)
        const msgReciver = await users.find(user => data.reciver === user.userId)
        if (msgReciver) {
            await io.to(msgReciver.socketId).emit('reciveMessage', data);
            // console.log("saving")
            fetch("http://localhost:2000/messages/saveMessages", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ senderId: data.reciver, reciverId: data.sender, sentMessage: data.message, sendOrRecive: 'recived' })
            }).then(res => res.text())
                .then(data => {})
                .catch(error => console.log(error))
        } else {
            // console.log("saving")
            fetch("http://localhost:2000/messages/saveMessages", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ senderId: data.reciver, reciverId: data.sender, sentMessage: data.message, sendOrRecive: 'recived' })
            }).then(res => res.text())
                .then(data => {})
                .catch(error => console.log(error))
        }
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
        console.log(socket.id + " disconected")
        io.emit('getUsers', users)
    })
})
