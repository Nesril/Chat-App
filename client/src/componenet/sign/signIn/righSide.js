import React, { useEffect, useState } from 'react'
import { Alert, Button, Checkbox, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {  KeyOutlined} from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
  useNavigate,
} from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
export default function RighSide({getSigned,userData,setUserData}) {
 const [circularProgress,makeCircularProgress]=useState(false)

 let [otherErrs,setOtherErrors]=useState("")
 let navigate=useNavigate()
 
  const onFinish = async(values) => {

    console.log('success:', values);
    let stringfyValue=JSON.stringify(values)
        makeCircularProgress(true)
        setOtherErrors("")
        axios.post('http://localhost:1330/bullo/userApi/logIn',stringfyValue, //proxy uri
          {
            headers: {
              authorization: ' xxxxxxxxxx' ,
              'Content-Type': 'application/json'
            } 
        })
        .then(response=>{
        setOtherErrors("")
        console.log(response.data)
        makeCircularProgress(false)
        getSigned(true)
        setUserData(response.data)
        navigate("/")
        })
        .catch(error=>{
        makeCircularProgress(false)
        if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
          setOtherErrors(error.response.data.msg)
        } else if (error.request) {
          console.log("network error");
          setOtherErrors("network Error")
        } else {
          console.log(error);
          setOtherErrors("try again Error Occured")
        }
        })

  
 }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    setOtherErrors("")
  };
 
  return (
    <div className='rightSide'>
         <div className='rightSideLogo'><img src="/file/horse logo.jpg" width={500} height={500} role="presentation" /></div>
         <h2  className='rightSideTitle'>BULLO</h2>
         <section className='rightSide-form'>
         <Form
              layout="vertical"
              name="basic"
              labelCol={{
                span: 58,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                Width:700,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
        >
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
                <Input size="middle" placeholder='username' prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                  label=""
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your password!',
                    },
                  ]}
                >
                  <Input.Password size="middle" placeholder="password" prefix={<KeyOutlined />} />       
              </Form.Item>
              <div className='forget-remember'>
                    <Form.Item  wrapperCol={{
                        offset: 28,
                        span: 100,
                      }}>
                              <Link href="/sign/forget" >
                                  Forget Password
                                </Link> 
                    </Form.Item>
                    
                    <Form.Item
                      name="remember"
                      valuePropName="checked"
                      wrapperCol={{
                        offset: 28,
                        span: 100,
                      }}
                    >
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
              </div>
              <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                 {circularProgress?<CircularProgress/>:  <Button type="primary" htmlType="submit">
                    sign in
                  </Button>}
              </Form.Item>
              {otherErrs&&<Alert message={otherErrs} type="error" showIcon />}
       </Form>
       <div>
          <Link href='/sign/signUp'>Sign up</Link>
       </div>
   </section>
      
    </div>
  )
}
/**import { Button, Checkbox, Form, Input } from 'antd';
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const App = () => (
  <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

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
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);
export default App; */