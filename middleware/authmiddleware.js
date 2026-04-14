const jwt= require("jsonwebtoken");
const User = require("../models/User");



// protect rooutes jwt

const protect= async (req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&  // check if authorization header exists
        req.headers.authorization.startsWith("Bearer")){      //insure its start with bearer

        try{
          token= req.headers.authorization.split(" ")[1];  //extract the actual token after bearer
          const decode= jwt.verify(token,process.env.JWT_SECRET);  //verify jwt token
          req.user= await User.findById(decode.id).select("-password"); // find the user by id exclude password
          next(); // Pass control to next middleware/route
        }catch(error){
            return res
            .status(401) // unauthorized status
            .json({message:"❌ Not authorized,invalid token"}); // error message invalid token

        }

    }
   if(!token){
    return res.status(401).json({message:"❌ no authorized,no token"}); //error not token provided
   }

};
   // admin only 
   const adminonly= (req,res,next) =>{
      if(req.user && req.user.role==="admin"){  // check if the admin exiest
          next(); //allow access
      }else{
        return res.status(403).json({message:"❌ access deinded, admin only"}) // Forbidden if not admin
      }
   };


   //Recruiter
   const recruiter = (req,res,next)=>{
    if(req.user&& req.user.role==="recruiter"){  //check if the recruiter exiest
        next();//allow access
    }else{
        return res.status(403).json({message:"❌ access deinded,recruiter only"}); //forbidden if not recruiter
    }
   };


// recruiterORadmin

const recruiterORadmin=(req,res,next)=>{
    if(req.user&& //ensure user exiest
        (req.user.role==="recruiter" || req.user.role==="admin")
    ){
        next(); //allow access
    }else{
      return res.status(403).json({message:"❌ access deinded,admin and recruiter only"})
    }
};

module.exports={protect,adminonly,recruiter,recruiterORadmin};