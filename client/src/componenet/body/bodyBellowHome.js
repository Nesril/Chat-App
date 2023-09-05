import React, { useEffect, useRef, useState } from 'react'
import VerifiedIcon from '@mui/icons-material/Verified';
import { Button, Divider, Skeleton } from '@mui/material';
import {Button as Bu} from "antd"
import {Image} from "antd"
import {  Alert,Input, Col, Row, Modal, Slider } from 'antd';
import { PlusOutlined, MinusOutlined, CloseOutlined } from '@ant-design/icons';
import { CameraOutlined } from '@ant-design/icons';
import axios from 'axios';
import AvatarEditor from 'react-avatar-editor';
import CircularProgress from '@mui/material/CircularProgress';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import CircleIcon from '@mui/icons-material/Circle';
import CommentIcon from '@mui/icons-material/Comment';
import moment from "moment"
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Fade from 'react-reveal/Fade';
import Link from 'antd/es/typography/Link';
import LightSpeed from 'react-reveal/LightSpeed';
import LinearProgress from '@mui/material/LinearProgress';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
export default function BodyBellowHome({data,userData,setData,user}) {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [removePost, setRemovePost] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const changeHandler = (e) => {
    if (!e.target.files[0]) return;
    setImage(e.target.files[0]);
    setOpenModal(true);
    setPicAsSoonAsPPChanged(true)
  };
  
  let [profChanged,setPicAsSoonAsPPChanged]=useState(false)
const editorRef = useRef();

  const handleSubmit = async() => {
    const url = editorRef.current.getImageScaledToCanvas().toDataURL();
    setOpenModal(false);
    setCommentImageValue(e=>{
      return ({
        comment:e.comment,
        image:url
      })
    })
  }
  let [commentValue,setCommentValue]=useState("")
  let [commentImageValue,setCommentImageValue]=useState({
    image:"",
    comment:""
  })
  let [ArrayOfcommentValue,setArrayOfCommentValue]=useState([])
  let [loadOnSendComments,seLoadOnSendComments]=useState(false)
useEffect(()=>{

},[commentValue])
  let CommentValueChanged=(e)=>{
    setCommentValue(e.target.value)
    
    setCommentImageValue(element=>{
      return ({
        image:element.image,
        comment:e.target.value
      })
    })
  }
  
useEffect(()=>{
    axios.get(`http://localhost:1330/bullo/posetApi/comment/${data._id}`)
    .then(response=>{
          console.log(response.data);
          seLoadOnSendComments(false)
          setArrayOfCommentValue(response.data.data);
     })
   .catch(error=>{
    seLoadOnSendComments(true)
     if (error.response) {
       console.log(error.response.data);
       console.log("server responded");
     } else if (error.request) {
       console.log("network error");
     } else {
       console.log(error);
     }
    })
  },[commentImageValue])


   let [likedPage,setLikdPage]=useState(false)
   let [loadOnlikingPage,setLoadOnlikingPage]=useState(false)
   let [commentSection,setCommentSection]=useState(true)
   function pageLiked(){
    //setLikdPage(!likedPage)
    setLoadOnlikingPage(true)
    let values={
      username:userData?.data?.username
    }
    let stringfyValue=JSON.stringify(values)
    axios.put(`http://localhost:1330/bullo/posetApi/like/${data._id}`,stringfyValue, //proxy uri
    {
      headers: {
        authorization:`Bearer ${userData.token}` ,
        'Content-Type': 'application/json'
      } 
  })
    .then(response=>{
          console.log(response.data);
          setLoadOnlikingPage(false)
          setAllLikedUsers(response.data.data.likes);
          if(response.data.liked){
            setLikdPage(true)
          }
          else{
            setLikdPage(false)
          }
     })
   .catch(error=>{
    setLoadOnlikingPage(true)
     if (error.response) {
       console.log(error.response.data);
       console.log("server responded");
     } else if (error.request) {
       console.log("network error");
     } else {
       console.log(error);
     }
    })
   }
   function commentClicked(){
    setCommentSection(!commentSection)
   }


  let sendTheComment=(id)=>{
    seLoadOnSendComments(true)
    let values={
      username:userData?.data?.username,
      comment:commentImageValue.comment,
      image:commentImageValue.image
    }
    let stringfyValue=JSON.stringify(values)
    console.log(stringfyValue);
    axios.put(`http://localhost:1330/bullo/posetApi/comment/${data._id}`,stringfyValue, //proxy uri
    {
      headers: {
        authorization:`Bearer ${userData.token}` ,
        'Content-Type': 'application/json'
      } 
    })
    .then(response=>{
          console.log(response.data);
          seLoadOnSendComments(false)
          setArrayOfCommentValue(response.data.data.comments);
          setCommentImageValue({image:"",comment:""})
          setCommentValue("")
     })
   .catch(error=>{
      seLoadOnSendComments(true)
      if (error.response) {
        console.log(error.response.data);
        console.log("server responded");
      } else if (error.request) {
        console.log("network error");
      } else {
        console.log(error);
      }
    })
  //  if(commentImageValue.image||commentImageValue.comment) setArrayOfCommentValue(element=>[...element,commentImageValue])
  }
   function deleteComent(postId,commentId){
    seLoadOnSendComments(true)
    console.log(postId,commentId);
    let commentIdToRemove={
      id:commentId
    }
    let stringfyValue=JSON.stringify(commentIdToRemove)
    axios.put(`http://localhost:1330/bullo/posetApi/deleteComment/${postId}`,stringfyValue, //proxy uri
      {
        headers: {
          authorization:`Bearer ${userData.token}` ,
          'Content-Type': 'application/json'
        } 
      })
       .then(response=>{
          console.log(response.data);
          seLoadOnSendComments(false)
          setArrayOfCommentValue(response.data.data);
        })
      .catch(error=>{
        seLoadOnSendComments(true)
        if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
        })
}
 
let postCreatedTimeFromNow=moment(data.createdAt).fromNow();

///get likes AND put
let [allLikedUsers,setAllLikedUsers]=useState([])
let [loadOnGettingLikes,setLoadOnGettingLikes]=useState(true)
useEffect(()=>{
  setLoadOnGettingLikes(true)
    axios.get(`http://localhost:1330/bullo/posetApi/like/${data._id}`)
   .then(response=>{
      //console.log(response.data);
      setLoadOnGettingLikes(false)
      setAllLikedUsers(response.data.data);
    })
  .catch(error=>{
    setLoadOnGettingLikes(true)
    if (error.response) {
      console.log(error.response.data);
      console.log("server responded");
    } else if (error.request) {
      console.log("network error");
    } else {
      console.log(error);
    }
   })

},[data.likes])

useEffect(()=>{
  // console.log(allLikedUsers.filter(e => e?.username ===userData?.data?.username).length);
    if(allLikedUsers.filter(e => e?.username ===userData?.data?.username).length > 0){
    setLikdPage(true)
    //console.log("same",userData?.data?.username);
    }
    else{
    setLikdPage(false)
    //console.log("different",userData?.data?.username);
    }
 },[allLikedUsers])


////////////////view posted images,seve and hide
let [fullScreenImage,makeImageFullScreen]=useState(false)
let [imageYouWantToMakeFullScreen,getImageYouWantToMakeFullScreen]=useState(null)
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
let [displayWhoLikesYou,getdWhoLikesYou]=useState(false)
let [postSaved,notifyWhenPostSaved]=useState(false)
let [loadWhenPosrSaved,setloadWhenPosrSaved]=useState(false)
useEffect(()=>{
      let checkIfPostSaved={
        username:userData?.data?.username
      }
      let stringfyValues=JSON.stringify(checkIfPostSaved)
     // console.log(stringfyValues,data?._id);  
       axios.get(`http://localhost:1330/bullo/posetApi/checkPostIsSaved/${data?._id}?username=${checkIfPostSaved.username}`,stringfyValues,
          {
            headers: {
              authorization:`Bearer ${userData.token}`,
              'Content-Type': 'application/json'
            } 
          })
        .then(res=>{
            setloadWhenPosrSaved(false)
       //     console.log(res.data);
            if(res.data.saved)  notifyWhenPostSaved(true)
             else  notifyWhenPostSaved(false)
          })
        .catch(error=>{
          setloadWhenPosrSaved(true)
            if (error.response) {
              console.log(error.response.data);
              console.log("server responded");
            } else if (error.request) {
              console.log("network error");
            } else {
              console.log(error);
            }
        }) 
},[userData?.data?.saved])
//console.log(loadWhenPosrSaved);
function savePost(postId){
      let commentIdToRemove={
        username:userData?.data?.username
      }
      setloadWhenPosrSaved(true)
      let stringfyValue=JSON.stringify(commentIdToRemove)
    //  console.log(stringfyValue,postId);
      axios.put(`http://localhost:1330/bullo/posetApi/savePost/${postId}`,stringfyValue,
          {
            headers: {
              authorization:`Bearer ${userData.token}` ,
              'Content-Type': 'application/json'
            } 
          })
        .then(res=>{
           // console.log(res.data);
            setloadWhenPosrSaved(false)
            if(res.data.saved)  notifyWhenPostSaved(true)
             else  notifyWhenPostSaved(false)
          })
        .catch(error=>{
          setloadWhenPosrSaved(true)
            if (error.response) {
              console.log(error.response.data);
              console.log("server responded");
            } else if (error.request) {
              console.log("network error");
            } else {
              console.log(error);
            }
        })        
}
let option =[{name:"Hide Post",id:1},{name:postSaved?"unsave post":"save post",id:2},{name:"who likes this post",id:4}]

const handleClose = (id,postId) => {
  setAnchorEl(null);
  setRemovePost(false)
  if(id===3){
    //alert("post deleted")
    axios.delete(`http://localhost:1330/bullo/posetApi/deletePost/${postId}`,{
       headers: {
        authorization:`Bearer ${userData.token}`,
        'Content-Type': 'application/json'
         } 
     })
    .then(res=>{
     // console.log(res.data);
      setRemovePost(true)
    //  getUserPosts(res.data)
    })
    .catch((error) => {
      setRemovePost(false)
        if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
        })
  }
  if(id===2){
    savePost(postId)  
  }
  if(id===1){
    alert("post hide")
  }
  if(id===4){
    getdWhoLikesYou(true)
   }

 // console.log(id);
};
const ITEM_HEIGHT = 48;
function imageClicked(){
  makeImageFullScreen(false)
}

let [postUserProfile,setPostUserProfile]=useState() 
useEffect(()=>{
 setRemovePost(false)
 axios.get(`http://localhost:1330/bullo/userApi/user/${userData?.data?.username}?otherUsers=${data.username}`)
  .then(response=>{
    setPostUserProfile(response.data)
    })
    .catch(err=>{
      console.log("errror occure while getting the one who post the post");
    })
},[data])
//console.log(userData);
return (
  <div className={`bodyBellowHome ${removePost&&"remove-bodyBellowHome-each"}`}>
     <div className={`bodyBellowHome-each`}>
        {data&&
           <>
              <div className='bodyBellowHome-each-head'>
                  <div className='bodyBellowHome-each-head-left'>
                        <div className='bodyBellowHome-each-image'><img src={postUserProfile?.data.profilePicture[postUserProfile?.data?.profilePicture.length-1]} width={50} height={50}/></div>
                        <div className='bodyBellowHome-nearImage'>
                            <div className='bodyBellowHome-head-name'>
                                        <Link href={userData?.data?.username===data.username?`/myprofile`:`/user/${data.username}`}><div className='B-H-N'>{data.username}</div></Link>  
                                        <div ><VerifiedIcon  className='B-H-V'/></div>
                            </div>
                            <div className='bodyBellowHome-head-time'>{postCreatedTimeFromNow}</div>
                        </div>
                  </div>
                 
                  <div className='bodyBellowHome-each-head-right'>
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                       <Menu
                        id="long-menu"
                        MenuListProps={{
                          'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                          },
                        }}
                      >
                        {option.map((option) => (
                          <MenuItem key={option.id} onClick={()=>handleClose(option.id,data?._id)}>
                            {option.name}
                          </MenuItem>
                        ))}
                        {userData?.data?.username===data.username&&<MenuItem key={option.id} onClick={()=>handleClose(3,data?._id)}>delete post</MenuItem>}
                      </Menu>
                  </div>
              </div>
              <div className="bodyBellowHome-body">
                  <div className='bodyBellowHome-descriptionAndImagePost'>
                      <div>{data?.desc}</div>
                      <div className='bodyBellowHome-descriptionAndImagePost-image'>
                          {(data?.img&&data?.img?.length>0)&&
                            <>
                              {data.img.map(image=>{
                                 function imageClicked(image){
                                  makeImageFullScreen(!fullScreenImage)
                                 // console.log(image);
                                  getImageYouWantToMakeFullScreen(image)
                                 }
                                 return (
                                    <div className='bodyBellowHome-descriptionAndImagePost-eachImage'>
                                        <img src={`/uploads/${image.originalname}`} onClick={()=>imageClicked(image.originalname)} alt='image not found'/>
                                    </div>
                                      )
                                 
                                })}
                                { fullScreenImage&&
                                        <Fade top>
                                            <div className='bodyBellowHome-descriptionAndImagePost-eachImage-fullScreened'>
                                            
                                                <div><img src={`/uploads/${imageYouWantToMakeFullScreen}`} /></div> 
                                                <div className='bodyBellowHome-closeIcon'>
                                                    <CloseOutlined id='bodyBellowHome-closeIcon' onClick={imageClicked}/>
                                                </div>
                                           </div>
                                        </Fade>
                                  }
                            </>
                            }
                        </div> 
                  </div>
                  
                    <div className='bodyBellowHome-buttons'>
                        <div  className='bodyBellowHome-button-like'>
                               <Button onClick={pageLiked} disabled={loadOnGettingLikes}><ThumbUpIcon /></Button>
                               <div>{likedPage&&
                                  (loadOnGettingLikes?
                                      <Skeleton  className="skeleton_load" variant="circular" width={20} height={20} />
                                      :<CircleIcon id="liked_circle"/>)}</div>
                                <div>{allLikedUsers.length}</div>
                        </div>
                        <div className='bodyBellowHome-button-share bodyBellowHome-button-each'><Button onClick={commentClicked}><CommentIcon/></Button> {ArrayOfcommentValue.length}</div>
                        <div className='bodyBellowHome-button-star'>
                          <Bu disabled={loadWhenPosrSaved} type="ghost" shape='circle' onClick={()=>savePost(data?._id)}>{postSaved?<StarIcon style={{color:"goldenrod"}}/>:<StarBorderIcon style={{color:"goldenrod"}}/>}</Bu> </div>
                        <div className='bodyBellowHome-button-comment'><Button><ShareIcon/></Button> </div>
                   </div>
                    {loadOnlikingPage&&<CircularProgress size={20} className='bodyBellowHome-body-circProgress'/>}
                    <Divider/>
                    {loadOnSendComments&&<LinearProgress style={{background:"brown"}} />}
                    <div className={`bodyBellowHome-commentSection ${commentSection&&"showCommentSection"}`}>
                        <div className='bodyBellowHome-commentSection-userComment'>
                          <img src={postUserProfile?.data.profilePicture[postUserProfile?.data?.profilePicture.length-1]} width={30} height={25} className="bodyBellowHome-commentSection-userComment-image"/>
                          <div><input placeholder='What is Your comment?' onChange={CommentValueChanged} value={commentValue}/></div>
                          <article className='bodyBellowHome-commentSection-userComment-button'>
                               <Button onClick={()=>sendTheComment(data?._id)} className='bodyBellowHome-commentSection-send'><SendIcon/></Button>
                               <Row justify="center" className='bodyBellowHome-commentSection-image'>
                                <Col>
                                  <div>
                                    <label>
                                      <Input
                                      type="file"
                                      id="fileInput"
                                      accept="image/*"
                                      onChange={changeHandler}
                                      hidden
                                      className='file-input'
                                    />
                                    <ImageIcon className='profileCameraIcon2' />                      
                                  </label>
          
                                </div>
                              </Col>
                               </Row>
                               <Modal
                              title="EditPicture"
                              visible={openModal}
                              onOk={handleSubmit}
                              onCancel={() => setOpenModal(false)}
                              >
                              <Row justify="center">
                                <Col>
                                  <AvatarEditor
                                    ref={editorRef}
                                    image={image}
                                    width={200}
                                    height={200}
                                    borderRadius={100}
                                    border={30}
                                    scale={scale}
                                    rotate={0}
                                    color={[255, 255, 255, 0.6]}
                                  />
                                </Col>
                              </Row>
                              <Row justify="center" align="middle">
                                <Col>
                                  <PlusOutlined />
                                  <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => setScale(e.target.value)}
                                  />
                                  <MinusOutlined />
                                </Col>
                              </Row>
                               </Modal>
                          </article>
                        </div>
                        {ArrayOfcommentValue?.length>0&&
                         <div className='bodyBellowHome-commentSection-comments'>
                            <h3>Comments {ArrayOfcommentValue.length}</h3>
                              {ArrayOfcommentValue?.map(comments=>{
                                return (
                                  <div className='bodyBellowHome-commentSection-comments-given' key={comments.id}>
                                        <div className='bodyBellowHome-commentSection-comments-imageText'>
                                            <div className='bodyBellowHome-commentSection-comments-user'>
                                              <Link href={comments?.user.username===userData.data.username?"/myprofile":`/user/${comments?.user.username}`}><div><img src={comments.user.profilePicture[comments.user.profilePicture.length-1]} width={30} height={30} alt="no user"/></div></Link> 
                                              <div className='bodyBellowHome-commentSection-comments-userName'>{comments?.user.username}</div>
                                            </div>
                                            <div className='bodyBellowHome-commentSection-comments-imageText-text'>{comments?.comment?.comment}</div>
                                        </div>                      
                                       {comments?.comment?.image&& <div className='bodyBellowHome-commentSection-comments-given-imageComented'><Image src={comments?.comment?.image} width={100} height={100} alt="Cant't get your pic"/></div>}
                                       <div className='bodyBellowHome-commentSection-time'>{moment(comments?.postedDate).fromNow()}</div>
                                       {comments?.user.username===userData.data.username&&<div className='bodyBellowHome-commentSection-deleteButton'>
                                        <Bu onClick={()=>deleteComent(data?._id,comments.id)} type="primary" danger>del </Bu></div>}
                                      <Divider/>
                                  </div>
                                )
                              })}
                          </div>}
                    </div>
              </div>
             {displayWhoLikesYou&&
                <LightSpeed right>
                  <div className='bodyBellowHome-whoLikesYou'>
                     <div className='bodyBellowHome-whoLikesYou-name'>
                        {allLikedUsers.map(e=>{
                          return(
                          <div className='bodyBellowHome-whoLikesYou-eachPerson'>
                              <Link href={e.username===userData.data.username?"/myprofile":`/user/${e.username}`}>
                                <div><img src={e.profilePicture[e.profilePicture.length-1]} width={50} height={40}/></div>
                                <div>{e.username===userData.data.username?"you":e.username}</div>
                            </Link>
                          </div>
                          )
                        })}
                      </div>
                 <div><CloseOutlined style={{padding:"10px 10px 0 5px"}} onClick={()=>getdWhoLikesYou(false)}/></div>
                </div>
              </LightSpeed>
            }
          </>
       }
     </div>
 </div>
  )
}
