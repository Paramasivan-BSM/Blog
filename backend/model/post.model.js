const mongoose = require("mongoose");

const postschema = new mongoose.Schema({

    authorId:{
         type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
    },
    title : {
        type:String,
        required:true,
        minlength:10,
        maxlength:100


    },
    content:{
        type:String,
         required:true

    },
    category:{
        type:String,
         required:true
    },
    image:{
        type:"String"
    }

})


const Post_content = mongoose.model("Post-content",postschema);


module.exports = Post_content;