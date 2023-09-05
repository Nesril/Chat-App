const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required:true
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
    desc: {
      type: String,
      max: 3500,
    },
    location:{
      type: String,
      default:""
    },
    img: {
      type: Array,
      default:[]
    },
    video:{
      type: String,
      default:""
    },
    likes: {
      type: Array,
      default: [],
    },
    comments:{
      type:Array,
      default:[]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);