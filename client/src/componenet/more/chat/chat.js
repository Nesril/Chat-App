import React, { useEffect, useState } from 'react'
import "../../../styles/chat.css"
import { Outlet, useLocation} from 'react-router-dom'
import Link from 'antd/es/typography/Link'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LeftChat from "./chatBody/leftBody"
import RightChat from "./chatBody/rightBody"
import axios from 'axios';
export default function Chat({userData,darkmode,setDarkmode,setUserData}) {
  let params=useLocation()
  let currentRoute=params.pathname.split("/")
   console.log(currentRoute);
  let [whatIsOnLeft,setWhatIsOnLeft]=useState([
    {
      name:"All",
      icon:<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAEVJREFUSEtjZKAxYKSx+QyjFhAM4eEfRP/RwgDmY1ziGEFGKIhGLRgBGW00kglGMs2DiGBhRkgBoZxMSD9B+VELRkAQAQCGCxAZP+Br3wAAAABJRU5ErkJggg=="/>,
      clicked:(currentRoute.length===2&&currentRoute[1]==="chat")||(currentRoute.length>2&&(currentRoute[1]==="chat"&&currentRoute[2]==="message")),
      id:2,
      linkTo:"/chat"
    },
    {
      name:"Profile",
      icon: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAANlJREFUSEvtlNEVwUAQRW860AkqQAdUoARUgAooQQeUQAd0ogPO4GOM7M4s8pf9yTnJy7szbyapaPhUDfvTAtyEUxF1gA0wfjkcgAVwdR2NIAU4A12jlXv9fwCk6n3CaAJIN3JuDuxRfF0HK2CZeHkNyPOfANEOQmmVzOAC9EKuSpTboq3ZonnNFuXmkJxBSZFfAWQGM2BoSEdAhizX8LER7YCp87beJBekAbntsUYj1Ukqpo8ZSOsDt6Sn4KQiDAO8L9OyQ796LWocEEynTBZqs8zyXd0C3PTulfohGXnCj98AAAAASUVORK5CYII="/>,
      clicked:currentRoute.length===3?currentRoute[2]==="profile":false,
      id:1,
      linkTo:"/chat/profile"
    },
    {
      name:"User",
      icon:<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAN5JREFUSEvtldEVATEQRe9WQAk6oASdoAMdoAI6QEdUoAUq4DxnZ09WsjbJER+O/ORn5t2ZN7PZisKnKqyPC1gDq0zgBlC+d1zAPVPc0oJuhACptllhf0DnhL5ukYDNVpUYcquj3wVMgD2gO/aYG70WLYAtMIxVdocK9AJM9wgsgWsCaARc6vhnR6Eh32rhQ4KwQiUuW6fvAGdgDpwc8dxH0OtAFYcsyX3GPUCiI024lmEHzF4EPgYwXVkr0KBrBrkduHn6bmT12BYo9ecSU4RZpo5aaxqTnBxTooNWEQ9gsjIZfdEmyQAAAABJRU5ErkJggg=="/>,
      clicked:currentRoute.length===3?currentRoute[2]==="users":false,
      id:3,
      linkTo:"/chat/users"
    },
    {
      name:"Group",
      icon:<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAO9JREFUSEvtlVENwjAURc8UgAPAARJwABKQAA5AATgACeAAFIAEUAAogFzSJi9Nwzra/e39bGuye7r3eu8qWq6qZX0sYALsgGEm9AYsgYN0LOAJ9DLF/euCjELAu5C4l/lu3n5BBwg7nNSiI7ACrsAC2DiVNbAF+u46jcwvCaCToBOhktjD3dvZjYFLCYAVsuAsgMyidsgjas/M7dSv61HrMulfM8ixRtIMOkBrYXf3qRzG9R4Y5DQekPgcOIVhF9ONBaB3sY5ubdX90Szg7OJCsZFcKYCXyyNlT+OqA8ixCjmfR8UBjQWjeZGt8kPgA/OjMhkJ8LviAAAAAElFTkSuQmCC"/>,
      clicked:currentRoute.length===3?currentRoute[2]==="groups":false,
      id:4,
      linkTo:"/chat/groups"
    },
    {
      name:"Nottification",
      icon:<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAPtJREFUSEvtldERwUAQhr90QAdUgArQCRWgAlSACihBB6iATuiA2ZmcSTa37nIm48U+3Uyy/7f753aT0XBkDetTBzABNnlBC+AQU1wMoAXMgDkgZ4kHsAV2+dlkhQCuaieshQQ0BY4W4RNAxPcxNuQQr2UWoANcC5aEONJJ12eXBVgBy5Cqer4GJK8UFuAG9GoCJGcQC3jWFHevVwq2OvgD3g7/xCKZ2nviR27rWdAdiPgJ6CcC5KqOixANSLn/upbSPGhA6vU050sDzsAw0R6XdgFG5uR9KV5JD/0PXIJv+XmXW+wu8jUiEPlHSMjur2xOX1JsB8nONQ54AW6zJRktIMgWAAAAAElFTkSuQmCC"/>,
      clicked:currentRoute.length===3?currentRoute[2]==="notification":false,
      id:5,
      linkTo:"/chat/notification"
    },
    {
      name:"Setting",
      icon:<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAU1JREFUSEvFleFRQjEQhD8qUCtAKlArECsQKlAq0A7UDqQCtQKhA61ArUDtgA50lrnMvBwX8vQJ3h/ekMvu3t4l6bHh6G0Yn7YET8CxE6P/TmoC2xJ8FYCq+6OEXWAfeDVQfb8XCAbAh60d2veimRsRJDvuASVfVmy4BSTqHFixzRMo6a7ma2V9AkjcMpoEUiEr9NslZNmRVZ8RXANXBeRPsyr1RX7Lmn4h/wYQXkYwA06DDQIXYNY8q1SEEckcGEUWifXCkYwBkUchkEe3IPWqbikomiI/83uB+oQZjXCGuVUCTY+a7Of+pxbJ5mlkUanJ2dg1/JagFzv1vj9hk9eNqUhU2ZshHVgj1YMowjGVIgHtdDllQDbWW70qkvB02T1Yo/y58AWqoar+DHgGhs2Ef7muoxb86YMTEURP5ood0cbqk9dxolo/+r/m+Qa8HkgZlzf21gAAAABJRU5ErkJggg=="/>,
      clicked:currentRoute.length===3?currentRoute[2]==="setting":false,
      id:6,
      linkTo:"/chat/setting"
    },
    {
      name:"Home",
      icon:<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAOFJREFUSEvtld0RQTEQhb/bgRZUgApQCSpBJXSCDqhACzpgjrm5E0nuzY/JE/uYbM63u3N20lA5msr65ABGwKktaAk8UopLBRjxaSt6BZIgqYAjsHIq1tkm1kUKICRudKOQGGAHbCNV7gHlBWMIsAYOsRG09xqVuvGiD5AjbkSDkBBATpEd5ZyckG3lLDmsCxdQKm4EPYgNUMX3gsrdLgUZm0W0AWptkjOTgVxpzXRfC3AD3lvf56JnYSee3m8B3G5DY/xqRH/AhzHPwNw6uQALx7opOVl/ctFqxD6cIlH70Qtl2ysZugObfgAAAABJRU5ErkJggg=="/>,
      clicked:false,
      id:7,
      linkTo:"/"
    }
])
let propCheck="Passed"

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
 
  return (
    <div className='chat'>
      <div className={`left-side-chat ${!darkmode&&"right-side-chat-notDarkMode"}`}> 
         <div>
            <div className='left-side-chat-logo'><img src='/file/bulloLogo.png' alt='Bullo.app chatsection'  width={70}/></div>
            <div><DarkModeIcon id={darkmode?"whitemode":'darkmode'} onClick={darkModeClicked}/></div>         </div>
         <div className={`left-side-bellowLogo`}>
            {whatIsOnLeft?.map(e=>{
                return <LeftChat setWhatIsOnLeft={setWhatIsOnLeft} value={e}/>
              })}
         </div>
      </div >
       <div className={`right-side-chat ${!darkmode&&"right-side-chat-notDarkMode"}`}>
           <Outlet context={{propCheck}} />
        </div>
    </div>
  )
}
