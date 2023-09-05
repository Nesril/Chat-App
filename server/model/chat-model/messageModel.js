const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type:String,
        trim:true
    },
    images:{
        type:Array,
        default:[]
    },
    videos:{
        type:Array,
        default:[]
    },
     files:{
        type:Array,
        default:[]
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
    },
    readBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        seenCount:0
    }],
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        comentedBy:"user",
        commentContent:[]
    }]


},
  {timestamps:true}
)

module.exports = mongoose.model("Message",messageSchema );