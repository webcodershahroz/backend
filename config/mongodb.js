const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectToMongodb = async () => {
    try {
        const con = await mongoose.connect("mongodb+srv://shahrozshahzad:shahroz@cluster0.1howp3m.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser:true,
            useUnifiedTopology: true
         })
        console.log(`Connected Successfully: ${con.connection.host} `);
    } catch (error) {
        console.log("Error: " + error.message)
    }
}

module.exports =connectToMongodb;