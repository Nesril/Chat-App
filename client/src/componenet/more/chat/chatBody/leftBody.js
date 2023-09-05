import { Button } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LeftBody({value,setWhatIsOnLeft}) {
    let [chat,chooseChat]=useState(false)
    function handleOptionHovered(){
        chooseChat(true)
    }
    function notHandleOptionHovered(){
        chooseChat(false)
    }

    const handleOptionClicked=(id)=>{
        setWhatIsOnLeft(option=>option.map(e=>{
            return id===e.id?{...e,clicked:true}:{...e,clicked:false}
        }))
    }
  return (
  <div className={`chatOptionToBeChoosen ${value.clicked&&"chatOptionChoosed"}`}>
     <Link to={`${value.linkTo}`}><Button onMouseOver={handleOptionHovered} onMouseOut={notHandleOptionHovered} onClick={()=>handleOptionClicked(value.id)} shape='circle'>{value.icon}</Button></Link>
     <div className={`chatNotHovered ${chat&&"chatHovered"}`}>{value.name}</div>
  </div>
  )
}
