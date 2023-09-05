let express=require("express")
let router=express.Router()
let Chat=require('../model/chat-model/chatModel')
let User=require('../model/userModel')
let {protect}=require("../middleware/userMiddleWare")
const { randomUUID } = require('crypto');
const { log } = require("console")
//creaing individual chat
router.post("/createChat",async (req,res)=>{
    let {RemoteUserId,currentUserId}=req.body
  //  try{
            let remoteUser=await User.findOne({_id:RemoteUserId})
            let currentUser=await User.findOne({_id:currentUserId})
            if(remoteUser&&currentUser){
                let chatExist=await Chat.find({
                    isGroupChat:false,
                    users:{$elemMatch:{$eq:currentUser,$eq:remoteUser}}
                    })
                    .populate("users","-password")//with out this you just get the objectId of the chatCreater
                        //but populate() gives all documents of that user that placed in userModel
                    .populate("latestMeessage")
                
                chatExist=await User.populate(chatExist,{
                    path:"latestMeessage.sender",
                    select:"username profilePicture bulloName desc city relationship darkmode"
                })
                
                console.log(chatExist);
                if(chatExist.length>0) res.send([chatExist[0]])
                else{
                    let newChat={
                            chatName:"sender",
                            isGroupChat:false,
                            users:[RemoteUserId,currentUserId]
                        }

                            let creatNewChat=await Chat.create(newChat)
                            let findChat=await Chat.findOne({_id:creatNewChat._id})
                                         .populate("users","-password")
                                         .populate("latestMeessage")
                                          
                            res.status(200).send({success:true,data:findChat})
                }
            }
            else res.status(401).send({success:false,msg:"user  not found"})
    /*   }
      catch(error){
        res.status(501).send({error:true,msg:"error occured while romaininig"})
      }*/
        })

//get user chat
router.get("/getUserChat/:userId",async (req,res)=>{
    let {userId}=req.params
    let user=await User.findOne({_id:userId})
    if(user){
        try{
            let userChat=await Chat.find({users:{$elemMatch:{$eq:userId}}})
             .populate("users")
             .populate("latestMeessage")
             .populate("groupAdmins","-password")
             .sort({ updatedAt: -1 });
             userChat = await User.populate(userChat, {
              path: "latestMessage.sender",
              select:"username profilePicture bulloName desc city relationship darkmode"
            });
            res.status(200).send({success:true,data:userChat})
        }
        catch(error){
            console.log(error);
            res.status(501).send({error:true,msg:"error occured while romaininig"})
        }

    }
    else res.status(401).send({success:false,msg:"user  not found"})
})
 
//get users of single chat

router.get("/getAllUsersOfSingleCha",async(req,res)=>{
    let {chatId,currentUserId}=req.query
    if(!chatId||!currentUserId) return res.status(401).send({success:false,msg:"please,fill the fields"})
    try{
      let chat=await Chat.findById(chatId)
                     .populate("users","-password")
      let user=await User.findById(currentUserId)
      if(!chat&&!user) return res.status(401).send({success:false,msg:"user or chat not found"})
      let chatUsers=chat.users
      if(chat.isGroupChat){
        res.status(200).send({success:true,data:chatUsers,chatProfile:true})
      }
      else{
        let chatUser=chatUsers.filter(e=>{
            return JSON.stringify(e._id)!==JSON.stringify(currentUserId)
          })
          res.status(200).send({success:true,data:chatUser[0],chatProfile:false})
      }
   
    }
    catch{
        res.status(501).send({error:true,msg:"error occured while romaininig",})
    }
})

//delete UserChat
router.delete("/deleteUserChat/:chatId",async (req,res)=>{
    let {chatId}=req.params
    let chat=await Chat.findOne({_id:chatId})
    if(chat){
        try{
            console.log(chat);
            await Chat.deleteOne({_id:chatId})
            let ChatsLeft=await Chat.find()
            res.status(200).send({success:true,msg:`chat ${chat.chatName} is successfullyDeleted`,data:ChatsLeft})
        }
        catch(error){
            res.status(501).send({error:true,msg:"error occured while romaininig"})
        }
    }
    else res.status(401).send({success:false,msg:"user  not found"})
})

//creategroup chat
router.post("/creategroupChat",async (req,res)=>{
    let {name,users,currentUserId}=req.body
    if(!currentUserId||!name||users?.length<1) return res.status(404).send({success:false,msg:"fill the fields"})

    if(!users?.includes(currentUserId)) users.push(currentUserId)
    try{
        let createGroup=await Chat.create({
            chatName:name,
            isGroupChat:true,
            users:users,
            groupAdmins:currentUserId
        })
        const fullGroupChat = await Chat.findOne({ _id: createGroup._id })
        .populate("users", "-password")
        .populate("groupAdmins", "-password");
  
        res.status(200).json(fullGroupChat);
    }
    catch{
        res.status(501).send({error:true,msg:"error occured while romaininig"})
    }
})

//get single group
router.get("/getGroupChat/:groupName",async (req,res)=>{
    let {groupName}=req.params
    try{
            let group=await Chat.find({chatName:groupName,isGroupChat:true})
                        .populate("users", "-password")
                        .populate("groupAdmins", "-password");
            if(group) res.status(200).send({success:true,data:group})
            else res.status(401).send({success:false,msg:"group not found"})
    }
    catch(error){
        res.status(501).send({error:true,msg:"error occured while romaininig"})
    }
})

//rename groupName
router.put("/RenameGetGroupChat",async (req,res)=>{
    let {groupName,groupId}=req.query
    try{
            let group=await Chat.findOne({_id:groupId})
            if(group) {
                await Chat.updateOne({_id:groupId},{chatName:groupName})
                group=await Chat.findOne({_id:groupId})
                            .populate("users", "-password")
                            .populate("groupAdmins", "-password");
                res.status(200).send({success:true,data:group,msg:"Successfully updated"})
            }
            else res.status(401).send({success:false,msg:"group not found"})
    }
    catch(error){
        res.status(501).send({error:true,msg:"error occured while romaininig"})
    }
})

//add to group
router.put("/AddToGroupChat",async (req,res)=>{
    let {userId,groupId}=req.query
    try{ 
        let user=await User.findOne({_id:userId})
        let group=await Chat.findOne({_id:groupId})
         if(!user||!group) return res.status(404).send({success:false,msg:"user  or group not found"})
         
         if(group.users.includes(userId)){
            group=await Chat.findOne({_id:groupId})
                            .populate("users", "-password")
                            .populate("groupAdmins", "-password");
             res.status(200).send({success:true,msg:"user exists",alreadyAdded:true,data:group})
         }
         else{
             await Chat.updateOne({_id:groupId},{$push:{users:userId}})
             group=await Chat.findOne({_id:groupId})
                         .populate("users", "-password")
                         .populate("groupAdmins", "-password");
             res.status(200).send({success:true,data:group,msg:"Successfully Added"})
         }
    }
    catch(error){
        res.status(501).send({error:true,msg:"error occured while romaininig"})
    }
})

//remove from group
router.put("/RemoveFromGroupChat",async (req,res)=>{
    let {userId,groupId}=req.query
    let user=await User.findOne({_id:userId})
    let group=await Chat.findOne({_id:groupId})
    if(!user||!group) return res.status(404).send({success:false,msg:"user  or group not found"})
    try{ 
         if(!group.users.includes(userId)){
            group=await Chat.findOne({_id:groupId})
                            .populate("users", "-password")
                            .populate("groupAdmins", "-password");
             res.status(200).send({success:true,data:group,msg:"user already doesn'texists"})
         }
         else{
             await Chat.updateOne({_id:groupId},{$pull:{users:userId}})
             group=await Chat.findOne({_id:groupId})
                         .populate("users", "-password")
                         .populate("groupAdmins", "-password");
             res.status(200).send({success:true,data:group,msg:"Successfully removed"})
         }
    }
    catch(error){
        res.status(501).send({error:true,msg:"error occured while romaininig"})
    }
})
module.exports=router