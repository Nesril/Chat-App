let nodemailer=require("nodemailer")
let transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
     user:process.env.NODEMAILER_EMAIL,
     pass:process.env.NODEMAILER_PASSWORD
    }
})

let mailOption={
    from:"nesredinhaji111@gmail.com",
    to:"nesredinhaji715@gmail.com",
    subject:"Node JS Email",
    text:"test email"
}

transporter.sendMail(mailOption,(err,info)=>{
    if(err){
        console.log("unable to send", err);
    }
    else{
        console.log("Successfully sent", info.response);
    }
})