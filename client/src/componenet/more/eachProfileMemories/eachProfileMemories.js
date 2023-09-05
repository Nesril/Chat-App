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
export default function EachProfileMemories({memo,userData}) {
    console.log(memo);
    let [fullScreenedMemory,setFullScreenedMemory]=useState({})
    let [displayImage,setDisplayImage]=useState(false)
    function memoriesClicked(data){
        setFullScreenedMemory(data)
        setDisplayImage(true)
      }
      function removeMemoryImageFullScreen(){
        setDisplayImage(false)
    
      }
  return (
    <div>           
    <div className='profile-memories-list' key={memo.memoryID}>
          {memo.img.length>0&& 
           <div className='profile-memories-list-left'>
              <div className='profile-memories-list-firstImage'><img src={`/uploads/${memo.img[0].filename}`} alt="can't find picture" /></div>
           </div>}
            <div  className={`profile-memories-list-right ${!memo.img.length>0&&"profile-memories-list-right-no-image"}`}>
               <div className='profile-memories-list-description'>{memo.article.length>30?`${memo.article.substring(0,30)}...`:memo.article.substring(0,30)}</div>
               <div className='profile-memories-list-details'><Button  onClick={()=>memoriesClicked(memo)}>Detail</Button></div>
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
                      <div  className='displayMemoryImageFullScreen-rightSide'> {fullScreenedMemory.article}</div>
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
</div>

  )
}
