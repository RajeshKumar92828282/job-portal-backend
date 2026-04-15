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

    try{
        const {name,email,password,role} = req.body;

        if(!name||!email || !password){
            return res.status(400).json({messgae:"please fill all required"});
        }

          //check exiest user
          const exiestUser= await User.findOne({email});
          if(exiestUser){
            return res.status(400).json({messgae:"alarady user exiest"});
          }
          //create a new user
          const user= await User.create({name,email,password,role});

          res.status(201).json({
              messgae:"User register successfully",
              token:generatetoken(user._id),
              user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,

              },
          });
    }catch(error){
         return res.status(500).json({message:"❌ server error",error:error.message});
    }
};

//login user 


const loginUser=async (req,res)=>{
    try{
    const {email,password} = req.body;

       if(!email || !password){
        return res.status(400).json({message:"❌ provide email and password"});
       }

       const user = await User.findOne({email});
       if(!user){
        return res.status(401).json({message:"❌ invalid email and password"});
       }

       const isMatch= await user.matchPassword(password);
       if(!isMatch){
        return res.status(401).json({message:"❌ invalid email and password"});
       }

       res.status(200).json({
       message:"Login successful",
       token:generatetoken(user._id),
       user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
       },
       });
    }catch(error){
            res.status(500).json({message:"server error",error:error.message});
    }
};


const getme=async (req,res)=>{
try{
    const user=await User.findById(req.user.id).select("-password");

    res.status(200).json({message:"✅ profile fetched successfully",user});

}catch(error){
    res.status(500).json({message:"servr error",error:error.message});
}



};

module.exports={registerUser,loginUser,getme};