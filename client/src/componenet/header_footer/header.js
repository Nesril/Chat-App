import React, { useState,useEffect } from 'react'
import "../../styles/header_footer.css"
import {Input} from "antd"
import Icon, { ArrowRightOutlined, CloseOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { Button as Bu }  from '@mui/material';
import { Select } from 'antd';
import { UserOutlined,TeamOutlined,SearchOutlined    } from '@ant-design/icons'
import Link from 'antd/es/typography/Link';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import axios from 'axios';

const  Option =Select.Option

export default function Header({darkmode,setDarkmode,userData,setUserData}) {
 function darkModeClicked(){
  setDarkmode(!darkmode)
  let updateDarkmode={
    darkmode:!darkmode
  }
  let stringifyValue=JSON.stringify(updateDarkmode)
   axios.put(`http://localhost:1330/bullo/userApi/darkmode/${userData?.data?.username}`,stringifyValue,
    {
      headers: {
          authorization:`Bearer ${userData.token}`,
          'Content-Type': 'application/json'
       } 
     })
    .then(res=>{
       console.log(res.data);
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
 
 let[exploreInputValue,setExploreInputValue]=useState("")

 let [scrollEffect,setScrollEffect]=useState(false)
 let [scroly,setScroly]=useState(0)
useEffect(()=>{
 function handleScroll(){
   setScroly(window.scrollY)
  // console.log(scroly);
   if(scroly>200){
     setScrollEffect(true)
   }
   else{
     setScrollEffect(false)
   }
 } 
window.addEventListener("scroll",handleScroll)
},[scroly])
////////for menu bar
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
  setDisplayMenu(false)
};
const matchesRowHeader = useMediaQuery('(max-width:800px)');
const attainThousenPixel = useMediaQuery('(max-width:450px)');
const attainLastPixel = useMediaQuery('(max-width:350px)');
let [displayMenu,setDisplayMenu]=useState(false)
function menuClicked(){
  setDisplayMenu(!displayMenu)
}
const followeingItems=userData?.data?.followings?.map((e,index)=>{
  
  return {label:(<div><Link style={{color:"black"}} href={`/user/${e}`}>{e}</Link></div>),key:`${index+1}`}
})

const followersItems =userData?.data?.followers?.map((e,index)=>{
  return {label:(<div><Link style={{color:"brown"}} href={`/user/${e}`}>{e}</Link></div>),key:`${index+1}`}
})
////input
let [inputClicked,setInputClicked]=useState(false)
function exploreInputClicked(){
  setInputClicked(!inputClicked)
}
let [searchedValues,setSearchedValues]=useState([])
let [ErrorWhileSearching,setErrorWhileSearching]=useState()

let [filteredSearches,setFilteredSearches]=useState([])
function exploreValuesChaning(e){
  setInputClicked(true)
  setExploreInputValue(e.target.value)
  setErrorWhileSearching("search")
  axios.get(`http://localhost:1330/bullo/userApi/register`)
  .then(res=>{
    setSearchedValues(res?.data?.data?.user)
    //console.log(res?.data?.data?.user);
    let user=res?.data?.data?.user
    let SearchedFiltered=user.filter(e=>{
      return e.username.includes(exploreInputValue)||e.bulloName.includes(exploreInputValue)
    })
    setFilteredSearches(SearchedFiltered)
    setErrorWhileSearching("")
  })
  .catch(error=>{
    setErrorWhileSearching("error")
  })

}
useEffect(()=>{
 if(exploreInputValue===""||exploreInputValue===" "){
  setFilteredSearches([])
 }
},[exploreInputValue])
//console.log(filteredSearches,exploreInputValue);
let pro=userData?.data?.profilePicture
  return (
    <section  className={`header ${darkmode&&"darkedHEader"} ${scrollEffect&&"scrolledHeadder"}`}>
            <div className='header-left'> 
                  <div className={`closeInput ${inputClicked&&"closeInput-Clicked"}`}><CloseOutlined onClick={exploreInputClicked}/></div>
                  <div className={`header-left-bulloLogo ${inputClicked&&"exploreInput-Clicked"}`}>
                    <img src='/file/horse logo.jpg' alt='logo loading' width={100} height={100}/></div>
                  <div>
                   {!attainLastPixel&& 
                     <div><input placeholder='Explore' 
                          onClick={exploreInputClicked}
                          value={exploreInputValue}
                          onChange={exploreValuesChaning}
                          style={{ width:"150px"}}/>
                        </div>
                    }
                   <div className={`searchHistoryAndNewSearch ${inputClicked&&"searchHistoryAndNewSearchClicked"}`}>
                       <div  className={`searchHistoryText`}>
                             <div className={`searchHistoryText-input`}>`{exploreInputValue}`</div>
                              <div className='BulloNameUsername_SerachedValue'>
                                    <div>username</div>
                                    <div>bulloname</div>
                              </div>
                              {filteredSearches?.map((values,index)=>{
                                      if(index<4){
                                              if(userData?.data?.username===values.username){
                                                return(
                                                  <Link href={`/myprofile`}>
                                                    <div className='eachName_SerachedValue' key={index}>
                                                        <div><ArrowRightOutlined/> {values.username}</div>
                                                        <div>{values.bulloName}</div>
                                                    </div>
                                                  </Link>
                                                      )
                                                }   
                                        return(
                                                <Link href={`/user/${values.username}`}>
                                                  <div className='eachName_SerachedValue' key={index}>
                                                      <div><ArrowRightOutlined/> {values.username}</div>
                                                      <div>{values.bulloName}</div>
                                                  </div>
                                                </Link>
                                          )
                                      }
                                  })
                                }
                        </div>
                       {ErrorWhileSearching==="search"&&<div className={`searchHistoryProgress`} ><img src='/horsierun.gif' alt='...loading'/> </div>}
                       {ErrorWhileSearching==="error"&&<div className={`searchHistoryProgress`} style={{color:"red"}}>Error occured while searching</div>}
                    </div>
                </div>
            </div>
              {
                matchesRowHeader?
              <div className='header-left-short'>
               {!attainThousenPixel&&<Select defaultValue={"home"} className='customSelect ' dropdownStyle={{ backgroundColor: 'brown',color:"white" }}> 
                   <Option   value="home"  > 
                    <Link href="/">  <HomeOutlined/> Home</Link> 
                  </Option>   
                  <Option   value="myprofile" > 
                    <Link href="/myprofile"> <UserOutlined/>  Profile</Link> 
                  </Option>
                  <Option   value="Group" > 
                      <Link href="/Group"> <TeamOutlined/>  Group</Link> 
                  </Option>   
                  <Option   value="Setting" > 
                      <Link href="/setting"> <Settings style={{fontSize:"15px"}}/>  Setting</Link> 
                  </Option> 
                </Select>  } 
                <React.Fragment>
                 <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                  <Tooltip title="Account settings">
                    <Bu
                      style={{borderRadius:"50%"}}
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                        <div  onClick={menuClicked} onClose={handleClose} className={`avaterIconMinimizes ${displayMenu&&"menuClicked"}`} >
                          <div className='avaterIconMinimizes-bar1'></div>
                          <div className='avaterIconMinimizes-bar2'></div>
                       </div>
                    </Bu>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleClose}  >
                    <Link href='/myprofile' style={{fontSize:"18px", color:"black"}}> 
                    <span className='profile-short-namePic'>
                      <img src={pro[pro.length-1]} width={27} height={27}/></span> {userData?.data?.username}</Link>
                  </MenuItem>
                  <Divider/>
                   {!darkmode&&<Divider />}
                  {attainThousenPixel&&
                    <>
                      <MenuItem onClick={handleClose}
                      >
                         <ListItemIcon>
                          <HomeOutlined fontSize="small" />
                        </ListItemIcon>
                        <Link href='/' style={{color:"black"}}> Home</Link>
                    </MenuItem>

                    <MenuItem onClick={handleClose}
                      >
                        <ListItemIcon>
                          <TeamOutlined fontSize="small" />
                        </ListItemIcon>
                        <Link href='/setting/groupsOutline' style={{ color:"black"}}>Group</Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}
                      >
                        <ListItemIcon>
                          <Settings style={{fontSize:"15px"}}/>
                        </ListItemIcon>
                        <Link href='/setting' style={{color:"black"}}>Setting</Link>
                    </MenuItem>
                    <Divider/>
                    </>
                  } 
                  <MenuItem onClick={handleClose}
                      >
                        <Link href='/setting/follow' style={{color:"black"}}>Follwing/er</Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}
                      >
                        <Link href='/setting/Notification' style={{color:"black"}}>Notification</Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}
                      >
                        <Link href='/setting/memories' style={{color:"black"}}>Memories</Link>
                  </MenuItem>
                  <Divider/>
                  <MenuItem onClick={handleClose}
                   >
                      <DarkModeIcon id={darkmode?"whitemode":'darkmode'} onClick={darkModeClicked}/>
                  </MenuItem>
                 </Menu>
                </React.Fragment>
              </div>
                    :
            <div className='fullSizeHeader'>
              <div className='header-middell'>                
                    {!matchesRowHeader&&<div><DarkModeIcon id={darkmode?"whitemode":'darkmode'} onClick={darkModeClicked}/></div>}
                      <Select defaultValue={"home"} className='customSelect ' dropdownStyle={{ backgroundColor: 'brown',color:"white" }}> 
                        <Option   value="home"  > 
                          <Link href="/">  <HomeOutlined/> Home</Link> 
                        </Option>   
                        <Option   value="myprofile" > 
                          <Link href="/myprofile"> <UserOutlined/>  Profile</Link> 
                        </Option>
                        <Option   value="Group" > 
                            <Link href="/Group"> <TeamOutlined/>  Group</Link> 
                        </Option>   
                        <Option   value="Setting" > 
                            <Link href="/setting"> <Settings style={{fontSize:"15px"}}/>  Setting</Link> 
                        </Option> 
                    </Select> 
                    <div>  
                            <Dropdown
                              overlayStyle={{minWidth:"130px"}}
                              menu={{
                               items:followeingItems
                              }}
                              placement="bottomLeft"
                              arrow
                            >
                            <Button>Following</Button>
                          </Dropdown>
                    </div>
                    <div>  
                            <Dropdown
                            overlayStyle={{minWidth:"130px"}}
                              menu={{
                               items:followersItems
                              }}
                              placement="bottomLeft"
                              arrow
                            >
                            <Button>Followers</Button>
                          </Dropdown>
                    </div>
               </div>
                <div className='header-right'>
                    <div> <Button type='primary' shape="circle" icon={<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAVVJREFUSEvVlf0xBEEQR99FwEWACBABMiCCIwJEgAicCBABGTgRkAEiIAPqbU1vXU3t2K86Veav3a3u3+uv7Zmw4jNZsT45YB04BO4awMfAdfp+XrC5BObAV/jngFdgGzgCHpOR0FPgDPDZo4BCN0tiil8Aauw2AXRQ6APYSY4RdQjniQk6ScFoo/gGcAUIrEu0Cbwlb+kaKn7bsUdCLKuBvSSfLeA9ShTp3SdhgRqWIm/KREEzEjQD7NM8AAtgDzgAfA5gxwQqsyiLQ/IAPAP7AZC8BkxTFNHsPoBorll/Jp1pAL6TUv7eB7Dc01rvzwB5pBHB0Axqv9Kq+N+AmIK+5dE+prBYIsWf0h85BOCo+i+1Lrsh4uFTXHYaDG1uHlA9PPkUxcoYk0G1Ikr3wRjhRt+uV2bT8qt3/m9RdQWoIcQ7wuNKri6UttMH0KY1qkSDxHX6Acv7RRkBtaGUAAAAAElFTkSuQmCC"/>}/></div>
                    <div> <Button type='primary' shape="circle" icon={<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAVBJREFUSEu1lWtRA0EQhL8oIA6CBFAAUUChACSAAogCkJA4AAWAAkAB4AAUJNWp2dSwN1f7SGX+pG6z193T87gJB47JgfEpERwDF8A5cALoWfENfACvwLM9h1rHCKbAA3BdmeESuAV+8/sRgZS+ACJpCYHPLbPdezmBrBB4b4jk0qzbYngCKX53PveSqD6nyS5PcGO+9wL791SPxzwDdcRZgL6wyyq4Cq+Izvyrb9Z5/yxaj0hPWapFv+xOdBY2kLdIBToKSGTdCtDvnf0fnRUJxizqqUlo0b1T2ANaLLLaVOM/2xP9x9bKdqrzQdMUy6qoFjW8f9Y9EjoYtHSmaX7qIBmARxkkEtmlQbmqke26rGrZecyx2ZDPaV0rW62HMErfg5wgzcNA6b4E8lfDpb3fFDUZfNqHZ9cZLQwlAimW8mpLwn3Roqj1bimDVrzB/Q3XREEZbyk1tAAAAABJRU5ErkJggg=="/>}/></div>
                    <div className='profile-namePic'> 
                        <Link href='/setting'><div><img src={pro[pro.length-1]} width={27} height={27}/></div></Link>
                        <div  className='profile-namePic-name'>{userData?.data.username}</div>
                    </div>
                </div>

              </div> }
        
    </section>
  )
}
