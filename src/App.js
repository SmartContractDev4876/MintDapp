import './App.css';
import Maincomponent from './maincomponent';
import { slideInLeft,slideInRight } from 'react-animations'
import Radium, {StyleRoot} from 'radium';


const styles = {
  slideleft: {
    animation: 'x 0.5s',
    animationName: Radium.keyframes(slideInLeft, 'slideleft')
  },
  slideright: {
    animation: 'x 1.5s',
    animationName: Radium.keyframes(slideInRight, 'slideInRight')
  },
  slidelefta: {
    animation: 'x 1.5s',
    animationName: Radium.keyframes(slideInLeft, 'slideleft')
  }

}


function App() {
  return (
    <StyleRoot>
    <div className="App">
      <header className="App-header">
        <div className="row align-center height" style={{position: 'relative'}}>
            <div className="left">
                  <img className="leftimg" style={styles.slidelefta} src="./ape-left.png"></img>
            </div>
            <div className="right">
              <img className="rightimg" style={styles.slideright} src="./ape-right.png"></img>
            </div>
          <div className='mainscreen'>
            <div className="row row_element">
              <div className="col-md-3" >
                <img className='logo' style={styles.slideleft} src="./mega-primates-logo2.png" />
              </div>
            </div>
            <div className="col-md-12 row_element test">
              <div className="col-md-8 padding_element">
                  <Maincomponent/>
              </div>
            </div>
            
            </div>
              <div className="col-md-12 footer">Copyright © MegaPrimates.io - All Rights Reserved <br/> Privacy Statement - Terms & Conditions - Cancel - Contact <br/> <br/>Please make sure you are connected to the right network (Etherium Mainnet) and the correct address. Once you make a transaction, you cannot undo this transaction<br/>Contract Address:</div>


          </div>
      </header>
    </div>
    </StyleRoot>
  );
}

export default App;
