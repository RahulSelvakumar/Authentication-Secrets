//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/UserDB");
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
const secret="Thisismyunguessablesecretkey";
userSchema.plugin(encrypt, { secret:secret,encryptedFields:["password"] } );
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
        if(err){
            res.send(err);
        }
        else{
            if(foundUser.password===password){
                res.render("secrets")
            }
        }
    })
})

app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    const newUser=new Users({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.render("secrets");
        }
    });

})


app.listen("3000",function(){
    console.log("listening to port 3000");
});