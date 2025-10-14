const mongoose = require("mongoose");

let user = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30,
        trim:true,
        set:v=> v.charAt(0).toUpperCase() + v.slice(1),
       
        

    },
    email:{
        type:String,
        match: /.+\@.+\..+/,
        trim:true,
        immutable:true,
        required:true,
        minlength:12,
        maxlength:50,
        unique:true



    },

    password:{
        type:String,
        required:true,
        trim:true,



    },
    role: { type: String, enum: ["user", "admin"], default: "user" }


})


const usermodel = mongoose.model("User",user);

module.exports = usermodel;
