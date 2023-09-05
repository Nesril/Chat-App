import React from 'react'

export default function nottification() {
  let name=["abe","kebe","bechere","chali","senderen"]
  return (
  <div>
    <h2 style={{paddingBottom:"20px",paddingLeft:"20px"}}>Nottifications</h2>
    <div className='nottification'>
      {name.map(e=>{
       return(
         <div className='nottification-settting'>
            <div><img src='/file/image2.jpg' alt='cant find te user'/></div>
            <div className='nottification-setting-desc'>
                <div className='nottification-name'>{e}</div>
                <div className='nottification-note'>Whenever we open Facebook, the notifications bell icon starts showing all the current notifications with a red dot. However once you click on the red bell icon, the red color disappears. This might confuse you and you may think that the notification has been all read</div>
            </div>
       </div>)
      })}
    </div>
 </div>
  )
}
