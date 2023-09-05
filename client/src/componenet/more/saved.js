import React,{useEffect, useState} from 'react'
import BodyBellowHome from '../body/bodyBellowHome'
export default function Saved({userData}) {
  let [saved,setSaved]=useState(false)
  useEffect(()=>{
    
  },[userData])
  console.log(userData);
  return (
    <div className='saved-post'>
          <h2 className='saved-post-h2'>Saved Posts</h2>
          {userData?.data?.saved.length>1?
          <div className='saved-post-pages'> 
              {userData?.data?.saved.map(e=>{
                  return <BodyBellowHome userData={userData} data={e} />

                  })
               }
           </div>
          
           :
          <div>
            <div className='no-saved-post'>
                <div className='no-saved-post-darken'>
                  <div className='no-saved-post-text'>No saved Posts</div>
                </div>
            </div>
            </div>}
      </div>
  )
}
 