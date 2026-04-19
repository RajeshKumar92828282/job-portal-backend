const { application } = require("express");
const Application= require("../models/Application");
const Job = require("../models/Job");
const Job= require("../models/Job");

const applyForJob = async (req,res) =>{
 
try{

 const {JobId} = req.params;
 const {CoverLetter} = req.body;

 //check if the job exiest
 const job= await Job.findById(JobId);
 if(!job){
    return res.status(404).json({message:"job not found"})
 }

 //block the admin and recruiter
 if(req.user.role==="admin" || req.user.role==="recruiter"){
    return res.status(403).json({message:"admin and recruiter cannot be apply job"});
 }

  //check if the already applied
  const alreadyapplyjob= await  Application.findOne({job:JobId,application:req.user._id,});

  if(alreadyapplyjob){
    return res.status(400).json({message:"you already apply for this job"});
  }

//create application
const application = await Application.create({job:JobId,application:req.user._id,CoverLetter});

res.status(201).json({message:"application submitted successfully",application});


await application.populate("job","title company location");
await application.populate("application","name email");

}catch(error){
    res.status(500).json({message:"server error", error:error.message});
}

};

const  getMyApplications= async (req,res) =>{

  try{
  const application= await Application.find({application:req.user._id})
  .populate("job","title company location type salary").sort({createdAt: -1});
  
  res.status(200).json({message:"your application featch succesfully",count:application.length,application});

    
  }catch(error){
   res.status(500).json({message:"server error", error:error.message});
  }

};

   
        const getApplicationsForJob = async (req,res)=>{


          try{

            const {JobId} = req.params;
            const job= await Job.findById(JobId);
            if(!job){
              return res.status(404).json({message:"job not found"});
            }


            const isAdmin = req.user.role === "admin";
            const isOwner= job.postedBy.toString() === req.user._id.toString();

            if(!isAdmin && !isOwner ){
              return res.status(403).json({message:" Not authorized to view these applications"});
            }
            const application = await Application.find({job:JobId})
            .populate("application", "name email").sort({createdAt: -1});

            res.status(200).json({message:"application featched successfully",count:application.length,application});

          }catch(error){
              res.status(500).json({message:"server error", error:error.message});
          }

        };

        const  updateApplicationsStatus= async (req,res) =>{

        };

      const  withdrawApplication= async (req,res)=>{

      };



module.exports={
    applyForJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationsStatus,
     withdrawApplication,


};