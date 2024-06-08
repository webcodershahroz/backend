const mongoose = require('mongoose')

const ContactofUserSchema = mongoose.Schema({
    email:{type:String,required:true},
    adderEmail: { type: String, required: true },
    name:{type:String,required:true},
    pic: { type: String, default: 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg' }
},
{ timestamps: true }
)

const UserContacts = mongoose.model('UserContacts',ContactofUserSchema);

module.exports = UserContacts;