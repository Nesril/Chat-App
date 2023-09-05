const { Router } = require("express")
let express=require("express")
let postRouter=express.Router()
let Post=require("../model/postModel")
let User=require("../model/userModel")
const multer  = require('multer')
let {protect}=require("../middleware/userMiddleWare")
const { randomUUID } = require('crypto');
let fs=require("fs")

///neeeds protect
//get all post
postRouter.get("/",async(req,res)=>{
     let userPost=await Post.find() 
     try{  
          res.status(200).json({success:true,data:userPost})
      }
      catch(error){
          console.log(error);
        res.status(404).json({error:true,msg:"Eror occured while all post"})
      }
  


 })

 //get user post
postRouter.get("/:username",async(req,res)=>{
    let {username}=req.params
    
    let userPost=await Post.find({username:username}) 
    let user=await User.findOne({username:username})
    console.log(user);

    if(user){
        try{  
            if(!userPost) return  res.status(200).json({success:true,data:[],msg:"no user post"})
             let {profilePicture,logged,online}=user
             let UserData={username:username,profilePicture:profilePicture,logged:logged,online:online}
             res.status(200).json({success:true,data:userPost,user:UserData})
         }
         catch(error){
             console.log(error);
           res.status(404).json({error:true,msg:"Eror occured while user post"})
         }
    
    }
    else{
        res.status(404).json({success:false,msg:"user not found"})
    }
   
})
//get each post
postRouter.get("/userPost/:id",async(req,res)=>{
    let {id}=req.params
    let userPost=await Post.findOne({_id:id}) 
    try{  
        if(!userPost) return  res.status(200).json({success:false,data:userPost,msg:"no user post"})
         res.status(200).json({success:true,data:userPost})
     }
     catch(error){
         console.log(error);
       res.status(404).json({error:true,msg:"Eror occured while geting user post"})
     }

})

//create post
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
postRouter.post("/:username",upload.array('img',20),async(req,res)=>{
    let {username}=req.body
    console.log(req,req.files);
    let user=await User.findOne({username:username}) 
    if(user){
        try{
         let {username,bulloName,profilePicture,logged,online}=user
         let UserData={username:username,bulloName:bulloName,profilePicture:profilePicture,logged:logged,online:online}
            if(req.files){
                let post=await Post.create({
                    desc:req.body?.desc,
                    img:req.files,
                    username:username,
                })
                if(post){
                   res.status(200).json({success:true,msg:"New Post added successful!!",data:post,user:UserData})
                }
                else res.status(401).json({msg:"error occured"})
            }
            else{
                let post=await Post.create({
                    username:username,
                    desc:req.body?.desc,
                })
                if(post){
                res.status(200).json({msg:"successful!!",data:post,user:UserData})
                }
                else res.status(401).json({msg:"error occured"})
           }
        }
        catch(error){
            console.log(error);
             res.status(501).json({error:true,msg:"Eror occured while creating yor post"})
        }
    }
    else{
        res.status(404).json({error:true,msg:"User Not Found"})
    }
})

//update post
//needs protect
postRouter.put("/updatePost",async(req,res)=>{
    let Currentusername=req.body.username
    let {likes}=req.body
    let {id}=req.body
    let {img}=req.body
    
    let user=await Post.findOne({_id:id}) 
    if(user){
       try{
         if(likes){
            let userWhoLikesForYou=await User.findOne({username:likes})
            if(userWhoLikesForYou){
                let {username,bulloName,profilePicture}=userWhoLikesForYou
                console.log(user.likes.map(e=>e.username).includes(username));
                if(!user.likes.map(e=>e.username).includes(username)) await Post.updateOne({_id:id},{$push:{likes:{$each:[{username:username,bulloName:bulloName,profilePicture:profilePicture}]}}})
                else await Post.updateOne({_id:id},{$pull:{likes:{username:username,bulloName:bulloName,profilePicture:profilePicture}}})
                delete req.body.likes
                await Post.updateOne({username:id},{$set:req.body})
                let findUpdatePost=await Post.findOne({_id:id})
                res.status(200).json({success:true,data:findUpdatePost})
                    
            }
            else{
                delete req.body.likes
                await Post.updateOne({username:id},{$set:req.body})                
                let findUpdatePost=await Post.findOne({_id:id})
                res.status(200).json({success:true,data:findUpdatePost})
            }
         }
         else{
            await Post.updateOne({username:id},{$set:req.body})
            let findUpdatePost=await Post.findOne({_id:id})
            res.status(200).json({success:true,data:findUpdatePost})         }
        

        }
        catch(error){
            console.log(error);
          res.status(404).json({error:true,msg:"Eror occured while creating yor post"})
        }
    }
    else{
        res.status(404).json({error:true,msg:"User Not Found"})
    }
})

//delete post
///needs token
postRouter.delete("/deletePost/:id",async(req,res)=>{
    let {id}=req.params
    let user=await Post.findOne({_id:id})
    console.log(user);
    if(user){
         try{
             await Post.deleteOne({_id:id})
             return res.status(200).json({success:true,msg:`Dear ${user.username}, your Post is successfully deleted`})
          }
          catch{
            res.status(501).json({error:true,msg:"unable to delete this post"})

          }
    }
    else{
        res.status(404).json({error:true,msg:"Can't find this post"})

    }
    
})
///get time line  posts of what you are flowing

postRouter.get("/post/following/:username",protect,async(req,res)=>{
     let {username}=req.params
     let findUser=await User.findOne({username:username})
     const friendPosts = await Promise.all(
        findUser.followings.map((usernam) => {
          return Post.find({ username: usernam });
        })
    )
    console.log(findUser);
     res.status(200).json({success:true,msg:"test",data:friendPosts})
})

//like unlike post
postRouter.put("/like/:postId",protect,async (req,res)=>{
    let userGiveLike=req.body.username
    let {postId}=req.params
    let userPost=await Post.findOne({_id:postId})
    let userLikesPost=await User.findOne({username:userGiveLike})
    console.log(userPost.likes);
    try{
        if(userPost&&userLikesPost){
              let {username,profilePicture,online,logged}=userLikesPost
              let userGivesLikeData={
                        username:username,
                        profilePicture:profilePicture,
                        online:online,
                        logged:logged
                    }
              console.log(userPost.likes.filter(e => e.username ===username).length > 0);
              if(userPost.likes.filter(e => e.username ===username).length > 0){
                await Post.updateOne({_id:postId},{$pull:{likes:userGivesLikeData}})
                let unlikedPost=await Post.findOne({_id:postId})
                res.status(200).json({msg:"Successfuly unliked",success:true,data:unlikedPost,liked:false})
              }
              else{
                await Post.updateOne({_id:postId},{$push:{likes:userGivesLikeData}})
                let likedPost=await Post.findOne({_id:postId})
                res.status(200).json({msg:"Successfuly liked",success:true,data:likedPost,liked:true})
              }  
         }
        else if(!userLikesPost) res.status(404).json({success:false,msg:"user not found"})
            
        else if(!userPost)  res.status(404).json({success:false,msg:"post not found"})
        
        else  res.status(404).json({success:false,msg:"user not found and post not found"})
         
    }
    catch{
        res.status(501).json({error:true,msg:"error occured while romaining"})
    }
    
})

///get likes of posts

postRouter.get("/like/:postId",async (req,res)=>{
    let {postId}=req.params
    try{
        let posts=await Post.findOne({_id:postId})
        if(posts) res.status(200).json({success:true,data:posts.likes})
        else res.status(400).json({success:false,msg:"Can't found post"})
    }
    catch{
        res.status(501).json({error:true,msg:"error occured while romaining"})
    }
})


//put comments
postRouter.put("/comment/:postId",async (req,res)=>{
    let {postId}=req.params
    let {username,comment,image}=req.body
    let post=await Post.findOne({_id:postId})
    let userCommentOnPost=await User.findOne({username:username})
    let date_ob = new Date();

    if(post){
      try{
         if(userCommentOnPost){
                 let {username,profilePicture,online,logged}=userCommentOnPost
                let userGivesComment={
                    username:username,
                    profilePicture:profilePicture,
                    online:online,
                    logged:logged
                }

                let comentSection={
                    comment:comment,
                    image:image
                }

                let newComents={
                    user:userGivesComment,
                    comment:comentSection,
                    id:randomUUID(),
                    postedDate:date_ob
                }
                await Post.updateOne({_id:postId},{$push:{comments:newComents}})
                let updatedPost=await Post.findOne({_id:postId})
                res.status(200).json({success:true,msg:"Successfuly Commented",data:updatedPost,Commented:true})

         }
         else{
            res.status(404).json({success:false,msg:"user not fund"})
         }
      
      }
      catch{
        res.status(501).json({error:true,msg:"Error occured while romaining"})
      }
    }
    else{
        res.status(404).json({success:false,msg:"post not found"})
    }
})

//get comments
postRouter.get("/comment/:postId",async (req,res)=>{
    let {postId}=req.params
    try{
        let posts=await Post.findOne({_id:postId})
        if(posts) res.status(200).json({success:true,data:posts.comments})
        else res.status(400).json({success:false,msg:"Can't found post"})
    }
    catch{
        res.status(501).json({error:true,msg:"error occured while romaining"})
    }
})

postRouter.put("/deleteComment/:postId",protect,async (req,res)=>{
    let {postId}=req.params
    let commentId=req.body.id
    try{
        let posts=await Post.findOne({_id:postId})
        if(posts) {
           let filterPost=posts.comments.filter(comment=>{
            return comment.id!==commentId
           })
           console.log(filterPost,commentId);
           await Post.updateOne({_id:postId},{comments:filterPost})
           let updatedComment=await Post.findOne({_id:postId})
           res.status(200).json({success:true,data:updatedComment.comments})
        }
        else res.status(404).json({success:false,msg:"Can't found post"})
    }
    catch{
        res.status(501).json({error:true,msg:"error occured while romaining"})
    }
})

/////save post
postRouter.put("/savePost/:postId",async (req,res)=>{
    let {postId}=req.params
    let {username}=req.body
    try{
        let post=await Post.findOne({_id:postId})
        let user=await User.findOne({username:username})
        if(post&&user){
             let postAlreadySaved=user.saved.filter(data=>{
                    console.log(JSON.stringify(data._id)===JSON.stringify(post._id));
                    return JSON.stringify(data._id)===JSON.stringify(post._id)
                    }).length>0
                console.log(postAlreadySaved);
            if(postAlreadySaved){
                    await User.updateOne({username:username},{$pull:{saved:post}})
                    let updatedUser=await User.findOne({username:username})
                    res.status(200).json({success:true,saved:false,data:updatedUser})
            }
            else{
                    await User.updateOne({username:username},{$push:{saved:post}})
                    let updatedUser=await User.findOne({username:username})
                    res.status(200).json({success:true,saved:true,data:updatedUser})
                }
        }
        else{
         res.status(404).json({success:false,msg:"Can't found post or user"})
        }
    }
    catch{
        res.status(501).json({error:true,msg:"error occured while romaining"})
    }
})

//check if a Post is saved or not
postRouter.get("/checkPostIsSaved/:postId",async (req,res)=>{
       let {postId}=req.params
       let {username}=req.query
       console.log(req.query);
       console.log(username,postId);
       let user=await User.findOne({username:username})
       try{
           if(user){
               let postIsSaved=user.saved.filter(data=>{
                console.log(JSON.stringify(data._id),JSON.stringify(postId));
                return JSON.stringify(data._id)===JSON.stringify(postId)
                }).length>0
                console.log(postIsSaved);
                if(postIsSaved) res.status(200).json({success:true,saved:true})
                else res.status(200).json({success:true,saved:false})
            }
           else {
            console.log("user not found");
            res.status(404).json({success:false,msg:"user not found"})
          }
       }
       catch{
        res.status(501).json({error:true,msg:"error occured while romaining"})
       }

})

///get saved Post
postRouter.get("/savedPost/:username",async (req,res)=>{
    let {username}=req.params
   try{
       let user=await User.findOne({username:username})
       if(user) res.status(200).json({success:true,data:user.saved})
   }
   catch{
    res.status(501).json({error:true,msg:"error occured while romaining"})
  }
})



//get post
//get timeline posts (posts of what ou are followings)
//update post

module.exports=postRouter