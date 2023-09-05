import React, { useState } from 'react'
import { Alert, Button, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import EnterOtp from "./EnterOtp"
import {Fade, Zoom} from "react-reveal"
import axios from "axios"
import CircularProgress from '@mui/material/CircularProgress';
export default function RighSide() {
  const [loading,setLoading]=useState(false)
  let [otpValue,generateOtpValue]=useState("")
  let [enterOtp,setEnterOtpPage]=useState(false)
  let [passUsername,setPassUserName]=useState("")
  let [displayErrors,setErrors]=useState({
     serverRespond:"",
     networkError:"",
     otherErr:"Error ocuured"
  })
  let [otherErrs,setOtherErrors]=useState(false)
  const onFinish = async(values) => {
      setLoading(true)
    console.log(values);
    axios.get(`http://localhost:3450/userApi/generateOTP?username=${values.username.trim()}`)
      .then(function (response) {
      generateOtpValue(response.data.code)
      setPassUserName(values.username.trim())
      console.log(response.data)

        /**give otp to the receiver */
         axios.post(`http://localhost:3450/userApi/registerMail`,response.data,{
            headers: {
                authorization: ' xxxxxxxxxx' ,
                'Content-Type': 'application/json'
             } 
              })
              .then(function (response) {        
                console.log(response.data)
                setEnterOtpPage(true)
                setLoading(false)

              })
              .catch((error) => {
                console.log(error);
              })

    }).catch((error) => {
       setLoading(true)
      if (error.response) {
        console.log(error.response.data);
        alert(error.response.data.error)
        setErrors(e=>{
          return {...e,serverRespond:error.response.data.error}
        })
        setLoading(false)
        console.log("server responded");
      } else if (error.request) {
        console.log("network error");
        setErrors(e=>{
          return {...e,networkError:error.request.error}
        })
        setLoading(false)
        console.log(error.request);
      } else {
        setOtherErrors(true)
        console.log(error);
      }
    }); 
 }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
 
  return (
    <div className='bottom-forgetPassword-form'>
        <div style={{display:enterOtp&&"none"}}>
         <Zoom >
            <Form
            layout="vertical"
            name="basic"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <div className='bottom-forgetPassword-form-title'>username</div>
            <Form.Item
                label=""
                name="username"
                rules={[
                {
                    required: true,
                    message: 'Please enter your username!',
                },
                ]}
            >
              <Input size="middle"  prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                {loading?<CircularProgress size={24} color="success"/>:"reset"}
                </Button>
            </Form.Item>
            {(displayErrors.networkError||displayErrors.serverRespond||(otherErrs&&displayErrors.otherErr))&&<Alert type="error"  message=  {displayErrors.networkError||displayErrors.serverRespond||(otherErrs&&displayErrors.otherErr)}
             banner />}
            <Link href='/sign/signIn' style={{color:"white"}}>sign In</Link>
            </Form>
          </Zoom>
          </div>
       <div style={{display:!enterOtp&&"none",overflow:"hidden"}}>
       <Fade left>          
        <EnterOtp otpValue={otpValue} passUsername={passUsername}/>
       </Fade>
     </div>

        
    </div>
  )
}
