import React, { useEffect, useRef, useState } from 'react'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import IosShareIcon from '@mui/icons-material/IosShare';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import TagIcon from '@mui/icons-material/Tag';
import { Button, Skeleton } from '@mui/material';
import BodyBellowHome from './body/bodyBellowHome';
import { MuiFileInput } from 'mui-file-input'
import {  Alert,Input, Col, Row, Modal, Slider } from 'antd';
import { Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AvatarEditor from 'react-avatar-editor';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';
import Reveal from 'react-reveal/Reveal'
import Fade from 'react-reveal/Fade';
import { Image, Space } from 'antd';
import { CloseOutlined  } from '@ant-design/icons';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
export default function Home({darkmode,userData,setUserData}) {
  let pro=userData?.data?.profilePicture;
  const [AllPostedData,getAllPostedData]=useState([])
  const [textValue,setTextValue]=useState("")
  const [singleDataToBePosted,getSingleDataToBePosted]=useState({
    username:userData?.data?.username,
    img:"",
    desc:textValue,
    vedio:null,
    location:null
  }) 

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
   console.log(singleDataToBePosted)
//get all

useEffect(()=>{
  axios.get(`http://localhost:1330/bullo/posetApi`)
  .then(res=>{
        console.log(res.data);
        getAllPostedData(res.data.data)
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
  
},[singleDataToBePosted])

  return (
 <div className='middle-homes'>
     <div className='home-header'>  
           <div className="home-header-right">
              <div>
                  {pro?<img src={pro[pro.length-1]} width={100} height={50} />
                        :
                    <Skeleton variant="circular" width={50} height={50} />
                  }
                </div>
              <div className='home-header-right-input'><input disabled={pro?false:true} value={textValue} onChange={textInputed} placeholder=" What is hapening ? "/></div>
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
      
     </div>
   
        {[...AllPostedData].reverse()?.map(e=>{
          return <BodyBellowHome userData={userData} setUserData={setUserData} data={e} setData={getAllPostedData} type={"all"}/>
          
        })}
       {AllPostedData.length<1&&
        <div className='NoPostsAvailable'>
            <h2 className='NoPostsAvailable-text'>No posts available</h2>
            <div className={`NoPostsAvailable-img`} ><img src='/horsierun.gif' alt='...loading'/></div>
       </div>}
  
</div>

  )
}
