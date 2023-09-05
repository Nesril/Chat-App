import React, { useState } from 'react'
import "./signUp.css"
import { Button, Checkbox, Select,Form, Input } from 'antd';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import {  KeyOutlined} from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import Zoom from 'react-reveal/Zoom';
import { Alert, Space } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Signup({getSigned,userData,setUserData}) {
  let[veriFyCode,setVerifyCode]=useState(false)
  let[code,setCode]=useState("")
  let [formData,setFormData]=useState()
  if(userData?.data?.username){
    axios.put(`http://localhost:1330/bullo/userApi/offlineUsers/${userData?.data?.username}`)
    .then(response=>{
     console.log("home updatd from signIn page ",response.data);
     setUserData({ data:{logged:false}})
    })
    .catch(error=>{
     if (error.response) {
       console.log(error);
       console.log("server responded from signUp page");
     } else if (error.request) {
       console.log("network error from signUp page");
     } else {
       console.log(error);
     }
    })
}
  const onFinish = async(values) => {
     axios.get("http://localhost:1330/bullo/userApi/generateOTP")
     .then(response=>{
      console.log(response.data)
      setVerifyCode(true)
      setFormData(values)
      setCode(response.data)
         let dataToBeEmailed={
          username:values.username,
          email:values.email,
          code:response.data.code
        }
         let stringfyDataToBeEmailed=JSON.stringify(dataToBeEmailed)
         console.log(stringfyDataToBeEmailed);
          axios.post(`http://localhost:1330/bullo/userApi/registerMail`,stringfyDataToBeEmailed, //proxy uri
          {
             headers: {
                authorization: ' xxxxxxxxxx' ,
                'Content-Type': 'application/json'
             } 
          })
              .then(response=>{
                console.log(response.data)
                })
              .catch((error) => {
                console.log(error)
                if (error.response) {
                  console.log(error.response.data);
                  alert(error.response.data.msg)
                  console.log("server responded");
                } else if (error.request) {
                  console.log("network error");
                } else {
                  console.log(error);
                }
                })

   }).catch((error) => {
    setVerifyCode(false)
   // setCode("")
   console.log(error);
    if (error.response) {
      console.log(error.response.data);
      alert(error.response.data.msg)
      console.log("server responded");
    } else if (error.request) {
      console.log("network error");
    } else {
      console.log(error);
    }
    })
 
 }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
 let [submitClicked,setSubmitClicked]=useState(false)
 function submitd(){
  setSubmitClicked(true)
 }
 let  navigate=useNavigate()
 let [input_value,setInput_value]=useState("")
 let [errorOfOTPEnter,setErrorOfOTPEnter]=useState()
 let [successImage,setSuccessImage]=useState()
 function otpSubmitted(e){
   let inputCode={code:input_value}
   let strigfyCode=JSON.stringify(inputCode)
   if(e.key==="Enter"){
     try{
      console.log(strigfyCode,code);  
      axios.get(`http://localhost:1330/bullo/userApi/verifyOTP/${input_value}`)
           .then(response=>{
             console.log("successfully verified",response.data)
              
             let stringfiedRegistrationvalues=JSON.stringify(formData)
             axios.post(`http://localhost:1330/bullo/userApi/register`,stringfiedRegistrationvalues, //proxy uri
                 {
                   headers: {
                       authorization: ' xxxxxxxxxx' ,
                       'Content-Type': 'application/json'
                   } 
                 })
                 .then(response=>{
                  setVerifyCode(false)
                  alert(response.data.msg)
                   console.log(response.data)
                   getSigned(true)
                   setUserData(response.data)
                   navigate("/sign/signIn")
                 })
                 .catch((error) => {
                 // setCode("")
                   if (error.response) {
                     console.log(error.response.data);
                     setErrorOfOTPEnter(error.response.data.msg)
                     alert(error.response.data.msg)
                     console.log("server responded");
                   } else if (error.request) {
                     console.log("network error");
                   } else {
                     console.log(error);
                   }
                   })

           //  setInput_value("")
           }).catch((error) => {
              // setInput_value("")
             
               if (error.response) {
                 console.log("server responded");
                 console.log(error.response.data);
                setErrorOfOTPEnter(error.response.data.error)
               } else if (error.request) {
                 console.log("network error");
                 setErrorOfOTPEnter("network error")
               } else {
                 console.log(error);
               }
               })
    }
    catch{
        console.log("time Out");
    }

     }
 }
 const enterOtpPage=()=>{
  setVerifyCode(false)
  setErrorOfOTPEnter("")
  setInput_value("")
 }
  return (
    <div className='signUp'>
      <div className='signUpChilde'>
         <div className='rightSideLogo'><img src="/file/horse logo.jpg" width={100} height={100} role="presentation" /></div>
         <h2  className='rightSideTitle'>BULLO </h2>
         <div>Create account</div>
         <section>
            <Form
              layout="vertical"
              name="basic"
              labelCol={{
                span: 80,
              }}
              wrapperCol={{
                span: 80,
              }}
              style={{
                Width:800,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
        >
        <div className='eachInput'>       
          <Form.Item
                label=""
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please enter username!',
                  },
                ]}
              >
              <Input size="middle" placeholder='enter username' prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
                label=""
                name="email"
                rules={[
                  {
                    required: true,
                    type:"email",
                    message: 'Please enter valid email!',
                  },
                ]}
              >
              <Input size="middle"  placeholder='enter email'  prefix={<UserOutlined />} />
            </Form.Item>
      </div>
      <div className='eachInput'>
           <Form.Item
                label=""
                name="bulloName"
               
              >
              <Input size="middle" placeholder='enter bullo Name' prefix={<UserOutlined />}/>
            </Form.Item>
     </div>
      <div className='eachInput'>
            <Form.Item
        name="password"
        label=""
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password  placeholder='enter password'  size="middle"  prefix={<KeyOutlined />}/>
      </Form.Item>
     
      <Form.Item
        name="confirm"
        label=""
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password  placeholder='confirm password' size="middle"  prefix={<KeyOutlined />}/>
      </Form.Item>

      </div>
     
              <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit" onClick={submitd}>
                   Create
                </Button>
              </Form.Item>
          </Form>
           <div>
              <Link href='/sign/signIn'>{!submitClicked?"already have an account":"Sign In"}</Link>
          </div>
       </section>
     </div>
     {veriFyCode&&
      <section className='makeSure'>
      <Zoom>         
         <div className='makeSure-makeCenter'>
             <div className='makeSure-makeCenter-icon'><Button  onClick={enterOtpPage} ><CloseOutlined  className='icon'/></Button></div>
             <div style={{color:"black",marginBottom:"20px"}}>Enter Verification code that we have sent you in your email</div>
              <div><Input value={input_value}  onKeyPress={otpSubmitted} onChange={(e)=>setInput_value(e.target.value)}/></div>
              <div className='enterCodeSignUp'><Button onClick={otpSubmitted}>Enter</Button></div>
              {errorOfOTPEnter&&<Alert message={errorOfOTPEnter} type="error" showIcon />}
         </div>
      </Zoom>

    </section>
      }
    </div>
  )
}
