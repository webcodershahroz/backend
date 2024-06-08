const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    conId: { type: String, required: true },   
    senderId: { type: String, required: true },
    reciverId: { type: String, required: true },
    sentMessage: { type: String, required: true }
},
{ timestamps: true }
)

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;