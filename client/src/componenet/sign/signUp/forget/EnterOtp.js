import React, { useEffect, useState } from 'react'
import { Alert, Button, Checkbox, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {  KeyOutlined} from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import { Zoom } from 'react-reveal';
import UpdatePassword from "./updatePassword"
import CircularProgress from '@mui/material/CircularProgress';

export default function RighSide({otpValue,passUsername}) {
  const [loading,setLoading]=useState(false)
  const [verified,setVerified]=useState(false)
  let [displayErrors,setErrors]=useState({
    serverRespond:"",
    networkError:"",
    otherErr:"Error ocuured"
 })
 let [otherErrs,setOtherErrors]=useState(false)
  const onFinish = async(values) => {
      setLoading(true)
      console.log(values,otpValue)
      axios.get(`http://localhost:3450/userApi/verifyOTP?code=${values.code.trim()}`)
      .then(function (response) {
        setLoading(false)
       setVerified(true)
       console.log(response.data)
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
         <div style={{display:verified&&"none"}}>            
        <h3 style={{fontSize:"15px",marginBottom:"20px"}}>Enter OTP That wehave sent You on your email</h3>
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
            <div className='bottom-forgetPassword-form-title'>OTP</div>
            <Form.Item
                label=""
                name="code"
                style={{maxWidth:220}}
                rules={[
                {
                    required: true,
                    message: 'Please enter OTP that we send You in your email',
                },
                ]}
            >
            <Input size="middle" placeholder='OTP' prefix={<UserOutlined />} />
            </Form.Item>
            {(displayErrors.networkError||displayErrors.serverRespond||(otherErrs&&displayErrors.otherErr))&&<Alert type="error"  message=  {displayErrors.networkError||displayErrors.serverRespond||(otherErrs&&displayErrors.otherErr)}
             banner />}            
             <Form.Item
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                {loading?<CircularProgress size={24} color="success"/>:"enter"}
                </Button>
           
            </Form.Item>
            </Form>
            <div >
              Still Don't get ?
                <Button type="text" style={{fontSize:"15px"}} >
                    <Link style={{color:"red"}} href='/sign/signIn/forgetPassword'>resend</Link>
                </Button>
              </div>
    </div>
    <div style={{display:!verified&&"none",overflow:"hidden"}}>
        <Zoom>          
          <UpdatePassword otpValue={otpValue} passUsername={passUsername}/>
       </Zoom>
     </div>

    
    </div>
  )
}
