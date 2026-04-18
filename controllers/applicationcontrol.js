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


  const applyjob=

}catch(error){
    res.status(500).json({message:"server error", error:error.message});
}

};

const  getMyApplications= async (req,res) =>{

};

   
        const getApplicationsForJob = async (req,res)=>{

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