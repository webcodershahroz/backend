const express = require('express')
const dotenv = require('dotenv');
const connectToMongodb = require('./config/mongodb')
const auth = require('./routes/userRoutes')
const contact = require('./routes/contactsOfUserRoutes')
const messages = require('./routes/MessagesRoutes')
const cors = require('cors')
const app = express();
const messageIO = require('./socket/messages')
const path = require('path');

dotenv.config();
//connecting to mongodb atlas
connectToMongodb();
//app
app.use(cors())
//to accept json value

app.use(express.json())
//socket messages io
messageIO;
//routes

app.use('/auth', auth)
app.use('/user', contact)
app.use('/messages', messages)

//server listening on port 2000
const PORT = process.env.PORT || 8000
app.listen(PORT, (req, res) => {
    console.log(`app is listenig on http://localhost:${PORT}`)
})

