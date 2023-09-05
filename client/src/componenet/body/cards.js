import { Button, Image } from 'antd'
import React, { useState } from 'react'

export default function Cards({memo,setFullScreenedMemory,setDisplayImage}) {
    let [mouseOnImage,setMouseOnImage]=useState(false)
    const mouseEntered=()=>{
        setMouseOnImage(true)
    }
    const mouseLeaved=()=>{
        setTimeout(()=>{
            setMouseOnImage(false)

        },3000)
    }
    function memoriesClicked(data){
        console.log(data);
        setFullScreenedMemory(data)
        setDisplayImage(true)
      }
     
  return (
    <div className='home-header-story' >
            <div className='home-header-story-profile'>
                <div><img  src={memo.profilePicture[memo.profilePicture.length-1]}/></div>
                <div>{memo.username}</div>
           </div>
            <div className={`home-header-story-image`}onMouseLeave={mouseLeaved} onMouseOverCapture={mouseEntered} onMouseEnter={mouseEntered}>
                    <img  onClick={()=>memoriesClicked(memo.memories)}  src={`/uploads/${memo.memories[memo.memories.length-1].img[0].filename}`}/>
                {mouseOnImage&&
                <p className='home-header-story-profileName'>
                   <div className='memor-desc'>
                        <div>{memo.memories[memo.memories.length-1].article.substring(0,20)}</div>
                        <div>
                            {memo.memories[memo.memories.length-1].article.length>35?
                            `${memo.memories[memo.memories.length-1].article.substring(21,35)}...`:
                            memo.memories[memo.memories.length-1].article.substring(21,35)}
                        </div>
                   </div>
                     
               </p>}
            </div>
         
   </div>
  )
}
