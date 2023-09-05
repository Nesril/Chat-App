import Input from 'antd/es/input/Input'
import React, { useEffect, useState } from 'react'
import { EyeTwoTone } from '@ant-design/icons'
import { EyeInvisibleOutlined } from '@ant-design/icons'
import { Alert, Button } from 'antd'
import FinishedPage from './FinishedPage'
import { Bounce, Jump } from 'react-reveal'
import axios from 'axios'
export default function UpdatePassword({passUsername}) {
  let [updatedPAssword,setUpdatedPAssword]=useState({
    password:"",
    confirmedPassword:""
  })
  let [passwordConfirmed,setPasswordConfirmed]=useState(false)
  useEffect(()=>{
    if(updatedPAssword.confirmedPassword!==updatedPAssword.password){
      setPasswordConfirmed(true)
    }
    else {
      setPasswordConfirmed(false)
    }
  },[updatedPAssword.confirmedPassword,updatedPAssword.password])
  function formChanged(element){

    setUpdatedPAssword(e=>{
      return {
        ...e,
        [element.target.name]:element.target.value
      }
    })
  }
  let [displayErrors,setErrors]=useState({
    serverRespond:"",
    networkError:"",
    otherErr:"Error ocuured"
 })
 let [otherErrs,setOtherErrors]=useState(false)
  let [viewFinishedPage,goToFinishedPage]=useState(false)
  function PasswordIsSent(){
    if(!passwordConfirmed&&updatedPAssword.password){
       console.log(updatedPAssword.password);
       let values={
          username:passUsername,
          password:updatedPAssword.password
        }
        let stringfyValue=JSON.stringify(values)
       console.log(stringfyValue);
       axios.put("http://localhost:3450/userApi/resetPassword",stringfyValue,{
          headers: {
            authorization: ' xxxxxxxxxx' ,
            'Content-Type': 'application/json'
         } 
          })
       .then(response=>{
         goToFinishedPage(true)
         console.log(response.data);
       })
      .catch(error=>{
        if (error.response) {
          console.log(error.response.data);
          alert(error.response.data.error)
          setErrors(e=>{
            return {...e,serverRespond:error.response.data.msg}
          })
         // setLoading(false)
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
          setErrors(e=>{
            return {...e,networkError:error.request.msg}
          })
         // setLoading(false)
          console.log(error.request);
        } else {
          setOtherErrors(true)
          console.log(error);
        }
      })
    }
  }
  let [disableUpdate,onDisableButton]=useState(false)
  useEffect(()=>{
    if(updatedPAssword.password.length<6||updatedPAssword.password!==updatedPAssword.confirmedPassword){
      onDisableButton(false)
    }
    else{
      onDisableButton(false)
    }
  },[updatedPAssword])

  return (
  <div>
    <div style={{display:viewFinishedPage&&"none"}}>
      <div className='form-componrnt' >
              <div  className='form-component-title'>Password</div>
              <div className='form-input'>  
                <Input.Password
                onChange={formChanged}
                name='password'
                value={updatedPAssword.password}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />     
              </div> 
              <div className='error'></div>
          </div>

          <div className='form-componrnt'>
              <div className='form-component-title'>Confirm Password</div>
              <div className='form-input'>  
                <Input.Password
                onChange={formChanged}
                name='confirmedPassword'
                value={updatedPAssword.confirmedPassword}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />     
              </div> 
              <div className='error'>{passwordConfirmed&&"Password is not confirmed"}</div>
          </div>
          <div>
          {(displayErrors.networkError||displayErrors.serverRespond||(otherErrs&&displayErrors.otherErr))&&<Alert type="error"  message=  {displayErrors.networkError||displayErrors.serverRespond||(otherErrs&&displayErrors.otherErr)}
             banner />}
             <Button type='primary' disabled={disableUpdate} onClick={PasswordIsSent}>update</Button>
          </div>
    </div>
    <div style={{display:!viewFinishedPage&&"none",overflow:"hidden"}}>
      <Bounce top>        
          <FinishedPage/>
       </Bounce>
     </div>

   </div>
  )
}
