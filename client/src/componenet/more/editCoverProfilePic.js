import React, { useEffect, useRef, useState } from 'react'
import { MuiFileInput } from 'mui-file-input'
import {  Alert,Input, Col, Row, Modal, Slider } from 'antd';
import { Divider } from '@mui/material';
import { Button } from 'antd';
import AvatarEditor from 'react-avatar-editor';
import CameraIcon from '@mui/icons-material/Camera';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import EditProPic from './editProPic';
import {Dropdown } from 'antd';
import axios from 'axios';

export default function EditCoverProfilePic({userData,setUserData}) {
  let [coverPicture,setCoverPicture]=useState("")

const [image, setImage] = useState(null);
const [scale, setScale] = useState(1);
const [display, setDisplay] = useState(null);
const [openModal, setOpenModal] = useState(false);

const handleSubmit = async() => {
  const url = editorRef.current.getImageScaledToCanvas().toDataURL();
  setDisplay(url)
  setOpenModal(false);
  setCoverPicture(url)
  let coverValue={
      coverPicture:url
  }
  let strigfyValue=JSON.stringify(coverValue)
  console.log(strigfyValue);
  axios.put(`http://localhost:1330/bullo/userApi/updateProfilePicture/${userData?.data?.username}`,strigfyValue,
    {
      headers: {
          authorization:`Bearer ${userData.token}`,
          'Content-Type': 'application/json'
      } 
    })
   .then(res=>{
    setUserData(res.data)
    console.log(res.data);
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


 // console.log("Submitted cover",coverPicture);

const editorRef = useRef();

  return (
    <div className='editCoverProfilePic'>  
              <div className='editCoverProfilePic_coverPic'><img src={userData?.data?.coverPicture} width={100} height={100} alt="cant't find your image"/> </div>
              <article className='editCoverProfilePic-UpdateCoveProfile'>
                      <Row justify="center" className='bodyBellowHome-commentSection-image'>
                            <Col>
                                <label>
                                  <Input
                                  type="file"
                                  id="fileInput"
                                  accept="image/*"
                                  onChange={changeHandler}
                                  hidden
                                  className='file-input'
                                />
                                   <div className='coverPicCameraIcon-button'><CameraIcon className='coverPicCameraIcon'/></div>
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
              </article> <br></br><br></br>
              <EditProPic userData={userData} setUserData={setUserData}/>

    </div>
  )
}
