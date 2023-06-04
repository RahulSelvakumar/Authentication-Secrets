//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const saltRounds=10;
const app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/UserDB");
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const Users=new mongoose.model("user",userSchema); 

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    Users.findOne({email:username},function(err,foundUser){
        if(err)
            {
            res.send(err);
            }
        else{
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result===true){
                    res.render('secrets');
                }
                else{
                    res.send(err);
                    }
            });
            }            
        });
});

app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new Users({
            email:req.body.username,
            password:hash
        })
        newUser.save(function(err){
            if(err){
                res.send(err);
            }
            else{
                res.render("secrets");
            }
        });     
    });
   
})


app.listen("3000",function(){
    console.log("listening to port 3000");
});