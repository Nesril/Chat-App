import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "../styles/user.css"
import Header from './header_footer/header';
import axios from 'axios';
import PageNotFound from './pageNotFound';
import EachProfile from './more/eachProfile';
export default function User({userData,setUserData,darkmode,setDarkmode}) {
    let searchParams = useParams();
    console.log(searchParams);
    let [currrentUserData,setCurrrentUserData]=useState([])
    let [loading,setLoading]=useState(false)
    let [pageExisit,setPageExist]=useState(false)
    useEffect(()=>{
      if(currrentUserData.length<1){
        setLoading(true)
      }
      setLoading(true)
      setPageExist(false)
       axios.get(`http://localhost:1330/bullo/userApi/user/${userData?.data.username}?otherUsers=${searchParams.username}`)
       .then(response=>{
        console.log("userdata",response.data);
        setLoading(false)
        setPageExist(false)
        setCurrrentUserData(response.data)
       })
       .catch(error=>{
        setPageExist(false)
        setLoading(false)
        if (error.response) {
          console.log(error.response.data);
          setPageExist(true)
         console.log("server responded");
        } else if (error.request) {
          console.log("network error");
          setLoading(true)
        } else {
          console.log(error);
          setLoading(true)
        }
       })
    },[searchParams.username,userData])

    
  return (
    <div>
       <Header userData={userData} setUserData={setUserData} darkmode={darkmode} setDarkmode={setDarkmode}/>
       {pageExisit?
         <div>
            <PageNotFound type={"user"}/>
          </div>
               :
      (
        loading?
         <div className='loadingUser'>
            <img src='/load2.webp' alt='...loading'/>
         </div>
             :
        <div className='userPage'> 
            <EachProfile darkmode={darkmode} setDarkmode={setDarkmode}
             userData={userData} setUserData={setUserData} type={"otherUser"} 
             data={currrentUserData} setData={setCurrrentUserData}/>
        </div>
        )
          }
    </div>
  )
}
