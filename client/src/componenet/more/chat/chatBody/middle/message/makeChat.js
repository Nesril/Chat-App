import { Box, Menu, MenuItem, Tooltip, fabClasses } from '@mui/material'
import { Button, Divider, Dropdown, Input } from 'antd';
import { Button as Bu }  from '@mui/material';
import React, { createRef, useEffect, useRef, useState } from 'react'
import { CircularProgress, LinearProgress, TextField } from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import TextArea from 'antd/es/input/TextArea';
import SendIcon from '@mui/icons-material/Send';
import EachChat from './eachChat';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import data from '@emoji-mart/data'
import Picker from 'emoji-picker-react';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Link, useLocation } from 'react-router-dom';
import axios from "axios"
import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FitbitIcon from '@mui/icons-material/Fitbit';
import ShareIcon from '@mui/icons-material/Share';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {CloseSquareOutlined} from '@ant-design/icons';
export default function MakeChat({userData,darkmode}) {

let inputRef=createRef()  
const [anchorEl, setAnchorEl] = React.useState(null);
let [displayMenu,setDisplayMenu]=useState(false)
const [currentEmoji,setCurrentEmoji]=useState(null)
let params=useLocation()
let currentRoute=params.pathname.split("/")
const open = Boolean(anchorEl);
let [toTop,gotoTOp]=useState(false)

const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
let option=[
  {icon:<StarBorderIcon/>,id:1},
  {icon:toTop?<KeyboardDoubleArrowDownIcon/>:<KeyboardDoubleArrowUpIcon/>,id:2},
  {icon:<ShareIcon/>,id:3},
  {icon:<FitbitIcon/>,id:4},
  {icon:<DeleteIcon/>,id:5},
    
]

const handleClose = (id) => {
  setAnchorEl(null);
  setDisplayMenu(false) 
  if(id===2) gotoTOp(!toTop)
};

useEffect(()=>{
  if(toTop) {gotoTOp(false)}
 // console.log(toTop);
},[params])


let [newMessage,createNewMessage]=useState("")
let [vissiblePicker,makeEmjiPickerVissible]=useState(false)
const [currentPosition, setcurrentPosition] = useState();

function handleChangeMessage(e){
  let {value}=e.target
  let ref=inputRef.current 

  createNewMessage(value)
  console.log(ref,ref.selection);

}

const pickEmoji = (emojiObject) => {
  let {emoji}=emojiObject
 // createNewMessage(prev=>prev+emoji)
 let ref=inputRef.current 
  ref.focus()
  let start=newMessage.substring(0,ref.selectionStart)
  let end=newMessage.substring(ref.selectionStart)
  let text = start+emoji;
   createNewMessage(text);
   console.log(ref,ref.selection);
};
//console.log(newMessage);

const showEmojiPicker=()=>{
  inputRef.current.focus()
  makeEmjiPickerVissible(!vissiblePicker)
}

let [sampleMessage,setSampleMessage]=useState([{
   sender:"abebe",
   content:"Psiphon is a is a circumvention tool from the developer Psiphon Inc. that uses VPN, SSH, and HTTP Proxy technology so that you can have uncensored access to ...",
 },{
  sender:userData?.data?.username,
  content:"Psiphon is a is a circumvention tool from the developer Psiphon Inc. that uses VPN, SSH, and HTTP Proxy technology so that you can have uncensored access to ...",
}
,{
  sender:"abebe",
  content:"are you okay",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:"abebe",
  content:"yh, u",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:"abebe",
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
},{
  sender:userData?.data?.username,
  content:"hello",
}])


useEffect(()=>{
  //console.log(currentPosition);
  inputRef.current.selectionEnd=currentPosition
},[currentPosition])


let [messageData,getMessageData]=useState([])
let [errorWhileGettinggMessages,getErrorWhileGettinggMessages]=useState(false)
let [messageIsNotFound,setMessageIsNotFound]=useState(false)
//console.log(currentRoute[currentRoute.length-1]);


///get all messages
useEffect(()=>{
  getErrorWhileGettinggMessages(true)
  setMessageIsNotFound(false)
  axios.get(`http://localhost:1330/bullo/MessageApi/getChatMessage/${currentRoute[currentRoute.length-1]}`, 
  {
     headers: {
         authorization:`Bearer ${userData.token}`,
         'Content-Type': 'application/json'
     } 
   })
  .then(res=>{
    console.log(res.data.data);
    getMessageData(res.data.data);
    getErrorWhileGettinggMessages(false)
    setMessageIsNotFound(false)

  })
  .catch(error=>{
    getErrorWhileGettinggMessages(true)
    setMessageIsNotFound(true)
      if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
      } else if (error.request) {
        console.log("network error, please connect to internate");
      } else {
        console.log(error);
      }  
  })
},[params])


let [userOnChat,getUsersOnChat]=useState()
let [IsGroupChat,setIsGroupChat]=useState(false)
let [errorOnuserOnChat,getErrorOnUsersOnChat]=useState(false)

// get users of that chat except u
useEffect(()=>{
  getErrorOnUsersOnChat(true)
  setMessageIsNotFound(false)
  axios.get(`http://localhost:1330/bullo/ChatApi/getAllUsersOfSingleCha?chatId=${currentRoute[currentRoute.length-1]}&&currentUserId=${userData?.data?._id}`, 
  {
     headers: {
         authorization:`Bearer ${userData.token}`,
         'Content-Type': 'application/json'
     } 
   })
  .then(res=>{
    console.log(res.data.data);
    getUsersOnChat(res.data.data);
    setIsGroupChat(res.data.chatProfile);
    getErrorOnUsersOnChat(false)
    setMessageIsNotFound(false)

  })
  .catch(error=>{
    setMessageIsNotFound(true)
    getErrorOnUsersOnChat(true)
      if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
      } else if (error.request) {
        console.log("network error, please connect to internate");
      } else {
        console.log(error);
      }  
  })
},[params])
//console.log(messageData);

let [errorWhenSending,makeErrorWhenSending]=useState(false)
const handleSend=()=>{
  makeErrorWhenSending(true)
  let url="http://localhost:1330/bullo/MessageApi/createMessage"
  let NewMessage={
    chatId:currentRoute[currentRoute.length-1],
    content:newMessage,
    currentUserId:userData?.data._id
  }
  let stringftyValue=JSON.stringify(NewMessage)
  axios.post(url,stringftyValue,{
        headers: {
          authorization:`Bearer ${userData.token}`,
          'Content-Type': 'application/json'
      }  
  })
  .then(res=>{
   // console.log(res.data.data);
    getMessageData(e=>[...e,res.data.data]);
    makeErrorWhenSending(false)
  })
  .catch(error=>{
    makeErrorWhenSending(true)
      if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
      } else if (error.request) {
        console.log("network error, please connect to internate");
      } else {
        console.log(error);
      }  
  })
 
  setSampleMessage(element=>[...element,NewMessage])
  //console.log(date.getHours(),date.getMinutes());
  createNewMessage("")
  makeEmjiPickerVissible(false)
}

//goto lastmessaage
const containerRef = useRef(null);
useEffect(() => {
  if(containerRef && containerRef.current) {
    const element = containerRef.current;
    element.scroll({
      top:toTop?0:element.scrollHeight,
      left: 0,
      behavior: "smooth"
    })
  }
}, [containerRef,currentRoute,messageData])

//show profile of user
let[showProfileOfUser,getShowProfileOfUser]=useState(false)
let[currentShowingUserProfile,getCurrentShowingUserProfile]=useState({user:[],message:[]})
const handleProfileChat=()=>{
  getShowProfileOfUser(true)
  getCurrentShowingUserProfile({user:userOnChat,message:messageData})
}
console.log(currentShowingUserProfile);
  return (
    <div className="makeChat">
     {(errorWhileGettinggMessages||errorOnuserOnChat)? 
      <div className='middle-middle-waitiing'>
        <div className='middle-middle-waitiing-blur'>
            <div>
                {messageIsNotFound?
                  <div style={{fontSize:"20px"}}>message of chat id:<span style={{fontSize:"15px"}}>{currentRoute[currentRoute.length-1]}</span> is not found</div>
                :
                <>
                  <h2>Getting messages ...</h2>
                  <div><img src="/load2.webp" width={30} height={30} alt='...loading'/></div>
                </>
              }
            </div>
          </div>
      </div>
      :<>
        {IsGroupChat?
          <>
            <section className="makeChat-header">
                <div className="makeChat-header-left">
                    <div><img src='/file/horse1.jpg'/></div>
                    <div className="makeChat-header-left-names">
                      <div className="makeChat-header-left-username">Bechere</div>
                      <div className="makeChat-header-left-bulloName">bulloName</div>
                    </div>
                    <div className="makeChat-header-left-lastSeen">
                        lastSeen recent
                    </div>
                </div>
                <React.Fragment>
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                      <Tooltip title="chat settings">
                        <Button
                          style={{background:"none",border:"none"}}
                          onClick={handleClick}
                          size="large"
                          sx={{ ml: 2 }}
                          aria-controls={open ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAG9JREFUSEtjZKAxYKSx+QwjywIHBgaG+dAgTWRgYDhATPCSEkQPGBgY5KGGgtiK1LbgAwMDAz/U0IcMDAwK1LYAFEQLoIYm0CKIiHEwhhpS4oDmFoymIoJBPJqKiAqi0bIIbzCNpiKCqYgsBTQvTQFNkxgZM6/25AAAAABJRU5ErkJggg=="/>
                        </Button>
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
                      {option.map(e=>{
                        return(
                        <MenuItem onClick={()=>handleClose(e.id)}>
                           {e.icon}
                        </MenuItem>
                        )
                      })}
                    </Menu>
                </React.Fragment>
            </section>
            <section className='makeChat-body'>
                <div className='makeChat-body-allChat'>
                  {sampleMessage.map(e=>{
                    return<div > <EachChat sender={userData.data.username} message={e}/></div>
                  })}
                </div>
                {vissiblePicker&&
                      <div  className="emoji-picker" >
                          <EmojiPicker onEmojiClick={pickEmoji} />
                      </div>
                 }
                <div className='makeChat-body-addChat'>
                    <div className='emoji-Button'>
                      <Button shape='circle' onClick={showEmojiPicker}><EmojiEmotionsIcon/></Button> 
                    </div>
                    <TextArea
                    ref={inputRef}
                    autoFocus={true}
                    autoSize={{
                      minRows:1,
                      maxRows: 2,
                    }}
                    value={newMessage}
                    onChange={handleChangeMessage}
                    onClick={()=>makeEmjiPickerVissible(false)}
                    placeholder="maxLength is 6" 
                    />
                    <div className='send-Button'><Button  onClick={handleSend}  shape='circle'><SendIcon/></Button></div>
                    <div className='file-Button'><Button onClick={()=>alert("file")}  shape='circle'><AttachFileIcon /></Button></div>
                  
                  <div>
                    {/**send icon emoji picture  */}</div>
                </div>
            </section>
          </>
          :
          <>
              <section className="makeChat-header">
                  <div className="makeChat-header-left">
                      <div  onClick={handleProfileChat}><img src={userOnChat?.profilePicture[userOnChat.profilePicture.length-1]}/></div>
                      <div className="makeChat-header-left-names" onClick={()=>handleProfileChat(userOnChat,messageData)}>
                        <div className="makeChat-header-left-username">{userOnChat?.username}</div>
                        <div className="makeChat-header-left-bulloName">{userOnChat?.bulloName}</div>
                      </div>
                      <div className="makeChat-header-left-lastSeen">
                          lastSeen recent
                      </div>
                  </div>
                  <React.Fragment>
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                      <Tooltip title="chat settings">
                        <Button
                          style={{background:"none",border:"none"}}
                          onClick={handleClick}
                          size="large"
                          sx={{ ml: 2 }}
                          aria-controls={open ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAG9JREFUSEtjZKAxYKSx+QwjywIHBgaG+dAgTWRgYDhATPCSEkQPGBgY5KGGgtiK1LbgAwMDAz/U0IcMDAwK1LYAFEQLoIYm0CKIiHEwhhpS4oDmFoymIoJBPJqKiAqi0bIIbzCNpiKCqYgsBTQvTQFNkxgZM6/25AAAAABJRU5ErkJggg=="/>
                        </Button>
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
                      {option.map(e=>{
                        return(
                        <MenuItem onClick={()=>handleClose(e.id)}>
                           {e.icon}
                        </MenuItem>
                        )
                      })}
                    </Menu>
                  </React.Fragment>
              </section>
              <section className='makeChat-body'>
                  <div  ref={containerRef} className={`makeChat-body-allChat ref`}>
                    {/**map over all message */}
                    {messageData.map(e=>{
                      return <div ><EachChat sender={userData.data.username} message={e}/></div>
                    })}
                    
                      {/**when there is no message b/n them*/}
                    {messageData?.length<1&&
                      <div className='makeChat-body-noMessages'>
                          <div className='makeChat-body-noMessages-title'> No messages yet</div>
                          <div className='makeChat-body-noMessages-sayHi'> say Hi !!</div>
                      </div>}
                  </div>
                  {vissiblePicker&&
                        <div  className="emoji-picker" >
                            <EmojiPicker onEmojiClick={pickEmoji} />
                        </div>
                            }
                  {errorWhenSending&&<LinearProgress color='secondary'/>}
                  <div className='makeChat-body-addChat'>
                      <div className='emoji-Button'>
                        <Button shape='circle' onClick={showEmojiPicker}><EmojiEmotionsIcon/></Button> 
                      </div>
                      <TextArea
                          ref={inputRef}
                          autoFocus={true}
                          autoSize={{
                            minRows:1,
                            maxRows: 2,
                          }}
                          value={newMessage}
                          onChange={handleChangeMessage}
                          onClick={()=>makeEmjiPickerVissible(false)}
                          placeholder="message" 
                      />
                      <div className='send-Button'><Button  onClick={handleSend}  shape='circle'><SendIcon/></Button></div>
                      <div className='file-Button'><Button onClick={()=>alert("file")}  shape='circle'><AttachFileIcon /></Button></div>
                    
                    <div>
                      {/**send icon emoji picture  */}</div>
                  </div>
              </section>
          </>
          }
        </>
        }
        {showProfileOfUser&&
        <section className='profileOfChat'>
            <div className='profileOfChat-toppers'>
                  <div className='profileOfChat-profilePicture'>
                      <div><img src={currentShowingUserProfile.user.profilePicture[currentShowingUserProfile.user.profilePicture.length-1]} alt='profile Picture' width={50}/> </div>
                      <div><CloseSquareOutlined id='close-icon' onClick={()=>getShowProfileOfUser(false)}/></div>
                  </div>
                  <div className='profileOfChat-names'>
                      <div className='profileOfChat-names-each'>
                        <div className='profileOfChat-names-username-title'>username</div>
                        <div className='profileOfChat-names-username-name'> {currentShowingUserProfile.user.username}</div>
                      </div>
                      <div className='profileOfChat-names-each'>
                        <div className='profileOfChat-names-bullloName-title'>bullo-name</div>
                        <div className='profileOfChat-names-bullloName-name'> {currentShowingUserProfile.user.bulloName}</div>
                      </div>
                      <div className='profileOfChat-names-each'>
                        <div className='profileOfChat-names-email-title'>email</div>
                        <div className='profileOfChat-names-email-name'> {currentShowingUserProfile.user.email}</div>
                      </div>
                  </div>
                  <div className='profileOfChat-more'>
                    <Link to={`/user/${currentShowingUserProfile.user.username}`}>see more</Link>
                  </div>
            </div>
            <div className='profileOfChat-botttom'>
               <div className='profileOfChat-imagesVideos'>
                   <div className='profileOfChat-images'>shared images</div>
                   {currentShowingUserProfile.message[0].images.length<1?
                    <div className='profileOfChat-noimages'>no shared images</div>:
                    <div className='profileOfChat-Allimages'>
                          {currentShowingUserProfile?.message.map(e=>e.images.map(src=>{
                            return <img src={`/uploads/${src}`} width={50}/>
                          }))}
                    </div>
                  }
             </div>
            </div>
         </section>}
    </div>
  )
}
