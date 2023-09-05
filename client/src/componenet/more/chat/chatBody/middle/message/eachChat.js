import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useRef, useState } from 'react'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ForwardIcon from '@mui/icons-material/Forward';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import moment from 'moment';
export default function EachChat({sender,message}) {
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
  return (
  <div className={`makeChat-body-eachChat ${message?.sender?.username===sender?"yourChat":"remoteChat"}`}>
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
      <div className={`${message.sender.username===sender?"yourChat-each":"remoteChat-each"}`}>
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
          <div className='chatMessage-text'>{message.content}</div>
          <div className='chatMessage-date'>
              <div>{isSeen?<VisibilityIcon style={{fontSize:"11px"}}/>:<VisibilityOffIcon style={{fontSize:"11px"}}/>}</div>
              <div>{moment(message?.createdAt).calendar()}</div>
          </div>
      </div>
  </div>
  )
}
