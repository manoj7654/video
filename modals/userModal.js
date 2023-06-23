const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String,enum:["patient","doctor",],default:"patient",required:true},
    gender:String,
    specialty:String,
    location:String
},{
    versionKey:false
})

const UserModal=mongoose.model("users",userSchema);


module.exports={UserModal}