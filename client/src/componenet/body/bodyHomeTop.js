import React, { useEffect, useState } from 'react'
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Reveal,Zoom } from 'react-reveal';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons'
import { Button, Divider, Image, Space } from 'antd';
import axios from "axios"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Cards from './cards';
import moment from "moment"
import Link from 'antd/es/typography/Link';
export default function BodyHomeTop({userData}) {
   console.log(userData.data);
   let [memoryData,setMemoryData]=useState([])
   let [displayedData,setLeftDisplayData]=useState([])
   let [fullScreenedMemory,setFullScreenedMemory]=useState({})
   let [displayImage,setDisplayImage]=useState(false)

   useEffect(()=>{
       axios.get(`http://localhost:1330/bullo/userApi/getAllMemories`)
        .then(res=>{
          console.log(res.data);
          setMemoryData(res.data)
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
   },[userData])
   console.log(memoryData);
    const responsive = {
        500: { items: 1 },
        600: { items: 2 },
        700: { items: 3},
        854: { items: 4 },
        1000:{items:6}
      };
      
let filterMemoriesThatHasImage=memoryData?.data?.filter((display)=>display.memories?.map((memo,index)=>{
        return memo.img.length>0
        }))
let filterImageFullScreen=filterMemoriesThatHasImage?.filter(e=>{
  return e.online===true
})
let makeImageFullScreen=filterImageFullScreen?filterImageFullScreen[0]:[]
console.log(makeImageFullScreen);
 
    console.log(filterMemoriesThatHasImage);

let items=filterMemoriesThatHasImage?.map((memo,index)=>{
        if(memo.memories[memo.memories.length-1].img.length>0){
            return <Cards memo={memo} key={index} setFullScreenedMemory={setFullScreenedMemory} setDisplayImage={setDisplayImage}/>
        }
  })
     

  const  renderNextButton= ({ isDisabled }) => {
    return <Button className='nextButton' style={{position: "absolute", right: "-40px", top: "230px",color:"black",zIndex:"20" }} shape='circle'><ArrowForwardIosIcon /></Button>
  };
  
  const renderPrevButton = ({ isDisabled }) => {
    return <Button  className='prevButton' style={{ position: "absolute", left: "-40px", top: "230px",color:"black",zIndex:"20" }}shape='circle'><ArrowBackIosIcon style={{padding:"0 0 0 5px"}} /></Button>
    
  };

  function removeMemoryImageFullScreen(){
    setDisplayImage(false)

  }

  return (
    <div className='bodyHomeTop'  style={{margin:!filterMemoriesThatHasImage?.length>0&&"50px 0 50px 0"}}>
      <h1 className='bodyHomeTop-createNew'>
         <Link href="/setting/memories"><PlusOutlined /></Link>
      </h1>
      { !filterMemoriesThatHasImage?.length>0&&<h1><Link href="/setting/memories">Add memories</Link></h1>}
          {filterMemoriesThatHasImage?.length>0&&<AliceCarousel  
          mouseTracking        
          id="alice-carousalTopBody"
            autoPlayInterval={300}
            animationDuration={300}
            responsive={responsive}
            items={items} 
            keyboardNavigation={true}
            renderPrevButton={renderPrevButton}
            renderNextButton={renderNextButton}
            />
          }
         {displayImage&& 
              <Zoom bottom>
                     <div className='displayMemoryImageFullScreen'>
                        <div className='displayMemoryImageFullScreen-icon'><Button  onClick={removeMemoryImageFullScreen}style={{background:"red"}} ><CloseOutlined  className='icon'/></Button></div>
                        <h3>All memories</h3>
                        {fullScreenedMemory.map((e,index)=>{
                            let memoryCreatedTimeFromNow=moment(e.uploadedDate).fromNow();
                            let memoryUpdatedTimeFromNow=moment(e?.updatedDate).fromNow();
                           return(
                                <div className='displayMemoryImageFullScreen-each' key={index}>
                                   <div className='displayMemoryImageFullScreen-each-uploadedTime'>created {memoryCreatedTimeFromNow}</div>
                                    <div className='displayMemoryImageFullScreen-leftSide'> 
                                            {e?.img?.map(image=>{
                                                    return <div><Image src={`/uploads/${image.filename}`} width={200} height={200} alt="can't find picture" /></div>
                                                })}
                                    </div>    
                                    <div  className='displayMemoryImageFullScreen-rightSide'> {e.article}</div>
                                    <footer>
                                        <div>created {moment(e?.uploadedDate).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                        {e.updatedDate&&<div>updated {moment(e?.updatedDate).fromNow()}</div>}
                                        <div>memory Id: {e.memoryID}</div>
                                    </footer>
                                    <Divider style={{backgroundColor:"red"}}/>
                             </div>
                             
                            )
                        })}
                      
                     </div>
         </Zoom>
        }
    </div>
  )
}
