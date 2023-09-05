let express=require("express")
let router=express.Router()
let Message=require('../model/chat-model/messageModel')
let Chat=require('../model/chat-model/chatModel')
let User=require('../model/userModel')
let {protect}=require("../middleware/userMiddleWare")
const { randomUUID } = require('crypto');
const { log } = require("console")

//creacteMessage
router.post("/createMessage",async (req,res)=>{
    let {chatId,content,currentUserId}=req.body
    if(!chatId || !content,!currentUserId){
        return res.status(404).send({success:false,msg:"some thing missed"})
    }
    let chat=await Chat.findById({_id:chatId})
    if(Chat.isGroupChat&&!chat.users.includes(currentUserId)){
        return res.status(404).send({success:false,msg:"you are not allowed to this chat"})
    }
    try{
        let newChat={
            sender:currentUserId,
            content:content,
            chat:chatId
        }
        let message=(await (await Message.create(newChat)).populate("sender","username profilePicture")).populate("chat")
         message = await User.populate(message, {
            path: "chat.users",
            select: "username profilePicture bulloName",
          });
        await Chat.findByIdAndUpdate(chatId,{latestMeessage:message})
        res.status(200).send({success:true,msg:"new message created",data:message})
    }
    catch{
        res.status(501).send({error:true,msg:"error occure while romaining"})
    }
    }

)
 
//fetch each message
router.get("/getChatMessage/:chatId",async (req,res)=>{
    let {chatId}=req.params
  
    if(chatId){
       try{ 
             let chatExists=await Chat.findById(chatId)
             if(chatExists) {
                 let findMessage=await Message.find({chat:chatId})
                 if(findMessage){
                     findMessage=await Message.find({chat:chatId})
                                         .populate("sender","username profilePicture bulloName online")
                                         .populate("chat");
                    res.status(200).send({success:true,data:findMessage,msg:`this message is displaying ${findMessage?.chat?.chatName}`}) 
                }
                 else res.status(404).send({success:true,msg:"no message yet",data:[]})

             }
             else res.status(404).send({success:false,msg:"chat doesn't exist ",data:[]})
         }
       catch{
            res.status(501).send({error:true,msg:"error occure while romaining"})
        }
    }
    else res.status(404).send({success:false,msg:"messageId not found"})
})

router.delete("/deletemessage/:messageId",async (req,res)=>{
    let {messageId}=req.params
    if(messageId){
        try{
            let message=await Message.findOne({_id:messageId}).populate("chat")
            console.log(message);
            await Message.deleteOne({_id:messageId})
            res.status(200).send({success:true,msg:`message on ${message?.chat?.chatName} successfuly deleted`})
        }
        catch{
            res.status(501).send({error:true,msg:"error occure while romaining"})
        }
    }
    else res.status(404).send({success:false,msg:"sorry, message does not exist"})
})




module.exports=router