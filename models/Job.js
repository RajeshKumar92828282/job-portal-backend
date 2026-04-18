const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const jobSchema= new moongoose.Schema(
    {
     
    title:{
       type:String,
       required:[true,"Job title is require"],
       trim:true,
    },
    company:{
      type:String
    },

    location:{
      type:String,
      requred:[true,"location is required"],

    },
     description:{
       type:String,
       required:[true,"Job descripiton is required"],

    },
     
    salary:{
      type:String,
      default:"Not disclosed",
    },

    type:{
      type:String,
      enum:["Full-Time","Part-Time","Internship","Remote"],
      default:"Full-Time",
    },

    postedBy:{
      type:moongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    postedByrole:{
           type:String,
           enum:["user","admin","recruiter"],
           required:true,
    },
},
{timestamps : true}
);

module.exports= mongoose.model("Job" , jobSchema);