const express=require('express')
const { addcontact, getcontact, deleteMessage } = require('../Controllers/contactcontroller')

const contactRoute=express.Router()

contactRoute.post("/addcontact",addcontact)
contactRoute.get("/getcontact",getcontact)
contactRoute.delete("/delete/:id",deleteMessage)
module.exports=contactRoute;