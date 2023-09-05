import React from 'react'
import Header from './header_footer/header';
import "../styles/profile.css"
import EachProfile from './more/eachProfile';
export default function Profile({darkmode,setDarkmode,userData}) {
  return (
  <div>
    <Header darkmode={darkmode} setDarkmode={setDarkmode} userData={userData}/>
    <EachProfile darkmode={darkmode} setDarkmode={setDarkmode} userData={userData} data={userData} type={"me"}/>
  </div>
  )
}
