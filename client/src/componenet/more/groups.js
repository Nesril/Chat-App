import React from 'react'

export default function groups() {
  let name=["hawd Software company", "Go safe", "Alif Developers", "NARM Energy access"]
  return (
    <div className='groupOutlineSetting'>
        <h2>My Groups</h2>
        {name.map(goups=>{
          return(
            <div className='groupOutline-list'>
            <div><img src='/file/image3.jpg' alt="can't find picture" /></div>
            <div className='groupOutline-about'>
               <div className='groupOutline-name'>{goups}</div>
               <div className='groupOutline-description'>desc: to make Ai that identifies dangerous moves</div>
              <div className='groupOutline-area'>For Blind Groups</div> 
              <div className='groupOutline-members'><span className='no'>111.1K</span> members</div> 
              <div className='groupOutline-foundedAt'>created 10 years ago</div> 
           </div>
        </div>
          )
        })}
     
    </div>
  )
}
