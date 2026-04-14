const mongoose = require("mongoose");
const bcrypt= require("bcrypt");


const userSchema= new mongoose.Schema(
   {
    name:{
        type: String,
        required:[true,"name is required"],
        trim:true,
    },
    email:{
     type:String,
     required:[true,"email is required"],
     unique:true,
     lowercase:true,
     trim:true,
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:8,
    },

    role:{
        type:String,
        enum:["user","admin","recruiter"],
        default:"user",
    },

   

},
 { timestamps: true}
);

//hash password before save 


userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
});

// method compare password

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports= mongoose.model("User",userSchema);