import React, { useEffect, useState } from 'react'
import "../styles/setting.css"
import DarkModeIcon from '@mui/icons-material/DarkMode';
import EditIcon from '@mui/icons-material/Edit';
import GradeIcon from '@mui/icons-material/Grade';
import Groups2Icon from '@mui/icons-material/Groups2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import useMediaQuery from '@mui/material/useMediaQuery';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Button } from '@mui/material';
import Link from 'antd/es/typography/Link';
import { Outlet } from 'react-router-dom';
import Settings from '@mui/icons-material/Settings';

export default function Setting ({darkmode,setDarkmode}){
  function darkModeClicked(){
    setDarkmode(!darkmode)
   }
   let [minimiseBar,setminimiseBar]=useState(false)
   function barMinimizd(){
    setminimiseBar(!minimiseBar)
   }

const matchesRowHeader = useMediaQuery('(max-width:600px)');
let [removeArrow,setRemoveArrow]=useState(false)
useEffect(() => {
  if(matchesRowHeader){
    setminimiseBar(true)
    setRemoveArrow(true)
   }
   else setRemoveArrow(false)

}, [matchesRowHeader])

 
   return (
    <div className={`settingPage`}>
       <div className={`rightSideOf-settingPage ${darkmode&&"darkedSettingPage"} ${minimiseBar&&"minimizedSettingPage"}`}>
                <div><DarkModeIcon id={darkmode?"whitemode":'darkmode'} onClick={darkModeClicked}/></div>
                <div className={`rightSideOf-settingPage-head ${minimiseBar&&"min-rightSideOf-settingPage-head"}`}>
                  <div><img src='/file/horse logo.jpg' alt='..' width={50} height={50}/></div>
                  <div> Bullo</div>
                </div>
               <div className='rightSideOf-settingPage-list'>
                    <Link href='/setting/editProfile'><div><EditIcon style={{color:"green"}}/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>Edit</span></div></Link>    
                    <Link href='/setting/saved'><div><GradeIcon style={{color:"goldenrod"}}/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>Saved</span></div></Link>  
                    <Link href='/setting/groupsOutline'> <div><Groups2Icon/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>My groups</span></div></Link>  
                    <Link href='/setting/memories'>  <div><VisibilityIcon style={{color:"blueviolet"}}/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>Memories</span></div></Link>
                    <Link href='/setting/Notification'>  <div><CircleNotificationsIcon style={{color:"rgb(167, 27, 27)"}}/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>Nottifications</span></div></Link>
                    <Link href='/setting/follow'>  <div><PeopleAltIcon/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>Follow ers/ings</span></div></Link>
                    <Link href='/myprofile'>  <div><PersonPinIcon style={{color:"rgb(117, 32, 32)"}}/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>Profile</span></div></Link>
                    <Link href='/'> <div><HomeIcon/> <span style={{display:minimiseBar&&"none"}}  className='rightSideOf-settingPage-list-name'>Home</span></div></Link>
                    <Link href='/chat'>  <div><ChatIcon style={{color:"white"}}/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>Chat</span></div></Link>
                    <Link href='/setting'>  <div><Settings style={{color:"white"}}/> <span style={{display:minimiseBar&&"none"}} className='rightSideOf-settingPage-list-name'>Setting</span></div></Link>
                </div>    
                <div>
                  {!removeArrow&&<Button id="keyArrowButton">
                    <KeyboardArrowRightIcon className={`normal ${minimiseBar?"toRight":"toLeft"}`} onClick={barMinimizd}/>
                    </Button> }
                </div>            
       </div>
       <div className='leftSideOf-settingPage'>
         <div style={{color:darkmode&&"white"}} className={`leftSideOf-settingPage-inside ${!minimiseBar&&"min-leftSideOf-settingPage-inside"}`}>
             <Outlet/>
         </div>
       </div>
    </div>
  )
}
