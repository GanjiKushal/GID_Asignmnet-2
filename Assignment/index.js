require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/User",()=>console.log("Databse connceted"))

const {User} = require("./database")
const {Post} = require("./database")
const app = express()
app.use(express.json())

const jwt = require("jsonwebtoken")

const bcrypt = require('bcrypt')

const data = []

app.get("/",async(req,res)=>{
    try{

        let bod = await User.find()
        res.send(bod)
    }
    catch(e){
        res.send(e.message)
    }
})

app.post("/register",async(req,res)=>{
    try{
        let salt = await bcrypt.genSalt()
        //c34rewf34f3r23
        let hashedPassword = await bcrypt.hash(req.body.password,salt)

        let bod = await User.create({
           name:req.body.name,
           email:req.body.email,
           password:hashedPassword
        })
        res.send(bod)
    }
    catch(e){
        res.send(e.message)
    }
})

app.post("/login",async(req,res)=>{
    try{
        let data = await User.find({email:req.body.email})  
        if(data==undefined){
           return  res.status(401).send("No email exist")
        }
        console.log(data)
        //CHECK IF PASSWORD IS CORRECT 

        if(await bcrypt.compare(req.body.password,data[0].password)){  //a->asdasdsadsa    // hashed password hash->  asdasdsadsa
            const accessToken = jwt.sign({name:data[0].name,user_id:data[0]._id}, process.env.ACCESS_TOKEN_SECRET)  // needs an object
            res.json({
                token:accessToken, 
                login_status:"Successfull! You are Logged In",
            })
        }
        else{
            res.send("Incorrect Password")
        }
    }
    catch(e){
        res.send(e.message)
    }
})


app.get("/posts",async(req,res)=>{
    try{
        let db = await Post.find()
        res.send(db)
    }
    catch(e){
        res.send(e.message)
    }
})


app.post("/posts",async (req,res)=>{
    try{
        // console.log(req.headers.authorization.split(" ")[1])
        console.log(req.headers)
        if(req.headers.authorization==null){
            res.send("You need to be logged in ")
        }
        else{
            let token = req.headers.authorization.split(" ")[1]
            let decoded = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            // console.log(decoded)
            let db = await Post.create({
                title:req.body.title,
                body:req.body.body,
                image:req.body.image,
                user:decoded.user_id
            })
            res.send(db)
        }
    }
    catch(e){
        res.send(e.message)
    }
})

app.put("/posts/:postId",async (req,res)=>{
    try{
        let token = req.headers.authorization.split(" ")[1]
        let decoded = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(decoded=undefined){
            res.status(400).send({})
        }
        else{
            _id = req.params.postId
            let db = await Post.findByIdAndUpdate(_id,req.body,{new:true})
            res.send({status:"Sucess",})
        }
    }
    catch(e){
        res.send(e.message)
    }
})

app.delete("/posts/:postId",async (req,res)=>{
    try{
        let token = req.headers.authorization.split(" ")[1]
        let decoded = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(decoded=undefined){
            res.status(400).send({})
        }
        else{
            _id = req.params.postId
            let db = await Post.findByIdAndDelete(_id)
            res.send({status:"Successfully deleted"})
        }

    }
    catch(e){
        res.send(e.message)
    }
})

app.listen(3000,()=>console.log("Its connected"))

