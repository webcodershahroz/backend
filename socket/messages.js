
const io = require('socket.io')('8081', {
    cors: {
        origin: 'http://localhost:3000'
    }
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
module.exports = io;