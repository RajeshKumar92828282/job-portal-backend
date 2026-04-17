const Job = require("../models/Job");




const createjob= async (req,res) =>{
  try{
  
    const {title,company,location,description,salary,type}=req.body;
    if(!title || !company||! location||!description){
      return res.status(400).json({message:"please fill the required"});
    }

    const job= await Job.create({
      title,
      company,
      location,
      descripition,
      salary,
      type,
      postedby:req.user._id,
      postedbyrole:req.user.role,
    });
  res.status(201).json({message:"✅ job posted successfully",job})

  }catch(error){
  
      res.status(500).json({message:"server error",error:error.message});
  }


};


const getalljobs= async (req,res) =>{
 try{
   
  const jobs= (await Job.find().populate("postedby", "name email role")).sort({ createdAt:-1});

  res.status(200).json({message:"job featched successfully",count:jobs.length,jobs});

 }catch(error){
  res.status(500).json({message:"server error",error:error.message});
 }



};


const searchalljobs= async (req,res) =>{

try{
       const {q,location,type}= req.body;
       const filter={};

       if(q){
         filter.$or=[
               {title:{$regex:q,$options:"i"}},
               {company:{$regex:q,$options:"i"}},
               {descripition:{$regex:q,$options:"i"}},
         ];
       }

       if(location) filter.location={$regex:q,$options:"i"};
       if(type) filter.type=type;

        const jobs= await Job.find(filter).populate("postedby","name eamil role").sort({createdAt:-1});

        res.status(200).json({message:"search result",count:jobs.length,jobs});
}catch(error){
  res.status(500).json({message:"server error",error:error.message});
}
  
};

const  getMyPostedJobs = async (req,res) =>{
      try{

     const jobs= (await Job.find({postedby:req.user._id})).sort({createdAt:-1});
     res.status(200).json({message:"your posted job fetched sucessfully",count:jobs.length,jobs});

      }catch(error){
         res.status(500).json({message:"server error",error:error.message});

      }
};

const getJobById = async (req,res) =>{

  try{
   
  const job= await Job.findById(req.params.id).populate("postedby","name email role");

  if(!job) return res.status(404).json({message:"job not found"});

  res.status(200).json({message:"job fetched successfully",job});

  }catch(error){
     res.status(500).json({message:"server error",error:error.message});

  }

};

const updatejob= async (req,res)=>{

 try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({message:"job not found"});


    const isAdmin= req.user.role=== "admin";
    const isOwner= job.postedby.toString() === req.user._id.toString();


    if(!isAdmin && !isOwner){
      return res.status(403).json({message:"Not authorized to update this job"});
    }

    const updatedjob= await Job.findByIdAndUpdate(req.params.id,{...req.body},{new:true,runValidators:true});

    res.status(200).json({message:"job update sucessfully",job:updatedjob});
 }catch(error){
    res.status(500).json({message:"server error",error:error.message});

 }

};

const deletejob =async (req,res) => {
    
};

module.exports={createjob,getalljobs,searchalljobs,getMyPostedJobs,getJobById,updatejob,deletejob};