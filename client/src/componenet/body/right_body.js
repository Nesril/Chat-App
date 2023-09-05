import React, { useState,useEffect } from 'react'
import { Button, Divider } from '@mui/material';
import CircleIcon from "@mui/icons-material/Circle"
import axios from 'axios';
import { Skeleton } from 'antd'
import Link from 'antd/es/typography/Link';
export default function Right_body({userData,setUserData}) {
  let [scrollEffect,setScrollEffect]=useState(false)
 let [scroly,setScroly]=useState(0)
 let followings= userData?.data?.username

useEffect(()=>{
 function handleScroll(){
   setScroly(window.scrollY)
  // console.log(scroly);
   if(scroly>1700){
     setScrollEffect(true)
   }
   else{
     setScrollEffect(false)
   }
 } 
window.addEventListener("scroll",handleScroll)
},[scroly])
const [circularProgress,makeCircularProgress]=useState(false)
let [otherErrs,setOtherErrors]=useState("")

let [followingsFromData,getFollowingsFromData]=useState([])
let [error_occured,setErrorOccured]=useState(false)

  useEffect(()=>{
        axios.get(`http://localhost:1330/bullo/userApi/following/${followings}`)
        .then(response=>{
          setOtherErrors("")
          console.log(response.data);
          getFollowingsFromData(response.data)
          setErrorOccured(false)
        })
        .catch(error=>{
          setErrorOccured(true)
          if (error.response) {
            //console.log(error.response.data);
            //console.log("server responded");
            setOtherErrors(error.response.data.msg)
          } else if (error.request) {
           // console.log("network error");
            setOtherErrors("network Error")
          } else {
           // console.log(error);
            setOtherErrors("try again Error Occured")
          }
    })

  },[followings,userData])

  let skeletetlDuringError=[1,2,3,4,5]
   //console.log(followingsFromData.map(e=>e.online.includes(true)));
   let [countOnlines,setCountOnlines]=useState([])
   let [checkCountLine,setCheckCountLine]=useState(false)
   useEffect(()=>{
    setCountOnlines(followingsFromData.map(activeUsersNames=>{
      //console.log(activeUsersNames.online);
      if(activeUsersNames.online){
        return 1
      }
     return 0
    }))
    if(countOnlines.includes(1)) setCheckCountLine(true)
    else setCheckCountLine(false)

},[countOnlines,userData])

 //  console.log(checkCountLine);
  return (
    <div className='right_body'>
       <div className='right_body-alif'>
           <div className='right_body-alifVideo'>
             <video width={50} autoPlay loop>
                <source src='alif3.mp4' type='video/mp4'/>
             </video>
          </div>
          <div className='right_body-alif-name'>Alif Developers</div>
          <div className='right_body-alif-member'> 
             <div>300,000 <span style={{fontSize:"12px"}}>members</span></div>
             <div>200 <span style={{fontSize:"12px"}}>post/day</span></div>
          </div>
          <Button>
              Join Community
          </Button>
       </div>
       {followingsFromData.length>0&& 
       <div className='right_body-followings'>
           <div className='right_body-followings-name'>Following</div>
              {followingsFromData.map(freind=>{
                let Index_profilePic=freind?.profilePicture.length-1
                let profilePic=freind?.profilePicture[Index_profilePic]
                return(
              <Link href={`/user/${freind.username}`} style={{color:"black",fontWeight:"600",fontSize:"16px"}}>
                <div className='right_body-profile-name'>
                    <div className='right_body-profile'>
                        <img src={profilePic} alt='cant find the image'
                        width={50} height={50}/>
                    </div>
                    <div className='right_body-nameActive'>
                        <div className='right_body-name'>{freind.username}</div>
                        <div className='right_body-active'>Last active withn a week</div>
                    </div>
                </div>
              </Link>
                  )
                })}
       </div>}
        
        <div className={`right_body-activeUsers ${scrollEffect&&"scroledUp-activeUsers"}`}>
           <h2 className='right_body-activeUsers-name'>Active Users</h2> 
           {(followingsFromData.length<1&&!error_occured)&&
               <div className='right_body-activeUsers-noActivesers'>No freinds</div>
            }
            {error_occured?
                  <>
                     {skeletetlDuringError?.map(activeUsersNames=>{
                        return(
                      <div className='right_body-activeUsers-profile'>
                           <div className='right_body-activeUsers-profile-imageAndOnline'>
                                 <Skeleton.Avatar  size={"large"} shape={"circle"} />
                                 <div> <CircleIcon style={{fontSize:"18px",position:"relative",top:"-20px",left:"20px"}} /></div>
                           </div>
                           <div> <Skeleton.Avatar  size={"large"} shape={"default"} /></div>                    
                     </div>
                          

                        )
                     })}
                  </>
             : 
                  <>
                       { 
                        checkCountLine?
                        <>
                            {followingsFromData.map(activeUsersNames=>{
                               let Index_profilePic=activeUsersNames?.profilePicture.length-1
                               let profilePic=activeUsersNames?.profilePicture[Index_profilePic]
                              return(
                                <>
                                  {activeUsersNames?.online&&
                                    <Link href={`/user/${activeUsersNames.username}`} style={{color:"black",fontWeight:"600",fontSize:"16px"}}>  
                                      <div className='right_body-activeUsers-profile'>
                                          <div className='right_body-activeUsers-profile-imageAndOnline'>
                                                  <img src={profilePic} alt='cant find the image'
                                                      width={50} height={50}/>  
                                                    <div> <CircleIcon style={{fontSize:"18px",color:"green",position:"relative",top:"-20px",left:"20px"}} /></div>
                                              </div>
                                              <div>{activeUsersNames.username}</div>                    
                                        </div>
                                    </Link>  
                                    }
                                </>
                                )
                               })
                              }

                            </>
                           :
                            <div className='right_body-activeUsers-noActivesers'>No Active user</div>
                       }
                        
                  </>
           }
       </div>
    </div>
  )
}
