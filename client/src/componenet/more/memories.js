import React, { useEffect, useState } from 'react'
import { Button, Divider } from 'antd';
import { CameraOutlined, CloseOutlined  } from '@ant-design/icons';
import Reveal from 'react-reveal/Reveal'
import { Image } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { CircularProgress, LinearProgress, TextField } from '@mui/material';
import { Checkbox } from 'antd';
import axios from 'axios';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import EachMemories from './eachMemories';
export default function Memories({userData,darkmode}) {
  let [addIconClicked,setAddIconClicked]=useState(false)
  let handleAddICon=()=>{
    setAddIconClicked(!addIconClicked)
  }
  let [articleValue,setArticleValue]=useState("")
  let [allUserMemories,getAllUserMemories]=useState([])
  let [newMemories,makeNewMemories]=useState({
    username:userData?.data?.username,
    article:articleValue,
    img:[],
    share:false
  })
const handleChange = (e) => {
    let image=e.target.files
    makeNewMemories(element=>{ 
      return{...element,img:image}
    })
  }
const onChange = (e) => {
  makeNewMemories(element=>{ 
    return{...element,share:e.target.checked}
  })
};

const handleTextChanginging=(e)=>{
  setArticleValue(e.target.value)
  makeNewMemories(element=>{ 
    return{...element,article:e.target.value}
  })
}
  
let [sampleImage,setSampleImages]=useState([])
  useEffect(()=>{
    if(newMemories.img){
        for (let i = 0; i < newMemories.img.length; i++) {
          let url=URL.createObjectURL(newMemories.img[i])
          console.log(url);
          setSampleImages(e=>[...e,url])
        }
    }
  },[newMemories.img])

  console.log(newMemories);

let [loadOnFindingAllMemories,setLoadOnFindingAllMemories]=useState(true)
let [loadOnCreatingNewMemories,setLoadOnCreatingNewMemories]=useState(false)
function createNewMemory(){
  setLoadOnCreatingNewMemories(true)
  setSampleImages([]);
  let fd=new FormData()                                                               
  let url=`http://localhost:1330/bullo/userApi/addMemories`
  for (let i = 0; i < newMemories.img.length; i++) {
    console.log(newMemories.img[i]);
    fd.append("img",newMemories.img[i])
  }
  fd.append("article",newMemories.article)
  fd.append("username",newMemories.username)
  fd.append("share",newMemories.share)
 
  console.log(url,fd);

  axios.put(url,fd)
  .then(res=>{
    setLoadOnCreatingNewMemories(false)
        console.log(res.data);
        getAllUserMemories(res.data.userMemories)
        makeNewMemories({
            username:userData?.data?.username,
            article:articleValue,
            img:[],
            share:false
          })
      setArticleValue("")
  })
  .catch(error=>{
    setLoadOnCreatingNewMemories(true)
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

 let [updateAllMemoriesWhileSharingIsChanging,setUpdateAllMemoriesWhileSharingIsChanging]=useState("")
useEffect(()=>{
  axios.get(`http://localhost:1330/bullo/userApi/memories?currentUserName=${userData?.data?.username}&&remoteUserName=${userData?.data?.username}`)
    .then(res=>{
        console.log(res.data);
        getAllUserMemories(res.data.data)
        setLoadOnFindingAllMemories(false)
     })
      .catch(error=>{
        setLoadOnFindingAllMemories(true)
          if (error.response) {
              console.log(error.response.data);
              console.log("server responded");
          } else if (error.request) {
            console.log("network error, please connect to internate");
          } else {
            console.log(error);
          }  
      })
},[updateAllMemoriesWhileSharingIsChanging])
  
  console.log("allUserMemories",allUserMemories);

  return (
   <div className='memories'>
       <h2>My Memories <sup><span style={{opacity:"0.2"}}>{allUserMemories.length}</span></sup></h2>
       <div className='memories-createNew'>
          <div className={`memories-createNew-icon ${addIconClicked&&"RemoveIconToStartAddingMemories"}`} ><Button danger={addIconClicked} onClick={handleAddICon}>{addIconClicked?<ClearIcon id="memoryAddIcon"/>:<AddIcon id="memoryAddIcon"/>}</Button> </div>
          <div className={`memories-createNew-ImageTExt ${!addIconClicked&&"startCreatingMemories"}`}> 
              <form enctype="multipart/form-data">
                  {!sampleImage.length>0&&
                  <div className='memories-createNewImage'>
                          <label>
                              <input type="file" multiple name="img" onChange={handleChange} className='file-input-newPost'/>
                              <div  style={{transition:"0.5s",color:darkmode?"white":"black"}} className='picButton'>
                                  <CameraOutlined  style={{color:"brown"}}/>
                              </div>                                  
                          </label>
                  </div>}
                  <div className='memories-createNew-sampleImage'>
                    {sampleImage.map(src=>{
                      return <div><Image src={src} width={100} height={80}/></div>
                    })}
                  </div>
                  <div className='memories-createNew-text'>
                        <TextField
                        color="success" focused
                          variant="outlined" 
                          label="what do you feel" 
                          multiline
                          minRows={1}
                          maxRows={4}
                          id='text-field'
                          value={articleValue}
                          onChange={handleTextChanginging}
                        />
                  </div>
                  <div><Checkbox onChange={onChange}>share with others</Checkbox></div>
                  <Button type='submit' onClick={createNewMemory}>Create new memory</Button>
              </form>
              {loadOnCreatingNewMemories&&<div style={{textAlign:"center",marginTop:"60px"}}><CircularProgress size={50}/></div>}
           </div>
       </div>
      {loadOnFindingAllMemories?
      <div className='loadingUser-freind'>
         <img src='/load2.webp' alt='...loading' />
      </div>:
       <div className='memories-setting'>
          {allUserMemories?.map(memo=>{
          return <EachMemories memo={memo} userData={userData} setUpdateAllMemoriesWhileSharingIsChanging={setUpdateAllMemoriesWhileSharingIsChanging}/>
          })}
      </div>
      }
  </div>
  )
}
