import React, { useEffect, useState } from 'react'
import Middle from '../middle'
import { Outlet, useLocation, useOutletContext, useParams } from 'react-router-dom';
import axios from "axios"
export default function AllChat({userData}) {
    let [chatData,setChatData]=useState([])
    let [errorWhileCatchingChatData,setErrorWhileCatchingChatData]=useState(false)
    useEffect(()=>{
        setErrorWhileCatchingChatData(true)
         axios.get(`http://localhost:1330/bullo/ChatApi/getUserChat/${userData?.data?._id}`, 
         {
            headers: {
                authorization:`Bearer ${userData.token}`,
                'Content-Type': 'application/json'
            } 
          })
         .then(res=>{
            setChatData(res.data.data)
            console.log(res.data.data)
            setErrorWhileCatchingChatData(false)
          })
          .catch(error=>{
            setErrorWhileCatchingChatData(true)
              if (error.response) {
                  console.log(error.response.data);
                  console.log("server responded");
              } else if (error.request) {
                console.log("network error, please connect to internate");
              } else {
                console.log(error);
              }  
          })
    },[userData])
   
   let param=useParams()
   let [updatedData,setUpdatedData]=useState([])

   let params=useLocation()
   let currentRoute=params.pathname.split("/")
   //console.log(currentRoute);
   useEffect(()=>{
    if(!errorWhileCatchingChatData){
        setUpdatedData(chatData.map(e=>{
          return {...e,clicked:currentRoute?.length===4&&(currentRoute[3]===e._id)}
        }))
    }
   },[errorWhileCatchingChatData])

   /*let[filterdData,sectFilterdData]=useState()
   useEffect(()=>{
    if(!errorWhileCatchingChatData){
        sectFilterdData(updatedData?.filter((obj, index) =>{
           return updatedData.findIndex((item) => item.id === obj.id) === index
          }
        ))       
    }
   },[updatedData,filterdData])
   
  */
 console.log(updatedData);
   return <Middle error={errorWhileCatchingChatData} data={updatedData} setData={setUpdatedData}  userData={userData} chatName={param.chatname}/>

  
}
