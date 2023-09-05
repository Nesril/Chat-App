const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    logged: {
        type: Boolean,
        default:false
      },
    online: {
        type: Boolean,
        default:false
      },
      showOnlineStatus:{
         type:Boolean,
         default:false
      }, 
    bulloName:{
        type: String,
        max:10,
        default:""
    },
    profilePicture: {
      type: Array,
      default: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDlSofz66Ndxy9xOxSa6O-4BD4nDZzT2zqMA&usqp=CAU"],
    },
    coverPicture: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR3Qg5I6MVgrW5YhEavPzNzyAjwDXgnvsd0Q&usqp=CAU",
    },
    saved:{
      type:Array,
      default:[]
    },
    memories:{
      type:Array,
      default:[]
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      default: "no",
    },
    desc: {
      type: String,
      max: 50,
      default:""
    },
    liveIn: {
      type: String,
      max: 50,
      default:"uknown"
    },
    from: {
      type: String,
      max: 50,
      default:"uknown"
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    darkmode: {
      type: String,
      default:"false"
    },
    isPremium: { 
      type: Boolean,
      default:false
  },
  isBanned: { 
    type: Boolean,
    default:false
  },
  isActive: { 
    type: Boolean,
    default:false
 },
 isDeleted: { 
  type: Boolean,
  default:false
 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);