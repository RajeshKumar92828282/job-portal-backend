const jwt=require("jsonwebtoken");
const User= require("../models/User");
const { model } = require("mongoose");

//generate token
const generatetoken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN,
    });
};
// ✅@route   POST /api/auth/register
// ✅ @access  Public


const registerUser = async (req,res)=>{




};


const loginUser=async (req,res)=>{

};


const getme=async (req,res)=>{




};

module.exports={registerUser,loginUser,getme};