import React, { useEffect } from 'react'
import Header from './header_footer/header'
import { Outlet, useNavigate } from 'react-router-dom'
import Home from './home'
import "../styles/all.css"
import Left_body from './body/left_body'
import Right_body from './body/right_body'
import BodyHomeTop from './body/bodyHomeTop';

export default function All({darkmode,setDarkmode,setOptimizer,userData,setUserData}) {
  let navigate=useNavigate()
  useEffect(()=>{
     if(!userData?.data?.logged){
      navigate("/sign/signIn")
     }
  },[])
  return (
  <div>
    <Header darkmode={darkmode} setDarkmode={setDarkmode} setOptimizer={setOptimizer} userData={userData} setUserData={setUserData}/>
     <div className='top-carousal'><BodyHomeTop userData={userData} /></div> 
     <div className='body'>
        <div  className='left-body'><Left_body userData={userData} setUserData={setUserData}/></div>
        <div  className='meiddle-body'><Outlet userData={userData} setUserData={setUserData}/></div>
        <div  className='right-body'><Right_body userData={userData} setUserData={setUserData}/></div>
    </div>
 </div>
  )
}
