import React, { useState,useEffect } from 'react'
import axios from 'axios';
import "../../styles/body.css"
import { Button } from 'antd';
import { Skeleton } from 'antd'
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'antd/es/typography/Link';
import uuid from "uuid"
export default function Left_body({userData,setUserData}) {
   let [currentUser,getCurrentUser]= useState(userData?.data?.username)
   let [followersFromData,getFollowersFromData]=useState([])
   let [oneThatFollowingExistHere,values_oneThatFollowingExistHere]=useState([])
   let [error_occured,setErrorOccured]=useState(false)
   let [stablizerCount,setstablizerCount]=useState(0)
  useEffect(()=>{
      axios.get(`http://localhost:1330/bullo/userApi/following/${currentUser}`)
      .then(response=>{
      values_oneThatFollowingExistHere(response.data)
        setErrorOccured(false)
      })
      .catch(error=>{
         setErrorOccured(true)

     })
    axios.get(`http://localhost:1330/bullo/userApi/followers/${currentUser}`)
     .then(response=>{
       getFollowersFromData(response.data)
        setErrorOccured(false)
      })
     .catch(error=>{
        setErrorOccured(true)
   
       })  
  },[currentUser,stablizerCount])
  const [active, setActive] = useState(false);
  const [block, setBlock] = useState(false);
let skeletetlDuringError=[1,2,3,4,5]
let myprofilePic_index=userData?.data?.profilePicture?.length-1
let myprofilePic=userData?.data?.profilePicture[myprofilePic_index]
let [dataFollowings,getdataFollowings]=useState([])
let [dataFollowers,getdataFollowers]=useState([])
useEffect(()=>{
  //console.log("followers",followersFromData,"followings",oneThatFollowingExistHere);
   for(let memberOfFollowings of oneThatFollowingExistHere){
      getdataFollowings(e=>[...e,memberOfFollowings.username])
     }
      for(let memberOfFollowers of followersFromData){
         getdataFollowers(e=>[...e,memberOfFollowers.username])
      }
 //console.log(dataFollowers,dataFollowings);
},[currentUser,oneThatFollowingExistHere,followersFromData])
let [val,setval]=useState([])
useEffect(()=>{
    for(let memberOfFollowings of dataFollowers){
        console.log(dataFollowings,memberOfFollowings);
        if (!dataFollowings.includes(memberOfFollowings)){
         setval(e=>[...e,memberOfFollowings])
        }  
         
    }
    
 },[dataFollowers,dataFollowings,currentUser])

 let [unique,setUniqueValue]=useState(null)
 useEffect(()=>{
    setUniqueValue(val.filter((element,index)=>{
      return val.indexOf(element)===index
    }))

 },[val,currentUser])
 
 let [newData,getNewData]=useState([])

 function axioFunction(name){
   let currrentNAme={
      username:userData?.data.username
   }
   let stringfyVAlue=JSON.stringify(currrentNAme)
   axios.get(`http://localhost:1330/bullo/userApi/user/bullo?otherUsers=${name}`,stringfyVAlue)
          .then(response=>{            
            getNewData(e=>[...e,response?.data?.data])
            })
          .catch(error=>{
            if (error.response) {
               console.log(error.response.data);
               console.log("server responded");
             } else if (error.request) {
               console.log("network error");
             } else {
               console.log("other error");
             }
          })
 }
 
 useEffect(()=>{
    if(unique){
         for(let nameUser of unique){
            if(nameUser) axioFunction(nameUser)
         }
    }
},[unique,currentUser])

const [UniqueValues,setUniqueValues]=useState(null)

useEffect(()=>{
   setUniqueValues(newData.reduce((accumulator, current) => {
      if (!accumulator.find((item) => item.username === current.username)) {
        accumulator.push(current);
      }
      return accumulator;
    }, []))
},[newData,userData])

console.log(UniqueValues,unique)

let [errorOccuredWhileFollowing,setErrorOccuredWhileFollowing]=useState(false)



return (
    <section className='leftSideBody'>
        <div className='leftSideBody-profile'>
           <div className='leftSideBody-coverPic'><img src={userData?.data?.coverPicture}width={150} height={50}/></div>
           <Link href='/myprofile'><div className='leftSideBody-profPic'><img src={myprofilePic}width={150} height={50}/></div></Link>     
           <div className='leftSideBody-name'>
              <div className='bulloName'>{userData.data.username}</div>
              <div className='userName'>{userData.data.bullName}</div>
           </div>
           <div className='leftSideBody-following-follower'>
              <div className='leftSideBody-followings'>
                  <div className='leftSideBody-followings-number'>{ error_occured? <CircularProgress size={20}/>:userData?.data?.followings?.length}</div>
                  <div className='leftSideBody-f-name'>Followings</div>
              </div>
              <div className='leftSideBody-followersa'>
                  <div className='leftSideBody-followers-number'>{ error_occured? <CircularProgress size={20}/>:followersFromData?.length}</div>
                  <div className='leftSideBody-f-name'>Followers</div>
              </div>
           </div>
             <Link href='/myprofile'><Button >My profile</Button></Link> 
        </div>
        <div className='leftSideBody-community'>
            <div className='leftSideBody-community-header'>
               <div className='leftSideBody-community-name'>My community</div>
               <Button type='text'>26</Button>
            </div>
            <div className='leftSideBody-community-frequentlyVisitedByYou'>
               <div><img src="/file/horse2.jpg" alt='..loading' width={30} height={30}/></div>
               <div className='leftSideBody-community-frequentlyVisitedByYou-name'>
                  <div id='name'> Horse Gowing</div>
                  <div id='member'> 880 members</div>
               </div>
            </div>
            <div className='leftSideBody-community-frequentlyVisitedByYou'>
               <div><img src="/file/horse2.jpg" alt='..loading' width={30} height={30}/></div>
               <div className='leftSideBody-community-frequentlyVisitedByYou-name'>
                  <div id='name'> Horse Gowing</div>
                  <div id='member'> 880 members</div>
               </div>
            </div>
            <div className='leftSideBody-community-frequentlyVisitedByYou'>
               <div><img src="/file/horse2.jpg" alt='..loading' width={30} height={30}/></div>
               <div className='leftSideBody-community-frequentlyVisitedByYou-name'>
                  <div id='name'> Horse Gowing</div>
                  <div> 880 members</div>
               </div>
            </div>
        </div>   
        <div className='leftSideBody-followers'>
             <div className='leftSideBody-followers-header'>
               <div className='leftSideBody-community-name'>Recomanded freinds</div>
               <Button type='text'>{UniqueValues?.length}</Button>
            </div>
            {(UniqueValues?.length<1&&!error_occured)&&
               <div className='leftSideBody-followers-noFollowers'>
                  No followers availeble
              </div>
            }
            {error_occured?
                  <>
                     {skeletetlDuringError?.map(followers=>{
                 
                        return(
                           <div className='leftSideBody-followers-pro'>
                              <div className='leftSideBody-followers-imageName'>
                                 <div> <Skeleton.Avatar  size={"large"} shape={"circle"} /></div>
                              </div>
                              <div> <Skeleton.Avatar  size={"large"} shape={"default"} /></div>
                           </div>
                        )
                     })}
                  </>
             : 
                  <>
                        {UniqueValues?.map((followers,index)=>{
                            
                               let Index_profilePic=followers?.profilePicture?.length-1
                              let profilePic=followers?.profilePicture[Index_profilePic]
                              function userIsFollowing(name) {
                                 let nameCurrent={
                                    username:userData?.data?.username
                                  }
                                  setErrorOccuredWhileFollowing(true)
                                  let stringfyNAme=JSON.stringify(nameCurrent)
                                  console.log(dataFollowings);
                                 axios.put(`http://localhost:1330/bullo/userApi/follow/${name}`,stringfyNAme,{
                                    headers: {
                                        authorization: `Bearer ${userData?.token}`,
                                        'Content-Type': 'application/json'
                                    } 
                                    })
                                    .then(res=>{
                                       setErrorOccuredWhileFollowing(false)
                                        console.log(res.data);
                                       setUserData(res.data);
                                       getCurrentUser(res.data.data.username)
                                       getdataFollowings(e=>[...e,followers.username])
                                       console.log(res.data.data.followers);

                                    })
                                    .catch((error) => {
                                        setErrorOccuredWhileFollowing(true)
                                        if (error.response) {
                                          console.log(error.response.data);
                                          console.log("server responded");
                                        } else if (error.request) {
                                          console.log("network error");
                                        } else {
                                          console.log(error);
                                        }
                                       })
                              }
                              function userUnFollowing(name){
                                 console.log(dataFollowings,name);
                                  
                                 if(dataFollowings.length>0){
                                  
                                    getdataFollowings(item=>{
                                      let updated= item.filter(each=>{
                                          console.log(`${each}`);
                                          return each!==name})
                                     return updated
                                    })
                                 }
                                 else{
                                    getdataFollowings([])
                                 }


                                 let nameCurrent={
                                    username:userData?.data?.username
                                  }
                                  setErrorOccuredWhileFollowing(true)
                                  let stringfyNAme=JSON.stringify(nameCurrent)
                                  console.log(name,stringfyNAme);
                                 axios.put(`http://localhost:1330/bullo/userApi/unfollow/${name}`,stringfyNAme,{
                                    headers: {
                                        authorization: `Bearer ${userData?.token}`,
                                        'Content-Type': 'application/json'
                                    } 
                                    })
                                    .then(res=>{
                                       setErrorOccuredWhileFollowing(false)
                                        console.log(res.data);
                                       setUserData(res.data);
                                       getCurrentUser(res.data.data.username)
                                       console.log(res.data.data.followers);
                                    })
                                    .catch((error) => {
                                        setErrorOccuredWhileFollowing(true)
                                        if (error.response) {
                                          console.log(error.response.data);
                                          console.log("server responded");
                                        } else if (error.request) {
                                          console.log("network error");
                                        } else {
                                          console.log(error);
                                        }
                                       })
                              }
                              //console.log(dataFollowings,dataFollowings?.includes(followers.username),followers?.username);
                              console.log(dataFollowings);  
                           return(
                              <div className='leftSideBody-followers-pro' key={index}>
                                 <Link href={`/user/${followers?.username}`} style={{color:"black",fontWeight:"600",fontSize:"16px"}}>
                                    <div className='leftSideBody-followers-imageName'>
                                       <div><img src={profilePic} alt='..loading' width={30} height={30}/></div>
                                       <div>{followers?.username}</div>
                                    </div>
                                 </Link>
                                 {!(dataFollowings?.includes(followers.username))?
                                 <>
                                    {errorOccuredWhileFollowing?<CircularProgress size={20}/>:<Button type='primary' onClick={()=>userIsFollowing(followers?.username,index)}>Follow</Button>}
                                 </>:
                                 <>
                                    {errorOccuredWhileFollowing?<CircularProgress size={20}/>:<Button type='primary' onClick={()=>userUnFollowing(followers?.username,index)}>unfollow</Button>}
                                 </>}
                              </div>
                           )
                        })}
                       
                  </>
           }
         
        </div>
    </section>
  )
}
