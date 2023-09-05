import React, { useEffect, useState } from 'react'
import { Button, Divider } from 'antd';
import { CameraOutlined, CloseOutlined, FastBackwardOutlined  } from '@ant-design/icons';
import Reveal from 'react-reveal/Reveal'
import { Image } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { CircularProgress, LinearProgress, TextField } from '@mui/material';
import { Checkbox } from 'antd';
import axios from 'axios';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';

export default function EachMemories({memo,userData,setUpdateAllMemoriesWhileSharingIsChanging}) {
    let [fullScreenedMemory,setFullScreenedMemory]=useState({})
    let [displayImage,setDisplayImage]=useState(false)

    function memoriesClicked(data){
      setFullScreenedMemory(data)
      setDisplayImage(true)
    }
    function removeMemoryImageFullScreen(){
      setDisplayImage(false)
  
    }
    let memoryCreatedTimeFromNow=moment(memo.uploadedDate).fromNow();
    let memoryUpdatedTimeFromNow=moment(memo?.updatedDate).fromNow();

    
    let [shareWithOthers,setShareWithOthers]=useState(false)
    let[loadWhileUpdating,seLoadWhileUpdatingt]=useState(false)
    let [doneSharing,getDoneSharing]=useState(false)
    const handleSharing=(e)=>{
      console.log(e.target);
      setShareWithOthers(e.target.checked)
      getDoneSharing(true)
     }
    const handleDoneSharing =(id)=>{
      seLoadWhileUpdatingt(true)
      let sharedBody={
        share:shareWithOthers,
        username:userData?.data?.username
      }
      let stringfyValue=JSON.stringify(sharedBody)
      axios.put(`http://localhost:1330/bullo/userApi/memmemories/share/${id}`,stringfyValue,{
        headers: {
            authorization:`Bearer ${userData.token}`,
            'Content-Type': 'application/json'
        } 
        })
        .then(res=>{
          seLoadWhileUpdatingt(false)
          getDoneSharing(false)
           console.log(res.data);
           console.log("updated");
           setUpdateAllMemoriesWhileSharingIsChanging(res.data.data)
         })
         .catch(error=>{
          seLoadWhileUpdatingt(true)
          if (error.response) {
              console.log(error.response.data);
              console.log("server responded");
          } else if (error.request) {
            console.log("network error, please connect to internate");
          } else {
            console.log(error);
          }  
      })
     }
    let [loadWhileDeleting,setLoadWhileDeleting]=useState(false)
    let[sureToDeleteMemories,makeSureToDeleteMemories]=useState(false)
    function deleteMemory(id){ 
        makeSureToDeleteMemories(!sureToDeleteMemories)
    }

    const handlesureToDeleteMemory=(id)=>{
        let deleteUser={
          username:userData?.data?.username
        }
        let stringfyValue=JSON.stringify(deleteUser)
        console.log(stringfyValue,id);
        setLoadWhileDeleting(true)
        axios.delete(`http://localhost:1330/bullo/userApi/memmemories/delete/${id}?username=${deleteUser.username}`,
          {
            headers: {
                authorization:`Bearer ${userData.token}`,
                'Content-Type': 'application/json'
            } 
          }
         )
        .then(res=>{
           console.log(res.data);
           setUpdateAllMemoriesWhileSharingIsChanging(res.data.data)
           setLoadWhileDeleting(false)
           makeSureToDeleteMemories(false)

        })
        .catch(error=>{
           setLoadWhileDeleting(true)
              if (error.response) {
                  console.log(error.response.data);
                  console.log("server responded");
              } else if (error.request) {
                console.log("network error, please connect to internate");
              } else {
                console.log(error);
              }  
          }) 
    }
    const t=(test)=>{
return test;
  }
  return (
        <div>           
           <div className='memories-list' key={memo.memoryID}>
                 {memo.img.length>0&& <div className='memories-list-left'>
                    <div className='memories-list-firstImage'><img src={`/uploads/${memo.img[0].filename}`} alt="can't find picture" /></div>
                    <div className='memories-list-otherImages'>
                          {memo.img.map(e=>{
                            return <div><img src={`/uploads/${e.filename}`} alt="can't find picture" /></div>
                          })}
                      </div>
                  </div>}
                   <div  className={`memories-list-right ${!memo.img.length>0&&"memories-list-right-no-image"}`}>
                      {loadWhileDeleting&&<LinearProgress/>}
                      <div className='memories-list-description'>{memo.article.length>150?`${memo.article.substring(0,150)}...`:memo.article.substring(0,150)}</div>
                      <div className='memories-list-footer'>
                          <div className='memories-list-footer-check'>you are {t(memo.shareWithOthers)} {memo.shareWithOthers==="true"?"sharing":"not sharing"} with others</div>
                          <div className='memories-list-foundedAt'>
                               <div>memory stored {memoryCreatedTimeFromNow}</div>
                               {memo?.updatedDate&&<div>memory updated {memoryUpdatedTimeFromNow}</div>}
                          </div>
                         
                          <div className='memories-list-footer-buttons'>
                              <div className='memories-list-details'><Button  onClick={()=>memoriesClicked(memo)}>Detail</Button></div>
                              <div><Button shape='circle' danger onClick={()=>deleteMemory(memo.memoryID)}><DeleteIcon/></Button></div>
                          </div>
                          <div className='memories-list-footer-wantToshare'><span style={{fontSize:"13px",fontWeight:"600"}}>
                             {memo.shareWithOthers==="true"?"want to unshare with others":"want to share with others"}</span> 
                             &ensp;&ensp;<Checkbox name='check' value={shareWithOthers} onChange={handleSharing}/> 
                          </div>
                          {doneSharing&&
                            <div className='memories-list-footer-Done'>
                              {loadWhileUpdating?<CircularProgress size={10}/>:<Button onClick={()=>handleDoneSharing(memo.memoryID)}>Done</Button>}
                            </div>
                          }
                      </div>
                  </div>
                  {displayImage&& 
                   <Zoom bottom>
                     <div className='displayMemoryImageFullScreen'>
                        <div className='displayMemoryImageFullScreen-icon'><Button  onClick={removeMemoryImageFullScreen}style={{background:"red"}} ><CloseOutlined  className='icon'/></Button></div>
                        <div className='displayMemoryImageFullScreen-each'>
                           <div className='displayMemoryImageFullScreen-leftSide'> 
                                    {fullScreenedMemory.img.map(e=>{
                                            return <div><Image src={`/uploads/${e.filename}`} width={400} height={400} alt="can't find picture" /></div>
                                        })}
                            </div>    
                             <div  className='displayMemoryImageFullScreen-rightSide'> {fullScreenedMemory.article}           </div>
                             <footer>
                                 <div>created {moment(memo?.uploadedDate).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                 {memo.updatedDate&&<div>updated {moment(memo?.updatedDate).fromNow()}</div>}
                                 <div>memory Id: {memo.memoryID}</div>
                             </footer>
                        </div>
                        
                     </div>
                   </Zoom>
                    }
        </div>
        {sureToDeleteMemories&&
            <Fade bottom>
             <div className='makeSureOption'>
                  <div className='makeSureOption-title'>Are You sure</div>
                 <div className='makeSureOption-button'>
                   <div className='makeSureOption-button-yes' onClick={()=>handlesureToDeleteMemory(memo.memoryID)}><Button>yes</Button></div>
                   <div className='makeSureOption-button-no'><Button onClick={()=>makeSureToDeleteMemories(false)}>no</Button></div>
                </div>
             </div>
          </Fade>}
     </div>

  )
}
