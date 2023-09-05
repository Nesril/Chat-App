const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatName:{
        type:String,
        trim:true
    },
    chatProfilePicture:{
       type:String,
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    latestMeessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmins:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    isPinned:{
        type:Boolean,
        defaut:false
    },
    chatBackground:{
        type:String,
        default:""
    },
    favoriteChat:{
        type:Boolean,
        default:false
    }
},
  {timestamps:true}
)

module.exports = mongoose.model("Chat",chatSchema );