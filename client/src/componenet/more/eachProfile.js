import React, { useEffect, useState } from 'react'
import "../../styles/profile.css"
import Link from 'antd/es/typography/Link'
import BodyBellowHome from "../body/bodyBellowHome"
import {Button as Bu} from "antd"
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import IosShareIcon from '@mui/icons-material/IosShare';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import TagIcon from '@mui/icons-material/Tag';
import { Button, CircularProgress } from '@mui/material';
import { Image, Space } from 'antd';
import { CloseOutlined  } from '@ant-design/icons';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Skeleton } from '@mui/material';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Reveal from 'react-reveal/Reveal'
import axios from 'axios'
import EachProfileMemories from './eachProfileMemories/eachProfileMemories'
export default function EachProfile({darkmode,data,type,userData,setUserData}) {
  let nameCurrent={
    username:userData?.data?.username
  }
  let stringfyNAme=JSON.stringify(nameCurrent)
  let [userunFollowing,getUnfollowingUser]=useState(true)
  let [error,setError]=useState({
    status:false,
    unfollow:false,
    msg:""
  })
  useEffect(()=>{
      if(userData?.data?.followings.includes(data?.data?.username)){
        getUnfollowingUser(true);
      }
      else{
        getUnfollowingUser(false);
      }
      console.log(userData?.data?.followings,userData);

  },[userData])
  let [loadingWhileRomaining,setLoading]=useState(false)
  function followUser(){
     ///console.log(stringfyNAme,data?.data?.username);
     setError({
      status:false,
      unfollow:false,
      msg:""
      })
      setLoading(false)
     axios.put(`http://localhost:1330/bullo/userApi/follow/${data?.data?.username}`,stringfyNAme,{
      headers: {
          authorization: `Bearer ${userData?.token}`,
          'Content-Type': 'application/json'
      } 
      })
      .then(res=>{
        setLoading(false)
        console.log(res.data);
        setUserData(res.data)
        setError({
          status:false,
          msg:""
          })
      })
      .catch((error) => {
        setLoading(true)
        // setCode("")
          if (error.response) {
            console.log(error.response.data);
            console.log("server responded");
            setError({
              status:false,
              unfollow:true,
              msg:error.response.data.msg
              })
          } else if (error.request) {
            console.log("network error");
            setError({status:true,
              unfollow:false,
              msg:"network error"})
          } else {
            console.log(error);
            setError({status:true,
              unfollow:false,
              msg:"error occured While romaining"})
          }
          })
  }

  ////ubfollow user
  function unfollowUser(){
    setLoading(false)
    axios.put(`http://localhost:1330/bullo/userApi/unfollow/${data?.data?.username}`,stringfyNAme,{
      headers: {
          authorization: `Bearer ${userData?.token}`,
          'Content-Type': 'application/json'
      } 
    })
    .then(res=>{
      console.log(res.data);
      setUserData(res.data)
      setLoading(false)
    })
    .catch((error) => {
      // setCode("")
      setLoading(true)
        if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
          setError({
            status:false,
            unfollow:true,
            msg:error.response.data.msg
            })
        } else if (error.request) {
          console.log("network error");
          setError({status:true,
            unfollow:false,
            msg:"network error"})
        } else {
          console.log(error);
          setError({status:true,
            unfollow:false,
            msg:"error occured While romaining"})
        }
        })
  }

  //console.log(error);
  let [errorWhilegettingFollowers,setErrorWhilegettingFollowers]=useState(false)
   let [userFollowing,setUserFollowing]=useState() 
   useEffect (()=>{
    setErrorWhilegettingFollowers(false)
    axios.get(`http://localhost:1330/bullo/userApi/followers/${data?.data?.username}`)
    .then(res=>{
      console.log(res.data);
      setUserFollowing(res.data)
      setErrorWhilegettingFollowers(false)
     })
     .catch((error) => {
      // setCode("")
      setErrorWhilegettingFollowers(true)
        if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      })
    },[data?.data?.username])  
    let pro=data?.data?.profilePicture
   // console.log(pro[pro?.length-1]);
//////////////////////////////////////////////////////
let [seeFullScreenIage,setSeeFullScreenIage]=useState(false)

let imageMadeFullScreen=()=>{
  setSeeFullScreenIage(!seeFullScreenIage)
}

let responsive={
  0:{
      items:1
  }
}

/////buttons
const  renderNextButton= ({ isDisabled }) => {
  return <ArrowForwardIosIcon style={{ cursor:"pointer",position: "fixed", right: "20px", top: "200px",color:"white",zIndex:"20" }}/>
};

const renderPrevButton = ({ isDisabled }) => {
  return <ArrowBackIosIcon style={{ cursor:"pointer",position: "fixed", left: "20px", top: "200px",color:"white",zIndex:"20" }} />
};


let items=data?.data?.profilePicture?.reverse().map(image=>{
return(
<div className='profilePicFullScreened-clicked' >
      <Image src={image} width={400} height={400}
       id="profilePicFullScreened-clicked-image"/>
      
</div>
)
})
console.log(data?.data?.profilePicture&&data.data.profilePicture.reverse());

////get userPosts
const [AllPostedData,getAllPostedData]=useState([])
let [userPosts,getUserPosts]=useState([])
useEffect(()=>{
  axios.get(`http://localhost:1330/bullo/posetApi/${data?.data?.username}`)
  .then(res=>{
    console.log(res.data);
    getUserPosts(res.data)
  })
  .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log("server responded");
      } else if (error.request) {
        console.log("network error");
      } else {
        console.log(error);
      }
      })
},[data])
console.log(userPosts.data);

const [textValue,setTextValue]=useState("")
  const [singleDataToBePosted,getSingleDataToBePosted]=useState({
    username:userData?.data?.username,
    img:"",
    desc:textValue,
    vedio:null,
    location:null
  }) 
/////// post new datas
function textInputed(e){
  let {value}=e.target
  setTextValue(value)
  getSingleDataToBePosted(e=>{
    return {...e,desc:value}
  })

}

const handleChange = (e) => {
  let image=e.target.files
  getSingleDataToBePosted(element=>{ 
    return{...element,img:image}
  })
  
}
let [images,setImages]=useState([])
useEffect(()=>{
  if(singleDataToBePosted.img){
      for (let i = 0; i < singleDataToBePosted.img.length; i++) {
        let url=URL.createObjectURL(singleDataToBePosted.img[i])
        console.log(url);
        setImages(e=>[...e,url])
      }
  }
},[singleDataToBePosted.img])

function PostData(){
  setImages([]);
  let fd=new FormData()                                                               
  let url=`http://localhost:1330/bullo/posetApi/${userData?.data?.username}`
  for (let i = 0; i < singleDataToBePosted.img.length; i++) {
    fd.append("img",singleDataToBePosted.img[i])
  }
  fd.append("desc",singleDataToBePosted.desc)
  fd.append("username",singleDataToBePosted.username)
  axios.post(url,fd)
  .then(res=>{
        console.log(res.data);
        getAllPostedData(e=>[...e,res.data.data])
        getSingleDataToBePosted({
        username:userData?.data?.username,
        img:[],
        desc:null,
        vedio:null,
        location:null
      })
      setTextValue("")
  })
  .catch(error=>{
      if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
      } else if (error.request) {
        console.log("network error, please connect to internate");
      } else {
        console.log(error);
      }  
  })
  console.log(fd,singleDataToBePosted.img);
 }
 let [UserMemories,GetUserMemories]=useState([])
 let [loadOnFindingUserMemory,setLoadOnFindingUserMemory]=useState(false)
 useEffect(()=>{
  console.log(`http://localhost:1330/bullo/userApi/memories?currentUserName=${data?.data?.username}&&remoteUserName=${userData?.data?.username}`);
   axios.get(`http://localhost:1330/bullo/userApi/memories?currentUserName=${userData?.data?.username}&&remoteUserName=${data?.data?.username}`)
    .then(res=>{
      setLoadOnFindingUserMemory(false)
      GetUserMemories(res.data.data)
    })
    .catch(error=>{
      setLoadOnFindingUserMemory(true)
      if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
      } else if (error.request) {
        console.log("network error, please connect to internate");
      } else {
        console.log(error);
      }  
  })
 },[data?.data?.memories,userData])
 console.log(data);
  return (
  <div className='profile'>
    <div className='profileCoverPic'>
        <div className='profileCoverPic-coverPic-blur' ></div>
        <div className='profileCoverPic-coverPic'>
          <img src={data?.data?.coverPicture} width={100} height={100} alt="cant't find your image"/></div>
        <div className='profileCoverPic-profilePic'><img onClick={imageMadeFullScreen} src={pro?pro[pro?.length-1]:pro} width={100} height={100} alt="cant't find your image"/></div>
        {(seeFullScreenIage&&pro.length>0)&&
         <Reveal>
           <div className='profilePicFullScreened'>
              <div className='makeSure-makeCenter-icon'><Button  onClick={imageMadeFullScreen} ><CloseOutlined  className='icon'/></Button></div>
                <AliceCarousel  mouseTracking        
                      infinite
                      autoPlay
                      items={items}
                      disableDotsControls
                      autoPlayInterval={20000}
                      animationDuration={1200}
                      responsive={responsive}
                      keyboardNavigation={true}
                      renderPrevButton={renderPrevButton}
                      renderNextButton={renderNextButton}
                      />
                    <div style={{color:"white"}}>{pro.length}</div>
           </div>
       </Reveal>
         }
        <div className='profileCoverPic-name'  style={{color:darkmode?"white":"black"}}>{data?.data?.username}</div>
        <div className='profileCoverPic-BulloName' style={{color:darkmode?"white":"black"}}>{data?.data?.bulloName}</div>
        <div className='followChatButtonBellowProfile'>
            {type==="me"&&<div style={{marginTop:"10px"}}><Link href='/setting/editProfile'><Bu type='primary'>Edit Profile</Bu></Link> </div>}
            {type==="otherUser"&&((userunFollowing&&!loadingWhileRomaining)?
                    <div style={{marginTop:"10px"}}><Bu type='primary' onClick={unfollowUser}>un follow</Bu></div>
                          :
                    <div style={{marginTop:"10px"}}><Bu type='primary' onClick={followUser}>follow</Bu></div>)}
            {loadingWhileRomaining&&<div style={{marginTop:"10px"}}><Bu type='primary'><CircularProgress/></Bu></div>}
            <div><Link href='/chat'><Bu type='primary'style={{marginTop:"10px"}}>Chat</Bu></Link></div>  
        </div>
    </div>
    <div className='profileBody'> 
           <div className='profileBody-left'>
            {type==="me"&&
              <div className='profile-NewPost'>  
                  <div className="profile-NewPost-head">
                      <div className='profile-NewPost-head-image'><img src={pro?pro[pro?.length-1]:pro} width={50} height={50} /></div>
                      <div className='profile-NewPost-head-input'><input disabled={pro?false:true} value={textValue} onChange={textInputed} placeholder=" What is hapening ? "/></div>
                  </div>
                 <div className='home-header-left'>
                      <form enctype="multipart/form-data">
                          <div className='home-header-icon' >
                              <div>
                                <label>
                                  <input type="file" multiple name="img" onChange={handleChange}
                                    className='file-input-newPost'/>
                                  <div disabled={pro?false:true} style={{transition:"0.5s",color:darkmode?"white":"black"}} className='picButton'>
                                      <InsertPhotoIcon style={{color:"brown"}}/> <span style={{position:"relative",top:"-10px"}}>pic</span>
                                    </div>                                  
                                </label>
                              </div>
                              <div><Button  disabled={pro?false:true} style={{transition:"0.5s",color:darkmode?"white":"black"}} ><TagIcon/> Tag</Button></div>
                              <div><Button  disabled={pro?false:true} style={{transition:"0.5s",color:darkmode?"white":"black"}}><AddLocationAltIcon style={{color:"red"}}/></Button></div>
                              <div><Button  disabled={pro?false:true} style={{transition:"0.5s",color:darkmode?"white":"black"}}><AddReactionIcon style={{color:"goldenrod"}}/></Button></div>
                              <div><Button type='submit' disabled={pro?false:true} style={{transition:"0.5s",color:darkmode?"white":"black"}} 
                                onClick={PostData} ><IosShareIcon/> Post</Button></div>
                          </div>
                      </form>
                    
                      <div>
                        {images.length>0&&images.map(e=>{
                              return (<img src={e} alt='notFound' width={100} height={80}/>)
                          })
                        }
                      </div>
                 </div>
              </div>}
              <div className='profile-posted'>
                  {userPosts?.data?.map(e=>{
                      return  <BodyBellowHome userData={userData} user={userPosts?.user} data={e} setData={getUserPosts} type={type} profilePic={pro[pro?.length-1]}/>
                      
                    })}

                  {userPosts?.data?.length<1&&
                      <div className='NoPostsAvailable'>
                          <h2 className='NoPostsAvailable-text'>No posts available</h2>
                          <div className={`NoPostsAvailable-img`} ><img src='/horsierun.gif' alt='...loading'/></div>
                    </div>}

              </div>
           </div>
            <div className='profileBody-right'>
                 <div className='profileBody-right-userInfo'>
                      <div className='userInfo-title'>User information</div>
                      <div className='userinfo'> 
                          <div className='userInfo-eachTitle'>City</div>
                          <div className='userInfo-name'>{data?.data?.city?data?.data?.city: <Skeleton variant="rectangular " width={100} height={28} />}</div>
                      </div>
                      <div className='userinfo'> 
                          <div className='userInfo-eachTitle'>From</div>
                          <div className='userInfo-name'>{data?.data?.from ? data?.data?.from: <Skeleton variant="rectangular " width={100} height={28} />}</div>
                      </div>
                      <div className='userinfo'> 
                          <div className='userInfo-eachTitle'>Relationship</div>
                          <div className='userInfo-name'>{data?.data?.relationship||"Single"}</div>
                      </div>
                 </div>
                 {data?.data?.memories?.length>0&&
                 <div className='profileBody-right-memories'>
                    <div className='profileBody-right-memories-title'>{data?.data?.username}'s memories ({UserMemories.length} shared memories)</div>
                      {loadOnFindingUserMemory?
                        <div className='loadingUser-freind'>
                          <img src='/load2.webp' alt='...loading' />
                        </div>:
                     <div className='profileBody-right-Allmemories'>
                        {UserMemories?.map(e=>{
                          return <EachProfileMemories memo={e} userData={userData}/>
                        })}
                     </div>
                    }
                 </div>
                 }
                 <div className='profileBody-right-userFollowers'> 
                    <div className='userFollowers-title'>followers</div>
                    <div className='allFolowers'>
                        {errorWhilegettingFollowers?
                          <div className='loadingUser-freind'>
                            <img src='/load2.webp' alt='...loading' />
                          </div>
                            :
                            <>
                              { userFollowing?.map(freind=>{
                                 let profilePictureFollowes=freind?.profilePicture
                                  return(
                                    <>                          
                                      {freind?.username!==userData?.data?.username? 
                                      <Link href={`/user/${freind?.username}`}>
                                          <div className='each-folowers'>
                                            <div><img src={profilePictureFollowes[profilePictureFollowes?.length-1]} alt='cant get' width={100} height={100}/></div>
                                            <div className='each-folowers-name'>{freind?.username}</div>
                                          </div>
                                      </Link>
                                        :
                                      <Link href={`/myprofile`}>
                                          <div className='each-folowers'>
                                            <div><img src={profilePictureFollowes[profilePictureFollowes?.length-1]} alt='cant get' width={100} height={100}/></div>
                                            <div className='each-folowers-name'>me</div>
                                          </div>
                                      </Link>
                                      }
                                    </>

                                  )
                                })
                              }
                           </>
                       }
                       {
                          (userFollowing?.length<1&&!errorWhilegettingFollowers)
                               &&
                           <h3 className='eachProfileNoFollowerFound'>no follower found</h3>
                       }
                    </div>
                 </div> 
            </div>
      </div>
  </div>
  )
}
