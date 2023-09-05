let express=require("express")
let router=express.Router()
let User=require('../model/userModel')
let otpGeenerator=require("otp-generator")
let jwt=require("jsonwebtoken")
let bcrypt=require("bcryptjs")
let {protect}=require("../middleware/userMiddleWare")
let nodemailer=require("nodemailer")
let {localVariable}=require("../middleware/localVariable")
const { randomUUID } = require('crypto');
let fs=require("fs")
const multer  = require('multer')
const { log } = require("console")

require("dotenv").config

////post
let generalTokn=(id)=>{
    return jwt.sign({id}, process.env.JWT_TOKEN,{expiresIn:'30d'}
    )
}

router.post("/register",async(req,res)=>{
//user registers when he verifys the OTP
 try{
   let {username,email,password,bulloName}=req.body
   let EmailExist=await User.findOne({email:email})
   if(EmailExist){
       return res.status(400).json({success:false,msg:`User with email: ${email} Already Registerd`})
   }

   let userNameExist=await User.findOne({username:username})
   if(userNameExist){
       return res.status(400).json({success:false,msg:`User with username: ${username} Already Registerd`})
   }

       let saltRounds=10
       const salt = bcrypt.genSaltSync(saltRounds);
       const hashedPassword = bcrypt.hashSync(password, salt);
       password=hashedPassword   
       let user=await User.create({username:username,email:email,password:password,bulloName:bulloName})
    if(user&&req.app.locals.resetSession){
         res.status(200).json({success:true,token:generalTokn(user._id),msg:"succesfuly registered",data:user})
      }
     else{
        res.status(500).json({error:true,msg:"invalid user data or network error"})

       }
}
catch{
    res.status(500).json({error:true,msg: "network error occured while romaining"})
}

})
router.post("/logIn",localVariable,async(req,res)=>{
 try{
    let {username,password}=req.body
    let findUser=await User.findOne({username:username})
    if(findUser&&(await bcrypt.compare(password,findUser.password))){
        await User.updateOne({username:username}, {$set:{logged:true}})
        let updatedUser=await User.findOne({username:username})
        req.app.locals.User=username
        return res.status(200).json({success:true,msg:"logged in successfully",password:password,token:generalTokn(updatedUser._id),data:updatedUser})
    }

    res.status(404).json({success:false,msg:"Invalid credentials"})
}
catch{    
    res.status(500).json({error:true,msg: "network error occured while romaining"})
}
})

router.post("/logOut",protect,localVariable,async(req,res)=>{
    req.app.locals.online=false
   try{
       let {username}=req.body
       let findUserLoggedIn=await User.findOne({username:username})
       if(findUserLoggedIn.logged){
           await User.updateOne({username:username}, {$set:{logged:false,online:false}})
            let updatedUser=await User.findOne({username:username})
            req.app.locals.User=null
            res.status(200).json({success:true,msg:"logged out successfully",data:updatedUser})
       }
       else{
        res.status(404).json({success:false,msg: "user is not logged in"})
       }
   }
   catch{
    res.status(404).json({error:true,msg: "error occured while logging out"})
   }


   })

////sendEmail

router.post("/registerMail",async(req,res,next)=>{
    let {email,code,username}=req.body
   if(email){
   const transporter = nodemailer.createTransport({
       service:"gmail",
       auth:{
           user:process.env.NODEMAILER_EMAIL,
           pass:process.env.NODEMAILER_PASSWORD
          },
      tls: {
           rejectUnauthorized: false
       }
       });
  let mailOption={
      from:"nesredinhaji111@gmail.com",
      to:email,
      subject:"Bullo.app",
      html:`hello, ${username} Your verification code is `+ code||"Timed out. try again!!",
     // text:code||"Timed out. try again!!",
    /**
      attachments:[
       {
           filename:"test image",
           path:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fimgur.com%2FR38vPZJ.jpg&imgrefurl=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F45380600%2Fnode-red-and-nodemailer-error-unable-to-verify-the-first-certificate&tbnid=-BZE7c-VVSwnQM&vet=12ahUKEwjdyPenktP9AhXNmicCHVlqBCAQMygEegQIARBK..i&docid=8BR6HxhYMXGiIM&w=499&h=434&q=i%20got%20t%20unable%20to%20send%20Error%3A%20self-signed%20certificate%20in%20certificate%20chain%20when%20i%20try%20to%20send%20email%20with%20nodejs&ved=2ahUKEwjdyPenktP9AhXNmicCHVlqBCAQMygEegQIARBK"
       },
       {
           filename:"test File",
           path:"https://books.google.com.et/books?id=tf--AAAAQBAJ&printsec=frontcover&dq=i+got+t+unable+to+send+Error:+self-signed+certificate+in+certificate+chain+when+i+try+to+send+email+with+nodejs&hl=en&sa=X&ved=2ahUKEwiOusHGk9P9AhUYrqQKHWwCBF0Q6wF6BAgDEAE"
       }

      ] */
  }
  
  transporter. sendMail(mailOption,(err,info)=>{
      if(err){
          return res.status(401).json({status:false,msg:"unable to send email"})
      }
       res.status(200).json({status:true,msg:"email sent successfuly"});

  })
  
 }//brase of if statement
 else{
  res.status(401).json({status:false,msg:"please insert Email"})
      
 }
})

////get
router.get("/register",async(req,res)=>{
   try{
        let user=await User.find() 
        res.status(200).json({succes:true,data:{user}})//look at the network  
    }
    catch(error){
        res.status(501).json({error:error,msg:"Error occured while romaining"})
  
    }
})


router.get("/logIn",async(req,res)=>{
    try{
        let user=await User.find({logged:true}) 
        res.status(200).json({succes:true,data:{user}})//look at the network  
    }
    catch(error){
        res.status(501).json({error:error,msg:"Error occured while romaining"})
  
    }
})

///////get individual users including yourself

router.get("/user/:currentUSername",localVariable,async(req,res)=>{
    let {currentUSername}=req.params
    let {otherUsers}=req.query
    try{
        let user=await User.findOne({username:otherUsers})
        if(user){
               if(currentUSername===otherUsers){
                 let findUser=await User.findOne({username:currentUSername})
                    if(findUser){
                        res.status(200).json({succes:true,data:findUser,token:generalTokn(findUser._id)})
                    }
                    else{
                        res.status(404).json({error:true,msg:"user not found"})
                    }
               }
              else{
                    let {username,bulloName,profilePicture,logged,coverPicture,
                        online,followings,followers,story,city,from,relationship,memories}=user
                        res.status(200).json({succes:true,
                            data:{
                            username:username,
                            bulloName:bulloName,
                            profilePicture:profilePicture,
                            logged:logged,
                            coverPicture:coverPicture,
                            online: online,
                            followings:followings,
                            followers:followers,
                            story:story,
                            city:city,
                            from:from,
                            relationship:relationship,
                            memories:memories
                        }
                        })
                   
              }
          
    
        }
        else{ 
            res.status(404).json({error:true,msg:"user not found"})
        }

    }
    catch(error){
        res.status(501).json({error:error,msg:"Error occured while romaining"})
    }
})


///make user online
router.put("/onlineUsers/:onlineUser",localVariable,async(req,res)=>{
    let {onlineUser}=req.params
    try{
         let findUser=await User.findOne({username:onlineUser})
         if(!findUser) return res.status(400).json({error:true,msg:"username doesn't exist"})

         await User.updateOne({username:onlineUser},{$set:{online: req.app.locals.online}})   
         let Updated=await User.findOne({username:onlineUser})
         res.status(200).json({succes:true,masg:"user offline",data:Updated,token:generalTokn(Updated._id)}) 
    }
    catch{
        res.status(501).json({error:true,msg:"Error occured while romaining"})
     }
})

///make user offline

router.put("/offlineUsers/:offlineUser",localVariable,async(req,res)=>{
    let {offlineUser}=req.params
    try{
         let findUser=await User.findOne({username:offlineUser})
         if(!findUser) return res.status(400).json({error:true,msg:"username doesn't exist"})
         req.app.locals.online=false
         await User.updateOne({username:offlineUser},{$set:{online: req.app.locals.online}})   
         let Updated=await User.findOne({username:offlineUser})
         res.status(200).json({succes:true,msg:"use Online",data:Updated,token:generalTokn(Updated._id)}) 
    }
    catch{
        
        res.status(501).json({error:true,msg:"Error occured while romaining"})
     }
})

///get online User
router.get("/onlineUSer",async(req,res)=>{
    try{
         let findUser=await User.findOne({online:true})
         let {username,bulloName,profilePicture,logged,coverPicture,
            online,followings,followers,story,city,from,relationship}=findUser
        if(findUser){
            res.status(200).json({succes:true,
                data:{
                username:username,
                bulloName:bulloName,
                profilePicture:profilePicture,
                logged:logged,
                coverPicture:coverPicture,
                online:online,
                followings:followings,
                followers:followers,
                story:story,
                city:city,
                from:from,
                relationship:relationship},
                token:generalTokn(findUser._id)

            })
         }
       else res.status(404).json({error:true,msg:"user not"}) 
  }
    catch{
        res.status(501).json({error:error,msg:"Error occured while romaining"})
     }
})
router.get("/generateOTP",localVariable,async (req,res)=>{
    //try {      
        // check the user existance
        req.app.locals.OTP = await otpGeenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
        res.status(200).json({code: req.app.locals.OTP})

    //} catch (error) {return res.status(404).json({ error:"network Error",er:error});}
})

//to verify the generatedOTP
router.get("/verifyOTP/:code",async (req,res)=>{
    const { code } =req.params
 try{
     if(parseInt(req.app.locals.OTP) === parseInt(code)){
         req.app.locals.OTP = null; // reset the OTP value
         req.app.locals.resetSession = true; // start session for reset password
         return res.status(200).json({success:req.app.locals.resetSession, msg:'Verify Successsfully!'})
     }
     return res.status(400).json({ error: "Invalid OTP, try again!!!",code:code})
 }
 catch(error){
    return res.status(404).json({ error:"network Error, try again!!"});

 }
    
})


////////////put

//** modify email username and bulloname

router.put("/updateUserProfile/:username",protect,async(req,res)=>{
  let {username,email,password}=req.body
  let usernameParam=req.params.username
  let myAccount=await User.findOne({username:usernameParam})
 if(myAccount){
          let otherUserExists=await User.findOne({username:username})
          if(otherUserExists){
                if(otherUserExists.username===myAccount.username&&otherUserExists.email===myAccount.email){
                        await User.updateOne({username:usernameParam},{$set:req.body})
                        if(password){
                                let saltRounds=10
                                const salt = bcrypt.genSaltSync(saltRounds);
                                const hashedPassword = bcrypt.hashSync(password, salt);
                                await User.updateOne({username:usernameParam},{$set:{password:hashedPassword}})
                        }
                        let updatedUser=await User.findOne({username:usernameParam})
                        return res.status(200).json({success:true,msg:"user Credentials updated successfully successfully",token:generalTokn(updatedUser._id),data:updatedUser})
                }
                else if(otherUserExists.username!==myAccount.username&&otherUserExists.email===myAccount.email){
                    return res.status(401).json({success:false,msg:"this username is already tokken"})
                }
                else if(otherUserExists.username===myAccount.username&&otherUserExists.email!==myAccount.email){
                    return res.status(401).json({success:false,msg:"this email is already tokken"})
                }
                else{
                    return  res.status(401).json({success:false,msg:"this username and email are already tokken"})
                }
            }
         else{
                await User.updateOne({username:usernameParam},{$set:req.body})
                if(password){
                        let saltRounds=10
                        const salt = bcrypt.genSaltSync(saltRounds);
                        const hashedPassword = bcrypt.hashSync(password, salt);
                        await User.updateOne({username:usernameParam},{$set:{password:hashedPassword}})
                 }
                let updatedUser=await User.findOne({username:username})
                return res.status(200).json({success:true,msg:"user Credentials updated successfully successfully",token:generalTokn(updatedUser._id),data:updatedUser})
         }

      }
      else{
        return  res.status(401).json({success:false,msg:"user not found"})
      }

})

///////modify profile picture

router.put("/updateProfilePicture/:username",protect,async(req,res)=>{
    let {username}=req.params
    let {profilePicture,coverPicture}=req.body
    let user=User.find({username:username})
    try{
        if(user){
            if(profilePicture){
                await User.updateOne({username:username},{$push:{profilePicture:profilePicture}})
                await User.updateOne({username:username},{$set:{coverPicture:coverPicture}})
                let updatedUser=await User.findOne({username:username})
                return res.status(200).json({success:true,msg:"succesfuly Updated",token:generalTokn(updatedUser._id),data:updatedUser})
            }
            else{
                await User.updateOne({username:username},{$set:{coverPicture:coverPicture}})
                let updatedUser=await User.findOne({username:username})
                return res.status(200).json({success:true,msg:"succesfuly Updated",token:generalTokn(updatedUser._id),data:updatedUser})
            }
        
         
        }
        else{
            res.status(404).json({status:false,msg:"username not found"})
        }
    }
    catch{
       res.status(500).json({error:true,msg:"error occured while romaining"})
    }
})                                                                                               



/////////////////////delete
router.delete("/deleteUSer/:username",protect,async(req,res)=>{
     let {username}=req.params
    try{
        let userExist=await User.findOne({username:username})
        if(userExist){
            let deleteUser=await User.deleteOne({username:username})
            if(!deleteUser) return  res.status(401).json({success:false,msg:"unable to delete user ue to systematic error"})
            req.app.locals.User=null
            usercur=null
            res.status(200).json({success:true,msg:`user ${username} successfully deleted`})
        }
        else{
            return  res.status(401).json({success:false,msg:"unable to delete user bcz it doesnt exist"})
        }
    }
    catch{
        res.status(200).json({success:false,msg:"error occured while deleting"})

    }
})

/////get what you are following

router.get("/following/:username",async(req,res)=>{
    let {username}=req.params
    let user=await User.findOne({username:username})
   
 try{
    const followings = await Promise.all(
            user.followings.map((friend) => {
            return User.find({username:friend});
        })
      );
    let followingsList=[]
    followings.map(each=>each.map(e=>{
        let {username,bulloName,profilePicture,_id,logged,coverPicture,
            online,followings,followers,story,city,from,relationship
        }=e
        followingsList.push({username,bulloName,profilePicture,logged,coverPicture,
            online,followings,followers,story,city,from,relationship})
    }))
    res.status(200).json(followingsList)
  }
  catch{
    res.status(404).json({error:true,msg:"error occured while geting freinds"})
  }

})

//get ur followers

router.get("/followers/:username",async(req,res)=>{
    let {username}=req.params
    let user=await User.findOne({username:username})
 if(user){
     try{
        const followings = await Promise.all(
                user.followers.map((friend) => {
                return User.find({username:friend});
            })
          );
        let followerList=[]
        followings.map(each=>each.map(e=>{
            let {username,bulloName,profilePicture,_id,logged,coverPicture,
                online,followings,followers,story,city,from,relationship
                }=e
            followerList.push({username,bulloName,profilePicture,logged,coverPicture,
                online,followings,followers,story,city,from,relationship})
        }))
        res.status(200).json(followerList)
      }
      catch{
        res.status(404).json({error:true,msg:"error occured while geting freinds"})
      }
 }
 else{
    res.status(404).json({error:true,msg:"user not found"})
 }

})

////follow a user

router.put("/follow/:usernameToFollow",async(req,res)=>{
    let {usernameToFollow}=req.params
    let {username}=req.body
  if(username!==usernameToFollow){
     let user=await User.findOne({username:username})
     let remteuser= await User.findOne({username:usernameToFollow})
    if(user&&remteuser){
        try{
            if(!user.followings.includes(usernameToFollow)){
                await User.updateOne({username:username},{$push:{followings:{$each:[usernameToFollow]}}})
                await User.updateOne({username:usernameToFollow},{$push:{followers:{$each:[username]}}})
                let updatedUser=await User.findOne({username:username})
                //let updatedRemoteUser=await User.findOne({username:usernameToFollow})
           
                res.status(200).json({success:true,msg:"followed successfully",token:generalTokn(updatedUser._id),data:updatedUser})
            }
            else{
               res.status(404).json({success:false,msg:"You are already following this user"})
            }
   
          }
        catch{
           res.status(404).json({error:true,msg:"error occured while following"})
        }
     }
     else{
           return  res.status(404).json({msg:"user not found"})
      }
  }
  else{
    res.status(404).json({msg:"same user"})
  }



})

//unfolow user

router.put("/unfollow/:usernameToFollow",async(req,res)=>{
    let {usernameToFollow}=req.params
    let {username}=req.body
  if(username!==usernameToFollow){
     let user=await User.findOne({username:username})
     let remteuser=await User.findOne({username:usernameToFollow})
    if(user&&remteuser){
        try{
            if(user.followings.includes(usernameToFollow)){
                await User.updateOne({username:username},{$pull:{followings:usernameToFollow}})
                await User.updateOne({username:usernameToFollow},{$pull:{followers:username}})
                let updatedUser=await User.findOne({username:username})
                //let updatedRemoteUser=await User.findOne({username:usernameToFollow})
           
                res.status(200).json({success:true,msg:"unfollow  successfully",token:generalTokn(updatedUser._id),data:updatedUser})
            }
            else{
               res.status(404).json({success:false,msg:"You are not following this user"})
            }
   
        }
        catch{
           res.status(404).json({error:true,msg:"error occured while unfollowing"})
        }

    }
     else{
         res.status(404).json({msg:"user Doesn't exist"})
      }
  }
  else{
    res.status(404).json({msg:"same user"})
  }
})

//delete  followers

router.put("/deleteFollowers/:usernameToDeleteFromFollowers",protect,async(req,res)=>{
    let {usernameToDeleteFromFollowers}=req.params
    let {username}=req.body
  if(username!==usernameToDeleteFromFollowers){
     let user=await User.findOne({username:username})
     let remoteuser=await User.findOne({username:usernameToDeleteFromFollowers})
     if(user&&remoteuser){
        try{
            if(user.followers.includes(usernameToDeleteFromFollowers)){
                await User.updateOne({username:username},{$pull:{followers:usernameToDeleteFromFollowers}})
                await User.updateOne({username:usernameToDeleteFromFollowers},{$pull:{followings:username}})
                let updatedUser=await User.findOne({username:username})
                //let updatedRemoteUser=await User.findOne({username:usernameToFollow})
           
                res.status(200).json({success:true,msg:"followers deleted successfully  successfully",token:generalTokn(updatedUser._id),data:updatedUser})
            }
            else{
               res.status(404).json({success:false,msg:"You are not following this user"})
            }
   
        }
        catch{
           res.status(501).json({error:true,msg:"error occured while unfollowing"})
        }

    }
     else{
         res.status(404).json({success:false,msg:"user Doesn't exist"})
      }
  }
  else{
    res.status(404).json({success:false,msg:"same user"})
  }
})

//add memories
let storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        if(!fs.existsSync("./client/public/uploads")){
            fs.mkdir("./client/public/uploads",(error)=>{
                if(error) console.log("error while creating folder");
                else console.log("folder created");
            })
        }
        callback(null,"./client/public/uploads")
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname)
    }
})

const upload = multer({ storage: storage })
router.put("/addMemories",upload.array('img',20),async(req,res)=>{
    let {username}=req.body
    let user=await User.findOne({username:username}) 
    let currentDate=new Date()
    if(user){
        try{
             if(req.files){
                   let newMemories={
                        memoryID:randomUUID(),
                        article:req.body?.article,
                        img:req.files,
                        uploadedDate:currentDate,
                        shareWithOthers:req.body.share
                   }
                    await User.updateOne({username:username},{$push:{memories:newMemories}})
                    let updatedMemo=await User.findOne({username:username}) 
                    if(updatedMemo) res.status(200).json({success:true,msg:"New memory added successfully!!",userMemories:updatedMemo.memories})
                    else res.status(401).json({success:false,msg:"error occured"})
                }
                else{
                    let newMemories={
                        memoryID:randomUUID(),
                        article:req.body?.article,
                        img:[],
                        uploadedDate:currentDate,
                        updatedDate:currentDate,
                        share:req.body.share
                   }
                    await User.updateOne({username:username},{$push:{memories:newMemories}})
                    let updatedMemo=await User.findOne({username:username}) 
                    if(updatedMemo) res.status(200).json({success:true,msg:"New memory added successfully!!",userMemories:updatedMemo.memories})
                    else res.status(401).json({success:false,msg:"error occured"})
                }
            }
            catch(error){
                res.status(501).json({error:true,msg:"Eror occured while creating yor post"})
            }
    }
    else{
        res.status(404).json({success:false,msg:"User Not Found"})
    }
})

///get memories of user
router.get("/memories",async(req,res)=>{
    let {currentUserName,remoteUserName}=req.query
    let currentUser=await User.findOne({username:currentUserName})
    let remoteUser=await User.findOne({username:remoteUserName})
    if(currentUser&&remoteUser){
        let remoteuserMemories=remoteUser.memories
        if(remoteuserMemories.length>0){
            if(currentUserName!==remoteUserName){
                let memoriesUserWantToShare=remoteuserMemories.filter(memo=>{
                    return memo.shareWithOthers==="true"
                   })
                   res.status(200).json({success:true,data:memoriesUserWantToShare})
              }
              else res.status(200).json({success:true,data:remoteuserMemories})
           
        } 
        else res.status(200).json({success:true,msg:"no available memories",data:[]})
     }
    else res.status(404).json({success:false,msg:"users not found"})
})

//update sharing
router.put("/memmemories/share/:memoryID",protect,async (req,res)=>{
    let {memoryID}=req.params
    let {username,share}=req.body
    let user=await User.findOne({username:username}) 
    let currentDate=new Date()
    if(user){
        try{
            let memoryExist=user.memories.filter(memo=>{
                return memo.memoryID===memoryID
            })
            if(memoryExist.length>0){
                await User.updateOne({username:username},{$pull:{memories:memoryExist[0]}})
                let newMemories={
                    memoryID:memoryExist[0].memoryID,
                    article:memoryExist[0].article,
                    img:memoryExist[0].img,
                    uploadedDate:memoryExist[0].uploadedDate,
                    shareWithOthers:JSON.stringify(share),
                    updatedDate:currentDate}
                await User.updateOne({username:username},{$push:{memories:newMemories}})
                let newUserMemories=await User.findOne({username:username})
                
                res.status(200).json({success:true,msg:"successfully updated ",data:newUserMemories.memories})
             }
             else res.status(200).json({success:true,msg:"user doesn't has such memory",data:[]})
        }
        catch{
            res.status(404).json({error:true,msg:"Error occured while romaining"})
        }
    }
    else res.status(404).json({succes:false,msg:"user not found"})
})

//delete memories
router.delete("/memmemories/delete/:memoryID",async(req,res)=>{
    let {memoryID}=req.params
    let {username}=req.query
    let user=await User.findOne({username:username}) 
    if(user){
       try{
            let memoryExist=user.memories.filter(memo=>{
                return memo.memoryID===memoryID
            })
             if(memoryExist.length>0){
                await User.updateOne({username:username},{$pull:{memories:memoryExist[0]}})
                let newUserMemories=await User.findOne({username:username})
                res.status(200).json({success:true,msg:"successfully deleted ",data:newUserMemories.memories})
             }
             else res.status(200).json({success:true,msg:"user doesn't has such memory",data:[]})
        }
          catch{
            res.status(404).json({error:true,msg:"Error occured while romaining"})
        }
    }
    else res.status(404).json({succes:false,msg:"user not found"})

})

//update DarkMode
router.put("/darkmode/:username",async (req,res)=>{
    let {username}=req.params
    let {darkmode}=req.body
    let user=await User.findOne({username:username})
    if(user){
        let mode=JSON.stringify(darkmode)
         let dt= await User.updateOne({username:username},{$set:{darkmode:darkmode}})
         let updatedUser=await User.findOne({username:username})
         res.status(200).json({succes:true,msg:"sucessfully darked mode",data:updatedUser.darkmode,dt:dt,token:generalTokn(updatedUser._id)})
     
    }
    else res.status(404).json({success:false,msg:"user not found"})
})

//get all shared memories
router.get("/getAllMemories",async(req,res)=>{
   let allUsers=await User.find()
   
      let usersEssentialData=[]
      allUsers.map(e=>{
            if(e?.memories?.length>0){
                let {username,profilePicture,bulloName,memories,createdAt,updatedAt}=e
                let filtterdShareUser=memories.filter(e=>{
                    return e.shareWithOthers==="true"
                })
              //  console.log("filtterdShareUser",filtterdShareUser );
                if(filtterdShareUser.length>0){
                    memories=filtterdShareUser
                    usersEssentialData.push({username,bulloName,profilePicture,memories,createdAt,updatedAt})
                }
            }
      })
      let filtterdShareUser=usersEssentialData.map(each=>each.memories.filter(e=>{
        return e.shareWithOthers==="true"
      })).length
      res.status(200).json({success:true,data:usersEssentialData,msg:"all Users Data"})
   
  
})

module.exports=router