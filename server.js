const express= require("express");
const mongoose= require("mongoose");
const mongoDB= require("./config/db");
const dotenv= require("dotenv");

//load env variables
dotenv.config();

//conncet db
mongoDB();

const app =express();


app.get("/", (req,res) =>{
    res.send("hello world");
})



//start server

const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`✅ server is running http://localhost: ${PORT}`);
});

