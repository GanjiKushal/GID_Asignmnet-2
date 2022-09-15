const mongoose = require("mongoose")
mongoose.pluralize(null)


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password:{
        type:String,
        required:true
    }
})

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema',
        required:true
    },
})

const post = mongoose.model("post",postSchema)
const userschema = mongoose.model("user",userSchema)

module.exports = {User:userschema, Post:post}