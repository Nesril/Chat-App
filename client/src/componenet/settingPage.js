import { useEffect, useState } from 'react';
import { Button, Divider } from '@mui/material';
import { CloseOutlined  } from '@ant-design/icons';
import Zoom from 'react-reveal/Zoom';
import { Input } from 'antd';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';

export default function SettingPage({userData,setUserData}) {
  let [loggedOutPage,wantToLogOutPage]=useState(false)
  let [loggedOut,setLoggedOut]=useState(false)
  let [deleteAccountPage,wantToDeleteAccountPage]=useState(false)
  let navigate=useNavigate()
  const sureToLoggedOut=()=>{
    wantToLogOutPage(!loggedOutPage)
  }
  const amNotSureToLoggedOut=()=>{
    wantToLogOutPage(false)
  }
  const amSureToLoggedOut=()=>{
    wantToLogOutPage(false)
    setLoggedOut(true)
   // alert("Successfully Logged Out!!!!")
    let name={username:userData.data.username}
    let stringifyName=JSON.stringify(name)
    axios.post("http://localhost:1330/bullo/userApi/logOut",stringifyName, //proxy uri
      {
        headers: {
            authorization:`Bearer ${userData.token}`,
            'Content-Type': 'application/json'
        } 
      })
      .then(response=>{
        console.log(response.data)
        setUserData({
          data:{logged:false},
          })
          navigate("/sign/signIn")
          window.location.reload(true)
        })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
        })

  }
/////deleteAccount

let sureToDeleteAccountOut=()=>{
  wantToDeleteAccountPage(!deleteAccountPage)
}
let [usernameToDelete,setUsernameToDelete]=useState("")
let [doneButtonForDelete,setDoneButtonForDelete]=useState(true)
const deletedInputChanged=(e)=>{
  setUsernameToDelete(e.target.value)
  if(userData?.data?.username===e.target.value){ 
    setDoneButtonForDelete(false)
  }
  else setDoneButtonForDelete(true)
}
const succeSfullyDeleted=()=>{
  wantToDeleteAccountPage(false)
  alert("Successfuly deleted")
  setUsernameToDelete("")
  setDoneButtonForDelete(true)
  let name=userData.data.username
  axios.delete(`http://localhost:1330/bullo/userApi/deleteUSer/${name}`, //proxy uri
      {
        headers: {
            authorization:`Bearer ${userData.token}`,
            'Content-Type': 'application/json'
        } 
      })
      .then(response=>{
        console.log(response.data)
        setUserData({ data:{logged:false}})
        navigate("/sign/signUp")
        })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
        })

}
  return (
    <div className='accountInformation'>
        <div className='accountInformation-title'>Account Information</div>
        <div className='accountInformation-credential'>
           <div className='accountInformation-user'>
              <div className='accountInformation-user-title'>Username</div>
              <div className='accountInformation-user-credential'>{userData?.data?.username} </div>
           </div>  
           <div className='accountInformation-user'>
              <div className='accountInformation-user-title'>Email</div>
              <div className='accountInformation-user-credential'>{userData?.data?.email} </div>
           </div> 
           <div className='accountInformation-user'>
              <div className='accountInformation-user-title'>BulloName</div>
              <div className='accountInformation-user-credential'>{userData.data.bulloName ? userData?.data?.bulloName:<Skeleton variant="rectangular" width={210} height={118} />} </div>
           </div> 
           <div className='accountInformation-user'>
              <div className='accountInformation-user-title'>password</div>
              <div className='accountInformation-user-credential'><Skeleton variant="rectangular" width={80} height={25} /> </div>
           </div> 
        </div>
        <div className='accountInformation-logOutAndDeleteAndFounded'>
           <div className='accountInformation-founded'>your account Created at 20/13/2022</div>
           <div className='accountInformation-logOutAndDelete'>
               <div className='accountInformation-logOut'><Button  onClick={sureToLoggedOut}>Log Out</Button></div>
               <div className='accountInformation-Delete'><Button  onClick={sureToDeleteAccountOut}>Delete Account</Button></div>
           </div>
        </div>
        {loggedOutPage&&
              <section className='makeSure'>
                <Zoom>         
                  <div className='makeSure-makeCenter'>
                      <div className='makeSure-makeCenter-icon'><Button style={{background:"brown"}}  onClick={sureToLoggedOut} ><CloseOutlined  className='icon'/></Button></div>
                      <div>Are You sure on logging out?</div>
                      <div className='makeSure-button'>
                        <div><Button style={{background:"rgb(4, 118, 153)",color:"white"}}  onClick={amSureToLoggedOut} type="primary">yes</Button></div>
                        <div><Button style={{background:"brown",color:"white"}} onClick={amNotSureToLoggedOut} type="primary" danger>no</Button></div>
                      </div>
                  </div>
                </Zoom>

              </section>
          }

          {deleteAccountPage&&
                <section className='makeSure'>
                  <Zoom>         
                    <div className='makeSure-makeCenter'>
                        <div className='makeSure-makeCenter-icon'><Button style={{background:"brown"}}  onClick={sureToDeleteAccountOut} ><CloseOutlined  className='icon'/></Button></div>
                        <div style={{marginBottom:"20px"}}>Are You sure on deleting your Account? type <span style={{fontWeight:"700"}}>{userData?.data?.username}</span> bellow </div>
                        <Input value={usernameToDelete} onChange={deletedInputChanged}
                          
                         />
                        <div className='makeSure-button'>
                          <div><Button disabled={doneButtonForDelete} style={{background:doneButtonForDelete?"rgb(0,0,0,0.5)":"rgb(4, 118, 153)",color:"white"}}  onClick={succeSfullyDeleted} type="primary">Done</Button></div>
                        </div>
                    </div>
                  </Zoom>

                </section>
            }
    </div>
  )
}
