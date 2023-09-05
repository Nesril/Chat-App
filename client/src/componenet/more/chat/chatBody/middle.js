import { Divider, Input } from 'antd'
import React, { useState } from 'react'
import MiddleLeftBelloHead from './middleLeftBelloHead'
import { Outlet, useLocation } from 'react-router-dom'
import { CircularProgress, LinearProgress } from '@mui/material'
export default function Middle({data,setData,userData,error}) {
  let pro=userData?.data?.profilePicture
  let filterClickeckdChat=data.filter(e=>{
   return e.clicked===true
  })
  //console.log("filterClickeckdChat",filterClickeckdChat);
  let [searchValue,setSearchValue]=useState("")
  const handleSearch=(e)=>{
   setSearchValue(e.target.value)
  }
  let searchedData=data.filter(e=>{
   return e?.users[0].username?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
  })
 // console.log(data);
  return (
  <div className='middle'>
    <section className='middle-left'>
         <div className='middle-left-head'>
            <div className='middle-left-head-usernameProfile'>
               <div>{userData.data.username}</div>
               <div><img src={pro[pro.length-1]} style={{borderRadius:"100px"}} width={50} height={50}/></div>
            </div> 
            <div className='middle-left-head-bulloName'>{userData.data.bulloName}</div>
            <div><Input placeholder="search" width={30} value={searchValue} onChange={handleSearch}/></div>
         </div>
         <Divider/>
         <div className='middle-left-chatList'>
             {error?
             <div><LinearProgress/></div>:
               <div>
                  {searchedData?.map(ele=>{
                       return <MiddleLeftBelloHead userData={userData} data={ele} setData={setData}/>
                  })}
                  {searchedData.length<1&&
                  <div className='middle-left-chatList-nochatList'>
                      <div><img src='/Bullo_chat_20230518_124626019.png' alt='no chat...' width={60}/></div>
                     <div>No chat availeble</div>
                  </div>
                  }
              </div>
             }
         </div>
    </section>
    <section className='middle-middle'>
       <Outlet/>  
       {filterClickeckdChat.length<1&&
       <div className='middle-middle-waitiing'>
          <div className='middle-middle-waitiing-blur'>
              <div>
                  <h2> No chat is available</h2>
              </div>
           </div>
       </div>}
    </section>
    <sction className='middle-right'>
      {/** right side */}
    </sction>
  </div>
  )
}
