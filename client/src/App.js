import React, { useEffect, useState } from "react";
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./componenet/sign/signIn/signIn";
import SignUp from "./componenet/sign/signUp/signup"
import ForgrtPassword from "./componenet/sign/forget/forgetPAasword"
import Home from "./componenet/home";
import Profile from "./componenet/profile";
import Setting from "./componenet/setting";
import Group from "./componenet/group.js/mygroup"
import Notification from "./componenet/nottification"
import Following from "./componenet/following"
import Followers from "./componenet/follower"
import All from "./componenet/All";
import EditProfile from "./componenet/editProfile";
import Chat from "./componenet/more/chat/chat";
import Freinds from"./componenet/more/freinds"
import Memories from"./componenet/more/memories"
import Saved from"./componenet/more/saved"
import GroupsOutline from"./componenet/more/groups"
import Follow from "./componenet/more/follow"
import SettingPage from "./componenet/settingPage";
import axios from "axios";
import User from "./componenet/user"
import PageNotFound from "./componenet/pageNotFound";
import NotificationChat from "./componenet/more/chat/chatBody/middle/nottification"
import SettingChat from "./componenet/more/chat/chatBody/middle/setting"
import MakeChat from "./componenet/more/chat/chatBody/middle/message/makeChat"
import AllGroups from "./componenet/more/chat/chatBody/middle/allGroups"
import AllUsers from "./componenet/more/chat/chatBody/middle/allUsers"
import AllChat from "./componenet/more/chat/chatBody/middle/allChat"
import ProfileOfChat from "./componenet/more/chat/chatBody/middle/profile"
function App() {
      let [userData,setUserData]=useState(JSON.parse(localStorage.getItem("user"))||{
      data:{logged:false},
      })
     let [darkmode,setDarkmode]=useState(userData?.data?.darkmode==="true"?true:false)
     let [signed,getSigned]=useState(userData.data?.logged)
      useEffect(()=>{ 
        try{
          localStorage.setItem("user",JSON.stringify(userData))
        }
        catch{
          console.log(localStorage);
         }
        
      },[userData])
     // console.log(userData)
     
      useEffect(()=>{
          if(userData?.data?.username&&signed){
              let nameValue={
                username:userData?.data?.username
              }
              axios.get(`http://localhost:1330/bullo/userApi/user/${nameValue.username}?otherUsers=${nameValue.username}`,
              {
                headers: {
                    authorization: ' xxxxxxxxxx',
                    'Content-Type': 'application/json'
                } 
              })
              .then(response=>{
              // console.log("user gotten",response.data);
                setUserData(response.data)
              })
              .catch(error=>{
                console.log("can't get user")
                if (error.response) {
                  console.log(error.response.data);
                  console.log("server responded");
                } else if (error.request) {
                  console.log("network error",error.request);
                } else {
                  console.log(error);
                }  
                  
              })
            }
      },[darkmode])

      return (
        <BrowserRouter>
        <section className={`main ${darkmode&&"darkedMain"}`}>
          {signed?
              <Routes>
                  <Route path='/' element={<All darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}>
                      <Route path='' element={<Home darkmode={darkmode} userData={userData} setUserData={setUserData}/>}/>
                      <Route path='followers' element={<Followers userData={userData} setUserData={setUserData}/>}/>
                      <Route path='following' element={<Following userData={userData} setUserData={setUserData}/>}/>
                      <Route path='Notification' element={<Notification userData={userData} setUserData={setUserData}/>}/>
                  </Route>
                  <Route path='user/:username' element={<User darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}/>
                  <Route path='myprofile' element={<Profile darkmode={darkmode} setDarkmode={setDarkmode}userData={userData} setUserData={setUserData}/>}/>
                  <Route path='setting' element={<Setting darkmode={darkmode} setDarkmode={setDarkmode}userData={userData} setUserData={setUserData}/>}>
                      <Route path='' element={<SettingPage darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}/>
                      <Route path='freinds' element={<Freinds darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}/>
                      <Route path='editProfile' element={<EditProfile darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}/>
                      <Route path='memories' element={<Memories darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}/>
                      <Route path='saved' element={<Saved darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}/>
                      <Route path='groupsOutline' element={<GroupsOutline darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}/>
                      <Route path='Notification' element={<Notification userData={userData} setUserData={setUserData}/>}/>
                      <Route path='follow' element={<Follow userData={userData} setUserData={setUserData}/>}/>
                  </Route>
                  <Route path='chat' element={<Chat darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}>
                      <Route path='setting' element={<SettingChat userData={userData} setUserData={setUserData}/>}/>
                      <Route path='notification' element={<NotificationChat userData={userData} setUserData={setUserData}/>}/>
                      <Route path='profile' element={<ProfileOfChat userData={userData} setUserData={setUserData}/>}/>
                      
                      <Route path='' element={<AllChat darkmode={darkmode} userData={userData} setUserData={setUserData}/>}>
                          <Route path='message/:chatname' element={<MakeChat darkmode={darkmode} userData={userData} setUserData={setUserData}/>}/>
                      </Route>
                      
                      <Route path='groups' element={<AllGroups userData={userData} setUserData={setUserData}/>}>
                           <Route path='message/:chatname' element={<MakeChat darkmode={darkmode} userData={userData} setUserData={setUserData}/>}/>
                      </Route>
                      
                      <Route path='users' element={<AllUsers userData={userData} setUserData={setUserData}/>}>
                               <Route path='message/:chatname' element={<MakeChat darkmode={darkmode} userData={userData} setUserData={setUserData}/>}/>
                      </Route>
                  </Route>
                  <Route path='Group' element={<Group darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} setUserData={setUserData}/>}/>
                  <Route path='sign/signIn' element={<SignIn getSigned={getSigned} userData={userData} setUserData={setUserData}/>}/>
                  <Route path='sign/signUp' element={<SignUp getSigned={getSigned} userData={userData} setUserData={setUserData}/>}/>
                  <Route path='sign/forget' element={<ForgrtPassword userData={userData} setUserData={setUserData}/>}/>
                  <Route path='*' element={<PageNotFound type={"Page"} removeHeader={true}/>}/>
              </Routes>
            :
            <Routes>
                  <Route path='sign/signIn' element={<SignIn getSigned={getSigned} userData={userData} setUserData={setUserData}/>}/>
                  <Route path='sign/signUp' element={<SignUp getSigned={getSigned} userData={userData} setUserData={setUserData}/>}/>
                  <Route path='sign/forget' element={<ForgrtPassword/>} userData={userData} setUserData={setUserData}/>
                  <Route path='/' element={<SignIn getSigned={getSigned} userData={userData} setUserData={setUserData}/>}/>
                  <Route path='*' element={<PageNotFound type={"Page"} removeHeader={true}/>}/>
              </Routes>
            }
          </section>
        
      </BrowserRouter>
        );
      }

export default App;

/**
 *   useEffect(()=>{
        if(userData?.data?.username&&signed){
            let nameValue={
              username:userData?.data?.username
            }
            axios.get(`http://localhost:1330/bullo/userApi/user/${nameValue.username}?otherUsers=${nameValue.username}`,
            {
              headers: {
                  authorization: ' xxxxxxxxxx' ,
                  'Content-Type': 'application/json'
              } 
            })
            .then(response=>{
             // console.log("user gotten",response.data);
              setUserData(response.data)
            })
            .catch(error=>{
              console.log("can't get user")
              if (error.response) {
                console.log(error.response.data);
                console.log("server responded");
              } else if (error.request) {
                console.log("network error",error.request);
              } else {
                console.log(error);
              }  
                
            })
          }

      },[userData])
      
 */