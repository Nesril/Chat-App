import React from 'react'
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Reveal from 'react-reveal/Reveal'
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';

export default function LeftSide() {
  const handleDragStart = (e) => e.preventDefault();
  let responsive={
    0:{
        items:1
    }
  }
  let leftDisplayData=[{
    image:"/file/horse1.jpg",
    title:"Ice breaker -- As Devloper",
    text:"The first Developers Group in KJUMJ as well as in Jimma Universty "
  },
  {
    image:"/file/horse2.jpg",
    title:"Our Goal",
    text:"Create competent and Skillful muslims "
  },
  {
    image:"/file/horse3.jpg",
    title:"A path to go with",
    text:"This is the website we wish we had when we were learning on our own. We scour the internet looking for only the best resources to supplement your learning and present them in a logical order."
  }
]
let items=leftDisplayData.map(display=>{
 
 
   return(
      <div className='items'>
         <div className='image'><img src={display.image} width={200} height={200} onDragStart={handleDragStart} role="presentation" /></div>
      </div>
    )
  
 
})

  return (
    <div className='leftSide'>
        <AliceCarousel  mouseTracking        
        infinite
        autoPlay
        autoPlayInterval={5000}
        animationDuration={2500}
       disableButtonsControls
        responsive={responsive}
        items={items} />
    </div>
  )
}
