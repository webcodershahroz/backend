const mongoose = require('mongoose')

const ConversationIdSchema = mongoose.Schema({
    conId: { type: String, required: true },   
    senderId: { type: String, required: true },   
    reciverId: { type: String, required: true },   
},
{ timestamps: true }
)

const ConversationId = mongoose.model('ConversationId',ConversationIdSchema);

module.exports = ConversationId;