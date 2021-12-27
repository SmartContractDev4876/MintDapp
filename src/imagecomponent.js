
import {Row} from "react-bootstrap"
import React from 'react'

function Imgcomponent(){
    return(
        <div>
            {/* <Row><a className='modalid' href="https://opensea.io/account?tab=activity&search[chains][0]=RINKEBY&search[eventTypes][0]=ASSET_TRANSFER">View Your Primates on Opensea</a></Row> */}
            <Row>
                <img className='loader' src='./gif.gif'></img> 
            </Row>
        </div>
    
    )
  }

export default Imgcomponent;