let mongoose=require("mongoose")
require("dotenv").config()
let connectDB=()=>{
    mongoose.set({"strictQuery":true})
    mongoose
      .connect(process.env.DB_URL)
      .then(()=>console.log("Connected to Database"))
      .catch((error)=>console.log("Failed to connect Database ",error))
}

module.exports=connectDB