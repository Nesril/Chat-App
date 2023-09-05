import React from 'react'
import "../styles/notFound.css"
import Link from 'antd/es/typography/Link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
export default function pageNotFound({type,removeHeader}) {
  console.log(removeHeader);
  return (
    <div  className={`pageNotFound ${removeHeader&&"TypePage"}`}>
        <div className='pageNotFound-image-blur'></div>
        <img src='/horsierun.gif' alt='...loading'/> 
        <div className='pageNotFound-textPartAnd404'>
                <div className='fourFourtyFour'>404:</div>
                <div className='pageNotFound-textPArt'>
                    <div className='pageNotFound-text'>{type} Not found</div>
                    <div className='pageNotFound-buttons'>
                        <div className='pageNotFound-homeLik'>Back to <Link href='/'>Home</Link> </div>
                        <div><Link href='/'><ArrowForwardIcon className='pageNotFound-arrowLink'/></Link> </div>
                    </div>
                    
                </div>
        </div>

    </div>
  )
}
