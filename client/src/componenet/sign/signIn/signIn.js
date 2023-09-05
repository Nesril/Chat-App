import React from 'react'
import "./registration.css"
import LeftSide from "./leftSide";
import RighSide from "./righSide";
export default function signIn({getSigned,userData,setUserData}) {
  return (
    <div className="signin-App">
         <div className="signin-App-form"><RighSide  getSigned={getSigned} userData={userData} setUserData={setUserData}/></div>
   </div>
  )
}
