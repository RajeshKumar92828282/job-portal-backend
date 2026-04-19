const { application } = require("express");
const Application= require("../models/Application");
const Job = require("../models/Job");


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
  const alreadyapplyjob= await  Application.findOne({job:JobId,applicant:req.user._id,});

  if(alreadyapplyjob){
    return res.status(400).json({message:"you already apply for this job"});
  }

//create application
const application = await Application.create({job:JobId,applicant:req.user._id,coverLetter:CoverLetter});

res.status(201).json({message:"application submitted successfully",application});


await application.populate("job","title company location");
await application.populate("applicant","name email");

}catch(error){
    res.status(500).json({message:"server error", error:error.message});
}

};

const  getMyApplications= async (req,res) =>{

  try{
  const application= await Application.find({applicant:req.user._id})
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

        try{
        const {status}= req.body;
        
const job = await Job.findById(application.job);

       const validstatus= ["Pending","Reviewed","Rejected","Accepted"];

       if(!validstatus.includes(status)){
        return res.status(400).json({message:"invalids status value"});
       }
  
       const application = await Application.findById(req.params.id).populate("job");

       if(!application){
        return res.status(404).json({message:"application not found"}); 
       }
       const job = await Job.findById(application.job);

           const isAdmin= req.user.role === "admin";
           const isOwner= job.postedBy.toString() === req.user._id.toString();
           
           if(!isAdmin && !isOwner){
             return res.status(403).json({message:" Not authorized to view these applications"});
           }

   application.status = status;
   await application.save();

   res.status(200).json({message:`application status updated to "${status} "`,application});






        }catch(error){
             res.status(500).json({message:"server error", error:error.message});
     
        }
        };

      const  withdrawApplication= async (req,res)=>{

  try{
    const application = await Application.findById(req.params.id);

    if(!application){
      return res.status(404).json({message:"application not found"});
    }

    if(application.applicant.toString() !== req.user._id.toString()){
      return res.status(400).json({message:"Not authorized to withdraw this application"});
    }

    if(application.status === "Accepted"){
      return res.status(400).json({message:" Cannot withdraw an accepted application"});
    }
    await application.deleteOne();

    res.status(200).json({message:"application withdrew successfully"});
  
  }catch(error){
     res.status(500).json({message:"server error", error:error.message});

  }

      };



module.exports={
    applyForJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationsStatus,
     withdrawApplication,


};