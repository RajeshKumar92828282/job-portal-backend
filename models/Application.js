const mongoose= require("mongoose");

const applicationSchema= new mongoose.Schema({

job:{
    type:mongoose.Types.ObjectId,
    ref:"Job",
    required:true,


},

application:{
     type:mongoose.Types.ObjectId,
     ref:"User",
     required:true,
},

status:{
    type:String,
    enum:["Pending","Reviewed","Rejected","Accepted"],
    default:"Pending",
},

coverleter:{
  type:String,
  default:"",
},
},
{timestamps: true}
);