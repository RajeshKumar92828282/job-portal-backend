const mongoose = require("mongoose");
const bcrypt= require("bcrypt");


const userSchema= new mongoose.Schema(
   {
    Name:{
        type: String,
        required:[true,"name is required"],
        trim:true,
    },
    Email:{
     type:String,
     required:[true,"email is required"],
     unique:true,
     lowercase:true,
     trim:true,
    },
    Password:{
        type:String,
        required:[true,"password is required"],
        minlength:8,
    },

    Role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },

   

},
 { timestamps: true}
);

//hash password before save 


userSchema.pre("save" , async function(next){
    if(!this.isModified("Password")) return next();
    this.Password= await bcrypt.hash(this.Password,10);
    next();
});

// method compare password

userSchema.method.matchPassword= async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.Password);
};

module.exports= mongoose.model("user",userSchema);