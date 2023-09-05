import React,{useState,useEffect} from 'react'
import { Button,CircularProgress } from 'antd'
import axios from 'axios'
import Link from 'antd/es/typography/Link'
export default function Follow({userData,setUserData}) {
  let [otherErrs,setOtherErrors]=useState("")

let [followingsFromData,getFollowingsFromData]=useState([])
let [followersFromData,getFollowersFromData]=useState([])
let [error_occured,setErrorOccured]=useState(false)
  let name= userData?.data?.username
  useEffect(()=>{
    setInterval(()=>{
        axios.get(`http://localhost:1330/bullo/userApi/following/${name}`)
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

    },5000)

    setInterval(()=>{
      axios.get(`http://localhost:1330/bullo/userApi/followers/${name}`)
      .then(response=>{
        setOtherErrors("")
        console.log(response.data);
        getFollowersFromData(response.data)
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

  },5000)
  },[name])

  let nameCurrent={
    username:userData?.data?.username
  }
  let stringfyNAme=JSON.stringify(nameCurrent)
  let[loadingWhilenfollowing,setLoadingWhilenfollowing]=useState(false)
  return (
  <div className='followFollowingsetting'>
    <h1>My Freinds</h1>
    <div className='follow'>
        <div className='follow-seting'>
            <h3>Followings</h3>
            {followingsFromData.length<1&&<div>no followings</div>}
            {followingsFromData?.map(e=>{
               function unfolowUser(name){
                setLoadingWhilenfollowing(false)
                axios.put(`http://localhost:1330/bullo/userApi/unfollow/${name}`,stringfyNAme,{
                  headers: {
                      authorization: `Bearer ${userData?.token}`,
                      'Content-Type': 'application/json'
                  } 
                })
                .then(res=>{
                  console.log(res.data);
                  setUserData(res.data)
                  setLoadingWhilenfollowing(false)
                })
                .catch((error) => {
                  setLoadingWhilenfollowing(true)
                    if (error.response) {
                      console.log(error.response.data);
                      console.log("server responded");
                    } else if (error.request) {
                      console.log("network error");
                    } else {
                      console.log("other error occured");
                      
                    }
                    })

                }
              return(
              <div className='following-seting'> 
                  <Link href={`/user/${e.username}`}>
                    <div className='following-seting-imageName'>
                        <img src={e.profilePicture[e.profilePicture.length-1]} alt='cant fin picture'/>
                        <div>
                            <div className='following-seting-userNAme'>{e.username}</div>
                            <div className='following-seting-blloName'>{e.bulloName}</div>
                        </div>
                    </div>
                  </Link>
                  <Button type='primary'onClick={()=>unfolowUser(e.username)}>unfollow</Button>
              </div>
              )
            })}
        </div>
        <div className='follow-seting'>
            <h3>Followers</h3>
            {followersFromData.length<1&&<div>no followers</div>}
            {followersFromData?.map(e=>{
              function deleteFollower(name){
                setLoadingWhilenfollowing(false)
                axios.put(`http://localhost:1330/bullo/userApi/deleteFollowers/${name}`,stringfyNAme,{
                  headers: {
                      authorization: `Bearer ${userData?.token}`,
                      'Content-Type': 'application/json'
                  } 
                })
                .then(res=>{
                  console.log(res.data);
                  setUserData(res.data)
                  setLoadingWhilenfollowing(false)
                })
                .catch((error) => {
                  setLoadingWhilenfollowing(true)
                    if (error.response) {
                      console.log(error.response.data);
                      console.log("server responded");
                    } else if (error.request) {
                      console.log("network error");
                    } else {
                      console.log("other error occured");
                      
                    }
                    })

                }
              return(
              <div className='following-seting'> 
                 <Link href={`/user/${e.username}`}>
                    <div className='following-seting-imageName'>
                        <img src={e.profilePicture[e.profilePicture.length-1]} alt='cant fin picture'/>
                        <div>
                            <div className='following-seting-userNAme'>{e.username}</div>
                            <div className='following-seting-blloName'>{e.bulloName}</div>
                        </div>
                    </div>
                  </Link>
                  <Button type='primary' onClick={()=>deleteFollower(e.username)}>Delete folower</Button>
              </div>
              )
            })}


        </div>
        {(!followersFromData||!followingsFromData)&&
        <div className='loadingUser-freind'>
          <img src='/load2.webp' alt='...loading' />
        </div>}
    </div>
  </div>
  )
}
