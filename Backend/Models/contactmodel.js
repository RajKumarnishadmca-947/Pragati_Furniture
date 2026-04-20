const mongoose=require('mongoose')

const contactSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    
},{timestamps:true});

const Contacts=mongoose.model("Contacts",contactSchema)
module.exports=Contacts;