let jwt=require("jsonwebtoken")
let User=require("../model/userModel")
//yihe middleware betam private endihon yadergwal mean login yaregesw hullum yerasun
//jwt alw bessu teleyto wede private page yhedal yihe decode yetederegw id
//swyewn lemeleyet yiredal
let protect=async(req,res,next)=>{
let token
console.log(req.headers.authorization);
if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
  console.log("true");
    try{
        //get token from header
        token=req.headers.authorization.split(" ")[1]
  
         //verify token
         let decoded=jwt.verify(token,process.env.JWT_TOKEN)

         //get user from token
         req.user=await User.findById(decoded.id).select("-password")

         next()//yelayingaw xondition simuala ke middleware wetto wede ketay functio yheal

    }
    catch(err){
       // console.log(err);
        res.status(401).json({masg:"Not authorized",error:err})
    }
  }
  if(!token){
    res.status(401).json({msg:"Not authorized, no token"})
  }
}

module.exports={protect}