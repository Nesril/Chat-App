import React from 'react'
import {
  Button,
  Form,
  Input,
} from 'antd';
import { InputNumber } from 'antd'
import { EyeTwoTone } from '@ant-design/icons';
import { CloseOutlined  } from '@ant-design/icons';
import { EyeInvisibleOutlined } from '@ant-design/icons';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Zoom from 'react-reveal/Zoom';
import { useNavigate } from 'react-router-dom';
import "../styles/editProfile.css"
import EditProCoverPic from "./more/editCoverProfilePic"
import { Alert, Space } from 'antd';

export default function EditProfile({userData,setUserData}) {
  let [profileData,setProfileData]=useState({
    username:userData?.data?.username,
    bulloname:userData?.data?.bulloName,
    email:userData?.data?.email,
    password:"",
    confirmPassword:"",
    city:userData?.data?.city,
    from:userData?.data?.from,
    relationship:userData?.data?.relationship,

  })
  let[InValidEmail,setInValidEmail]=useState(false)
  function formChanged(element){
    
    setProfileData(e=>{
      return {
        ...e,
        [element.target.name]:element.target.value
      }
    })
  }
  function formNumberChanged(value){
    console.log(value);
      setProfileData(e=>{
        return{...e,relationship:value}
      })
  }
  let [passwordConfirmed,setPasswordConfirmed]=useState(false)
///Show wheather password is confirmed
useEffect(()=>{
  if(profileData.confirmPassword!==profileData.password||profileData.password===" "||profileData.password===""){
    setPasswordConfirmed(true)
  }
  else {
    setPasswordConfirmed(false)
  }
},[profileData.confirmPassword,profileData.password])


///Show the confirmtion button
let [hideConfirmePAsswordButto,setHideConfirmePAsswordButto]=useState(false)
useEffect(()=>{
  if(profileData.password===userData?.data?.password){
    setHideConfirmePAsswordButto(true)
  }
  else{
    setHideConfirmePAsswordButto(false)
  }

},[profileData.password])
//console.log("form ",userData);

// username is empty

let [emptyUsername,setUserempty]=useState(false)
useEffect(()=>{
  if(profileData.username===" "||profileData.username===""){
    setUserempty(true)
  }
  else {
    setUserempty(false)
  }
},[profileData.username])

let [disAbleUpdateButton,setDisAbleUpdateButton]=useState(true)
let valueNotChanged=profileData.username==="userData.data.username"&&
  profileData.email==="userData.data.email"&&
  profileData.password==="userData.data.password"


useEffect(()=>{
  if(profileData?.email?.endsWith("@gmail.com")){
    setInValidEmail(false)
  }
  else{
    setInValidEmail(true)
  }
},[profileData.email])

useEffect(()=>{

  if(valueNotChanged){
    console.log("not updated")
    setDisAbleUpdateButton(true)                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
}
else{
  setDisAbleUpdateButton(false)
}
},[profileData])


//////are u sure componenet
let [beSurePage,setBeSurrPage]=useState(false)
function updateValue(){
  setBeSurrPage(true)
}
function amNotSureToChanges(){
  setBeSurrPage(false)
}
//console.log(userData.data.token);
let [isLoading,setLoading]=useState(false)
let [errorOccured,setErrorOccured]=useState(false)
let navigate=useNavigate()

async function amSureToChanges(){
  setLoading(true)
 setBeSurrPage(false)
 setErrorOccured(false)
 let stringfyValue=JSON.stringify(profileData)
 console.log("Updated profileData ",stringfyValue);
 axios.put(`http://localhost:1330/bullo/userApi/updateUserProfile/${userData?.data?.username}`,stringfyValue,
 {
    headers: {
        authorization:`Bearer ${userData.token}`,
        'Content-Type': 'application/json'
    } 
  
 })
 .then(response=>{
  console.log(response.data)
  setLoading(false)
  setErrorOccured(false)
  setUserData(response.data)
  
  })
.catch((error) => {
  setLoading(false)
  setErrorOccured(true)
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
  return (
    <div className='profile'>
       <h1 className='profile-title' style={{fontSize:"40px"}}>Profile</h1>
       <div  className='profile-description'  style={{fontSize:"16px"}}>Profile information will be displayed on your dashboard.
          Username</div>
  
       <EditProCoverPic  userData={userData} setUserData={setUserData}/>
       <section className='form'>
           <h2 style={{fontSize:"28px"}}>User Credentials</h2>
           <div  className='form-componrnt'>
                <div className='form-input'>
                  <div className='form-input-title'>username </div> 
                  <Input
                  placeholder='username'
                  onChange={formChanged}
                  name='username'
                  value={profileData.username}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />     
                </div> 
                <div className='error'></div>
            </div>
            <div  className='form-componrnt'>
                <div className='form-input'>  
                   <div className='form-input-title'>Bullo-name </div> 
                    <Input
                    placeholder='bulloname'
                    onChange={formChanged}
                    name='bulloname'
                    value={profileData.bulloname}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />     
                </div> 
                <div className='error'></div>
            </div>
           
            <div className='form-componrnt'>
                <div  className='form-input'>  
                    <div className='form-input-title'>email</div> 
                    <Input
                      placeholder='email'
                      onChange={formChanged}
                      name='email'
                      style={{borderColor:InValidEmail&&"red"}}
                      value={profileData.email}
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />     
                </div> 
                <div  className='error'>{InValidEmail&&"Invalid Email"}</div>
           </div>
  
            <div className='form-componrnt'>
                <div className='form-input'>  
                    <div className='form-input-title'>password</div> 
                    <Input.Password
                      placeholder='password'
                      onChange={formChanged}
                      name='password'
                      value={profileData.password}
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />     
                </div> 
                <div className='error'></div>
            </div>
  
            <div className='form-componrnt'  style={{display:hideConfirmePAsswordButto&&"none"}}>
                <div className='form-input'>  
                    <div className='form-input-title'>confirm password</div> 
                    <Input.Password
                        placeholder='confirm password'
                        onChange={formChanged}
                        name='confirmPassword'
                        value={profileData.confirmPassword}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />     
                </div> 
                <div className='error'>{passwordConfirmed&&"Password is not confirmed"}</div>
            </div>

            <div  className='form-componrnt'>
                <div className='form-input'>  
                   <div className='form-input-title'>city </div> 
                    <Input
                    placeholder='city'
                    onChange={formChanged}
                    name='city'
                    value={profileData.city}
                    />     
                </div> 
                <div className='error'></div>
            </div>
            
            <div  className='form-componrnt'>
                <div className='form-input'>  
                   <div className='form-input-title'>from </div> 
                    <Input
                    placeholder='from'
                    onChange={formChanged}
                    name='from'
                    value={profileData.from}
                    />     
                </div> 
                <div className='error'></div>
            </div>

            <div  className='form-componrnt'>
                <div className='form-input'>  
                   <div className='form-input-title'>relationship </div> 
                    <InputNumber
                    placeholder='relationship'
                    min={0}
                    max={10}
                    onChange={formNumberChanged}
                    style={{
                      width: '100%',
                    }}
                    value={profileData.relationship}
                    />     
                </div> 
                <div className='error'></div>
            </div>
  
            <Button type="primary" className='update-button' onClick={!isLoading&&updateValue} 
              disabled={(passwordConfirmed&&!hideConfirmePAsswordButto)||disAbleUpdateButton||InValidEmail||emptyUsername}>
              {isLoading?<CircularProgress size={24} color="success"/>:"Update"}
            </Button>
            {errorOccured&&<Alert type="error" message="Error occured while romaning" banner />}
        </section>
        {beSurePage&&
         <section className='makeSure'>
           <Zoom>         
              <div className='makeSure-makeCenter'>
                  <div className='makeSure-makeCenter-icon'><Button  onClick={amNotSureToChanges} ><CloseOutlined  className='icon'/></Button></div>
                  <div>Are You sure on make changes?</div>
                  <div className='makeSure-button'>
                    <div><Button onClick={amSureToChanges} type="primary">yes</Button></div>
                    <div><Button onClick={amNotSureToChanges} type="primary" danger>no</Button></div>
                  </div>
              </div>
           </Zoom>
  
         </section>
        }
   </div>
    );
}

