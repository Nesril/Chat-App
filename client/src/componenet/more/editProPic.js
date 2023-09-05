import React, { useEffect, useRef, useState } from 'react'
import { MuiFileInput } from 'mui-file-input'
import {  Alert,Input, Col, Row, Modal, Slider } from 'antd';
import { Button, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AvatarEditor from 'react-avatar-editor';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Reveal from 'react-reveal/Reveal'
import Fade from 'react-reveal/Fade';
import { Image, Space } from 'antd';
import { CloseOutlined  } from '@ant-design/icons';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';

export default function EditProPic({userData,setUserData}) {
  let [profilePic,setProfilePic]=useState([])
const [image, setImage] = useState(null);
const [scale, setScale] = useState(1);
const editorRef = useRef();
const [openModal, setOpenModal] = useState(false);

const handleSubmit = async() => {
  const url = editorRef.current.getImageScaledToCanvas().toDataURL();
  setOpenModal(false);
  let profileValue={
    profilePicture:url
}
let strigfyValue=JSON.stringify(profileValue)
  axios.put(`http://localhost:1330/bullo/userApi/updateProfilePicture/${userData?.data?.username}`,strigfyValue,
    {
      headers: {
          authorization:`Bearer ${userData.token}`,
          'Content-Type': 'application/json'
      } 
    })
 .then(res=>{
  setUserData(res.data)
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

}


const changeHandler = (e) => {
  if (!e.target.files[0]) return;
  setImage(e.target.files[0]);
  setOpenModal(true);
  //setPicAsSoonAsPPChanged(true)
};

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


let items=userData?.data?.profilePicture?.reverse()?.map(image=>{
return(
<div className='profilePicFullScreened-clicked' >
      <Image src={image} width={400} height={400}
       id="profilePicFullScreened-clicked-image"/>
      
</div>
)
})

let pro=userData?.data?.profilePicture
  return (
    <div>
         <div className='editCoverProfilePic_proPic'>
           <img onClick={imageMadeFullScreen} src={pro[pro.length-1]} width={100} height={100} alt="cant't find your image"/> 
        </div> 
        <article className='editCoverProfilePic_proPic-Update'>
                      <Row justify="center" className='bodyBellowHome-commentSection-image'>
                            <Col>
                                <label>
                                    <Input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        onChange={changeHandler}LinkedCameraIcon
                                        hidden
                                        className='file-input'
                                        />
                                   <div className='profilePicCameraIcon-button'><LinkedCameraIcon className='profilePicLinkedCameraIcon'/></div>
                                  
                              </label>
                          </Col>
                      </Row>
                      <Modal
                        title="Edit Profile Picture"
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
         {(seeFullScreenIage&&pro.length>0)&&
         <Reveal>
           <div className='profilePicFullScreened'>
              <div className='makeSure-makeCenter-icon'><Button  onClick={imageMadeFullScreen} ><CloseOutlined  className='icon'/></Button></div>
                <AliceCarousel  
                  mouseTracking        
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
    </div>
  )
}
