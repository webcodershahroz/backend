const express = require('express')
const router = express.Router();


router.get('/',(req,res)=>{
    res.send("Welcome to Greetings : The Chat app");
})


module.exports = router;
