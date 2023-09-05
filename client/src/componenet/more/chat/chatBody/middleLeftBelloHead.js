import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ForwardIcon from '@mui/icons-material/Forward';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useLocation, useParams } from 'react-router-dom';
import moment from "moment"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
export default function MiddleLeftBelloHead({data,userData,setData}) {
    //console.log("MiddleLeftBelloHead",data);

   const [anchorEl, setAnchorEl] = useState(null);
   const [isSeen, setIsSeen] = useState(false);
 const open = Boolean(anchorEl);
 const handleClick = (event) => {
   setAnchorEl(event.currentTarget);
 };
 const ITEM_HEIGHT = 48;
 
     let option=[
       {icon:<EditIcon/>,id:1},
       {icon:<ForwardIcon/>,id:2},
       {icon:<AddBoxIcon/>,id:3},
       {icon:<DeleteSweepIcon/>,id:4},
         
 ]
     function handleClose(id){
         setAnchorEl(null);
       if(id===1) {
         alert("edit text")
         setIsSeen(true)
       }
       if(id===2){
          alert("foward text")
          setIsSeen(false)
         }
       if(id===3) alert("add box text")
       if(id===4) alert("delete text")
     }
     let params=useLocation()
     let currentRoute=params.pathname.split("/")
   function handleChatClicked(id){
          setData(option=>option.map(e=>{
            return id===e._id?{...e,clicked:true}:{...e,clicked:false}
        }))
    
   }
   useEffect(()=>{
        if(currentRoute?.length<4){
          setData(option=>option.map(e=>{
            return {...e,clicked:false}
        }))
      }
   },[params])

  return (
   <Link to={`/chat/message/${data._id}`} onClick={()=>handleChatClicked(data._id)}>
     <div className={`eachChat ${data.clicked&&"oneChatChoosed"}`}>
       <div className='each-chatPtofile'><img src={data.users[0].profilePicture[data?.users[0]?.profilePicture?.length-1]} width={50} alt='...'/></div>
       <div className='each-chatNameLastMessageDate'>
          <div className='each-chatName'> {data.users[0].username}</div>
          {data?.latestMeessage&&
          <div className='each-cLastLastMessageData'> 
             <div className={`each-chatLastLastMessage ${data?.latestMeessage.sender===userData.data._id&&"each-chatMymesssage"}`}>
                {data?.latestMeessage?.content.length>20?`${data?.latestMeessage?.content.substring(0,31)}...`:data?.latestMeessage?.content}</div>
             <div className='each-chatLastData'>{moment(data?.latestMeessage?.updatedAt).fromNow()}</div>
             <div className='each-chatLastData'>{data?.latestMeessage.sender===userData.data._id&&<VisibilityIcon style={{color:"red",fontSize:"8px"}}/>}</div>
          </div>}
       </div>
       <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        style={{fontSize:"10px",width:"10px",height:"1px",marginBottom:"2px"}}
                      >
                        <MoreVertIcon className='chatMessage-icon'/>
      </IconButton>
         <Menu
           id="long-menu"
            MenuListProps={{
            'aria-labelledby': 'long-button',
           }}
            anchorEl={anchorEl}
             open={open}
             onClose={handleClose}
             PaperProps={{
              style: {
                 maxHeight: ITEM_HEIGHT * 4.5,
                  width: '6ch',
                  },
               }}
               >
                        {option.map((option,index) => (
                          <MenuItem key={index} onClick={()=>handleClose(option.id)}>
                            {option.icon}
                          </MenuItem>
                        ))}
       </Menu>
     </div>
   </Link>
  )
}
