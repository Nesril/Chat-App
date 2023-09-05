import React from 'react'
import "../../../styles/forget.css"
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Reveal from 'react-reveal/Reveal'
import ForgetLeftSide from './forgetLeftSide';
export default function LeftSide() {
  const handleDragStart = (e) => e.preventDefault();
  let responsive={
    0:{
        items:1
    }
  }
  let leftDisplayData=[{
    image:"/forget1.png",
  },
  {
    image:"/key.webp",
  },
  {
    image:"/images.png",
  },
  {
    image:"/forget2.jpg",
  },
  {
    image:"/forgrt3.jpg",
  },
  {
    image:"/forget4.jpg",
  }
]
let items=leftDisplayData.map(display=>{ 

   return(
       <div className='image-forgetPassword'>
           <Reveal effect="fadeInUp">
               <img src={display.image} width={150} height={150} onDragStart={handleDragStart} role="presentation" />
            </Reveal>
        </div>      
    )
  
 
})

  return (
    <section >
       <div className='backgroundOfForgetPassword'>
        </div>
       <section className='ForgetPassword'>
        <div style={{textAlign:"center",fontSize:"23px",fontWeight:"400"}}>Forget Password</div>
        <div className='top-ForgetPassword'>
            <AliceCarousel  mouseTracking        
            infinite
            autoPlay
            autoPlayInterval={5000}
            animationDuration={2500}
            disableButtonsControls
            responsive={responsive}
            items={items} />
        </div>
        <div className='bottom-forgetPassword'>
            <ForgetLeftSide/>
        </div>
      </section>
    </section>
  )
}
