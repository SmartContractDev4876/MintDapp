import './App.css';
import  React,{useState,useEffect} from "react";
import Button from '@mui/material/Button';
import { createTheme , ThemeProvider} from '@mui/material/styles';
import { ethers } from 'ethers'; 
import contract from './MegaPrimates.json';
import Loader from 'react-loader-advanced'
import Modal from "react-bootstrap/Modal";
import {Container,Row,Col} from "react-bootstrap"
import Imgcomponent from './imagecomponent'
import { slideInLeft ,slideInRight} from 'react-animations'
import Radium, {StyleRoot} from 'radium';
import axios from 'axios';

const styles = {
  slideleft1: {
    animation: 'x 0.5s',
    animationName: Radium.keyframes(slideInLeft, 'slideleft')
  },
  slideleft2: {
    animation: 'x 1s',
    animationName: Radium.keyframes(slideInLeft, 'slideleft')
  },
  slideleft3: {
    animation: 'x 1.5s',
    animationName: Radium.keyframes(slideInLeft, 'slideleft')
  },
  slideright1: {
    animation: 'x 0.5s',
    animationName: Radium.keyframes(slideInRight, 'slideInRight')
  },
  slideright2: {
    animation: 'x 1s',
    animationName: Radium.keyframes(slideInRight, 'slideInRight')
  },
  slideright3: {
    animation: 'x 1.5s',
    animationName: Radium.keyframes(slideInRight, 'slideInRight')
  }
}


const BigNumber = require('bignumber.js');

const { ethereum } = window;
const contractAddress = "0x00D460f5Ea74D3509E796247F46791A0dC3B13b6";
const abi = contract.abi;


const theme = createTheme({
  typography: {
    fontSize:30
  },
  status: {
    danger: '#ee2222',
  },
  palette: {
    primary: {
      main: '#ee2222',
      darker: '#ee2222',
    },
    neutral: {
      main: '#ee2222',
      contrastText: '#fff',
    },
  },
});
const theme1 = createTheme({
  typography: {
    fontSize:30
  },
  status: {
    danger: '#ee2222',
  },
  palette: {
    primary: {
      main: '#ee2222',
      darker: '#ee2222',
    },
    neutral: {
      main: '#ee2222',
      contrastText: '#fff',
    },
  },
});

const spinner=  <Modal 
                dialogClassName ="ssmodala"
                size="sm"
                 show={true}
                backdrop="static"
                keyboard={false}
                centered>
                  <Modal.Header className='background' style={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft:"17%",
                      height:"10px"
                    }}>
                    <Modal.Title>
                      <div className='Transaction'>Connecting Wallet...</div>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='row'>
                    <div className='col-3'>
                      <img className='whitepadding' src="./wallet.svg"/>
                    </div>
                    <div className='col-7'>
                      <div className='processs '>
                      Please wait while we check your whitelist status.
                      </div>
                    </div>
                  </div>
                  </Modal.Body>
                </Modal>

function Maincomponent(){

    let  provider ,signer ,nftContract;

    const [currentAccount, setCurrentAccount] = useState(null);
    const [value, setValue] = useState(1);
    const [status,setStatus]=useState("CONNECT WALLET");
    const [limittoken,setlimit]=useState(5);
    const [mintprice ,setprice]=useState('');
    const [id,setid]=useState(0);
    const [balance,setBal]=useState(0);
    const [white,setWhite]=useState(false);
    const [whitelister,setWhitestring]=useState("");
    const [loading,setload]=useState(false);
    const [mint, setmint]=useState(false)
    const [route,setroute]=useState("https://etherscan.io/tx/")
    const handleClose=()=>{setmint(false)}
    const errorClose=()=>seterrorshow(false)
    const [error,seterror]=useState('')
    const [errorshow,seterrorshow]=useState(false)
    const [showcount,setshowcount]=useState(false)
    const [leaf,setleaf]=useState([])
    const [saveddata,setsaveddata]=useState()
    const [txmodal,settxmodal] = useState(false)
    const modalclose=()=>{settxmodal(false)}
    const [txConfirmed,settxConfirmed]=useState(false)
    const [ids,setids]=useState([])
    const [iswhite,setiswhite]=useState(false)
    const [walletmodal,setwalletmodal]=useState(false)
    const hidewalletmodal = () => setwalletmodal(false)

    useEffect(()=>{
      if(balance!=0){
        setshowcount(true)
      }
    },[balance,currentAccount])


    useEffect(async () => {
      if(ethereum){
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if(accounts.length!==0){
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            nftContract = new ethers.Contract(contractAddress, abi,signer);
            setCurrentAccount(accounts[0])
            let data = localStorage.getItem(accounts[0])
            setsaveddata(data);
            setload(true)
            let ether
            await nftContract.totalSupply.call().then((result)=>{ether=BigNumber(result._hex)})
            setid(ether.toString());
            let a = await nftContract.getWhitelistSale()
            setiswhite(a)         
            let bal;
            await nftContract.getBalance.call().then((result)=>{bal=BigNumber(result._hex)});
            setBal(parseInt(bal.toString()));
            console.log(data,typeof(data))
            if(data != null &&data != "" && a){
              setleaf(data.split(','))
              console.log(data)
              setWhite(true)
              let bal;
              await nftContract.getWhitelimit.call().then((result)=>{bal=BigNumber(result._hex)});
              let a = bal.toString();
              setlimit(parseInt(a));
              await nftContract.getWhitelistprice().then((result)=>{bal=BigNumber(result._hex).shiftedBy(-18).toString()})
              setprice(bal)
            }else{
              let ether;
              await nftContract.getMintPrice.call().then((result)=>{ether=BigNumber(result._hex)})
              let string=new BigNumber(ether.shiftedBy(-18)).toString();
              setprice(string)
              setStatus(`MINT ${value} FOR ${parseFloat((value * parseFloat(mintprice)).toFixed(3)).toString()} ETH`)
            }
            setload(false)
         }
        }
    }, [])

    useEffect(async()=>{
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if(accounts.length !== 0){
        setCurrentAccount(accounts[0])
        setStatus(`MINT ${value} FOR ${parseFloat((value * parseFloat(mintprice)).toFixed(3)).toString()} ETH`)
      }
    },[value,mintprice])

    // useEffect(() => {
    //   checkWalletIsConnected();
    // },[])

    useEffect(() => {
      if(window.ethereum) {
        window.ethereum.on('accountsChanged', () => {
          checkWalletIsConnected();
        })
    }
    })

    useEffect(()=>{
      if(!status.includes("MINT")){
        setload(false)
      }else{
        var data = JSON.stringify({
          "whitelister": currentAccount
        });
        var config = {
          method: 'post',
          url: 'https://whitelistworker.megaprimates.io/whitelister',
          headers: { 
            'Content-Type': 'text/plain'
          },
          data
        };
        if(!saveddata)
          axios(config)
          .then(function (response) {
            console.log(response.data);
            setleaf(response.data)
            localStorage.setItem(currentAccount, response.data);
            if(response.data.length !==0){
              setWhite(true)
            }
              
          })
          .catch(function (error) {
            console.log(error);
            setload(false)
          });
      }
    },[status])

    useEffect(async ()=>{
      if(white){
        setload(true);
        provider = new ethers.providers.Web3Provider(ethereum);
        signer = provider.getSigner();
        nftContract = new ethers.Contract(contractAddress, abi,signer);
        let bal;
        await nftContract.getWhitelimit.call().then((result)=>{bal=BigNumber(result._hex)});
        let a = bal.toString();
        setlimit(parseInt(a));
        await nftContract.getWhitelistprice().then((result)=>{bal=BigNumber(result._hex).shiftedBy(-18).toString()})
        setprice(bal)
        setWhitestring("Congratulations! You are Whitelisted!")
        setload(false);
      }
    },[white])


    const connectWalletHandler = async () => {
      if (!ethereum) {
        setStatus("DOWNLOAD WALLET");
      }else
      {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          setCurrentAccount(accounts[0]);
          checkWalletIsConnected()
      }
    }
    
    const checkWalletIsConnected = async () => {

        if(window.ethereum.networkVersion==4){
          setStatus("CONNECT WALLET");
          setWhitestring("")
          setload(true);
          const accounts = await ethereum.request({ method: 'eth_accounts' }).then().catch((err)=>{setload(false)});
          if (accounts.length !== 0) {
            setload(true);
            const account = accounts[0];
            setCurrentAccount(account);
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            nftContract = new ethers.Contract(contractAddress, abi, signer);
            let bal;
            await nftContract.getBalance.call().then((result)=>{bal=BigNumber(result._hex)});
            let a =bal.toString();
            setBal(parseInt(a));
            let ether;
            let string
            if(!white){
              await nftContract.getMintPrice.call().then((result)=>{ether=BigNumber(result._hex)})
              string=new BigNumber(ether.shiftedBy(-18)).toString();
              setprice(string)
              await nftContract.getLimit.call().then((result)=>{bal=BigNumber(result._hex)});
              a =bal.toString();
              setlimit(parseInt(a));
            }else{
              await nftContract.getWhitelimit.call().then((result)=>{bal=BigNumber(result._hex)});
              a = bal.toString();
              setlimit(parseInt(a));
              await nftContract.getWhitelistprice().then((result)=>{bal=BigNumber(result._hex).shiftedBy(-18).toString()})
              setprice(bal)
            } 
            await nftContract.totalSupply.call().then((result)=>{ether=BigNumber(result._hex)})
            a =ether.toString();
            setid(parseInt(a));
            setStatus(`MINT ${value} FOR ${parseFloat((value * parseFloat(mintprice)).toFixed(3)).toString()} ETH`)
            setload(false);
          }
        }else{
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }], // chainId must be in hexadecimal numbers
          });
          const accounts = await ethereum.request({ method: 'eth_accounts' }).then().catch((err)=>{setload(false)});
          if (accounts.length !== 0) {
            setload(true);
            const account = accounts[0];
            setCurrentAccount(account);
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            nftContract = new ethers.Contract(contractAddress, abi,signer);
            let bal;
            await nftContract.getBalance.call().then((result)=>{bal=BigNumber(result._hex)});
            let a =bal.toString();
            setBal(parseInt(a));
            console.log(a)
            let ether;
            let string
            if(!white){
              await nftContract.getMintPrice.call().then((result)=>{ether=BigNumber(result._hex)})
              string=new BigNumber(ether.shiftedBy(-18)).toString();
              setprice(string)
              await nftContract.getLimit.call().then((result)=>{bal=BigNumber(result._hex)});
              a =bal.toString();
              setlimit(parseInt(a));
            }else{
              await nftContract.getWhitelimit.call().then((result)=>{bal=BigNumber(result._hex)});
              a = bal.toString();
              setlimit(parseInt(a));
              await nftContract.getWhitelistprice().then((result)=>{bal=BigNumber(result._hex).shiftedBy(-18).toString()})
              setprice(bal)
            } 
            await nftContract.totalSupply.call().then((result)=>{ether=BigNumber(result._hex)})
            a =ether.toString();
            setid(parseInt(a));
            setStatus(`MINT ${value} FOR ${parseFloat((value * parseFloat(mintprice)).toFixed(3)).toString()} ETH`)
            setload(false);
          }
        }
        setload(false);
    }
  
    function onclick(){
      if(status.includes("MINT")){
         mints();
      }else if(status==="DOWNLOAD METAMASK"){
        window.location.href='https://metamask.io/download.html'
      }else if(status==="CONNECT WALLET"){
        connectWalletHandler()
      }
    }


  async function setpopup() {
      setload(false);
      setmint(true) ;
  }
    const mints = async()=>{
      provider = new ethers.providers.Web3Provider(ethereum);
      signer = provider.getSigner();
      nftContract = new ethers.Contract(contractAddress, abi, signer);
      // let notify = Notify(options)
      const accounts = await ethereum.request({ method: 'eth_accounts' }).then().catch((err)=>{setload(false)});
      let a= parseFloat(mintprice) * value;

      if(limittoken-balance<value){
        if(limittoken-balance==0)
          seterror("You have reached your max mint limit");
        if(limittoken-balance!=0)
          seterror(`You've minted ${balance} out of ${limittoken}. You can only mint ${limittoken-balance} more`);
        seterrorshow(true)
      }else{
        setwalletmodal(true)
        let txhash = 
        // await nftContract.mints(value,leaf,{ value: ethers.utils.parseEther(`${a}`) })
        await nftContract.mints(value,leaf,{ value: ethers.utils.parseEther(`${a}`) })
                    .catch((err)=>{
                      if(err){setload(false);                         
                        seterror(err.error.message.split(':')[1].toUpperCase()); 
                        seterrorshow(true);
                        modalclose()
                        setwalletmodal(false)
                        settxmodal(false)
                    }
                  })
        setwalletmodal(false)
        
        // const { emitter } = notify.hash(txhash)
        // emitter.on('txConfirmed', setpopup)
        // emitter.on('txFailed', setload(false))
        if(txhash){
          settxmodal(true)
          const recipt  = await txhash.wait().catch(
            (err)=>{
              console.log(err)
              setload(false);                         
              seterror(err.error.message.split(':')[1].toUpperCase()); 
              seterrorshow(true);
            }
          )
          settxConfirmed(true)
            console.log(recipt,BigNumber(recipt.events[recipt.events.length - 1].args[0]._hex).toString(),BigNumber(recipt.events[recipt.events.length - 1].args[1]._hex).toString()) 
            console.log(txhash)
            await setTimeout(function() {
              let idlist =[]
              for(let i = parseInt(BigNumber(recipt.events[recipt.events.length - 1].args[1]._hex).toString()) ; i >0 ;i--){
                idlist.push(parseInt(BigNumber(recipt.events[recipt.events.length - 1].args[0]._hex).toString())-i+1)
              }
              setids(idlist)
              setpopup()
              modalclose()
              setroute(`https://etherscan.io/tx/${txhash.hash}`)     
              setmint(true)
              setid(parseInt(id)+parseInt(value))                
              setBal(parseInt(balance)+parseInt(value)) 
            }, 1500);
            
          
          } 
        }
        
    }

    return(
      <StyleRoot>
      <Loader backgroundStyle={{borderRadius:10}} show={loading} message={spinner}>
        <div className="main">
          <div className='spacingheght'>
            <h3 className='mint_header' style={styles.slideright1}>MINT YOUR MEGA PRIMATES NFT</h3>
                <div className='minted_text' style={styles.slideleft1}>{id}/8,888 Minted</div>
                 <div className='comment_Maximum max_Public' style={styles.slideright2}>5 Primates Maximum Per Wallet During Public Sale</div>
                 <div className='comment_Maximum' style={styles.slideleft2}>(2 Primates Max. During Pre-Sale)</div>
                <div className='comment_Whitelister'>{whitelister}</div>
                {
                  showcount?
                  <div className='minted'>
                  You minted { balance} out of {limittoken}
                </div>:
                <></>
                }
                <div>
                  <div style={styles.slideright3} className='row_element btn_group'>
                        <div className='col-md-2 '>
                            <ThemeProvider theme={theme}><Button onClick={() => {if(value>1){setValue((value - 1));}}} style={{backgroundColor: '#ee2222',fontSize:40, color: 'white',maxWidth: '90px', maxHeight: '55px', minWidth: '80px', minHeight: '55px'}} color="neutral" variant="contained">-</Button></ThemeProvider>
                        </div>
                        <div className='col-md-2 text_nftcount'>{value}</div>
                        <div className='col-md-2'>
                            <ThemeProvider theme={theme}><Button  
                                onClick={() => {if(value<limittoken-balance){setValue((value + 1));}}} 
                                style={{backgroundColor: '#ee2222',fontSize:40, color: 'white',maxWidth: '90px', maxHeight: '55px', minWidth: '80px', minHeight: '55px'}} 
                                variant="contained">+</Button></ThemeProvider>
                        </div>
                  </div>
                </div>
                  <div style={styles.slideright3} className='row row_element group'>
                          <ThemeProvider theme={theme1}><Button className='buttona' onClick= {onclick} variant="contained">{status}</Button></ThemeProvider>
                  </div>
                <div style={styles.slideleft3} className='comment_Fee'>
                      1 Mega Primates Costs {mintprice} ETH + Gas Fees
                </div>
              </div>
            <Modal 
              dialogClassName ="modala"
              show={mint}
              // show={true}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              centered>
              <Modal.Header closeButton closeVariant='white' style={{height:"0px"}}>
                <Modal.Title></Modal.Title>
              </Modal.Header>
              <Modal.Body style={{marginTop:"-10px"}}>
              <Container>
                <div claseName='modaltitle'><div className='modaltitle'>
                  <h3 claseName='Popuptitle'>Welcome to the Mega Primates Family!</h3> 
                  <h4 className='whitecolor'>TRANSACTION CONFIRMED SUCCESSFULLY</h4>
                  <h4 className='whitecolor'>Primate #{ids.join(',')}</h4></div></div>
                <Imgcomponent/>
                <Row><div className='modalroute'><a claseName="link" href={route}> View Transaction on Etherscan</a></div></Row>
                  <Row>
                    <Col xs={6} md={6}>
                      <Row>
                        <Col><div className='ico'><a href="https://opensea.io/collection/megaprimatesofficial"><img className='opensea' src="./mark1.png"></img></a></div></Col>
                        <Col><div className='ico'><a href="https://discord.gg/megaprimates"><img className='opensea' src="./mark2.png"></img></a></div></Col>
                        <Col><div className='ico'><a href="https://twitter.com/megaprimates" ><img className='opensea' src="./mark3.png"></img></a></div></Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
            </Modal>
            
            <Modal 
                dialogClassName ="ssmodala"
                size="sm"
                show={errorshow}
                backdrop="static"
                onHide={errorClose}
                keyboard={false}
                centered>
                  <Modal.Header className='background' closeButton closeVariant='white' style={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft:"17%",
                      height:"10px"
                    }}>
                    <Modal.Title>
                      <div className='Transaction'>ERROR</div>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='row'>
                    <div className='col-3'>
                      <img className='whitepadding' src="./error.svg"/>
                    </div>
                    <div className='col-7'>
                      <div className='processs '>
                        {error}
                      </div>
                    </div>
                  </div>
                  </Modal.Body>
                </Modal>
                <Modal 
                dialogClassName ="ssmodala"
                size="sm"
                show={walletmodal}
                // show={true}
                backdrop="static"
                onHide={hidewalletmodal}
                keyboard={false}
                centered>
                  <Modal.Header className='background' closeButton closeVariant='white' style={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft:"17%",
                      height:"10px"
                    }}>
                    <Modal.Title>
                      <div className='Transaction'>Confirm Transaction</div>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='row'>
                    <div className='col-3'>
                      <img className='whitepadding' src="./metamask.svg"/>
                    </div>
                    <div className='col-7'>
                      <div className='processs '>
                      Please Complete Confirmation on Metamask
                      </div>
                    </div>
                  </div>
                  </Modal.Body>
                </Modal>
            <Modal 
              dialogClassName ="ssmodala"
              size="sm"
              show={txmodal}
              // show={true}
              onHide={modalclose}
              backdrop="static"
              keyboard={false}
              centered>
                <Modal.Header className='background' closeButton closeVariant='white' style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft:"17%",
                    height:"10px"
                  }}>
                  <Modal.Title>
                    <div className='Transaction'>Transaction Status</div>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {
                    !txConfirmed?
                    <div className='row'>
                    <div className='col-3'>
                      <img className='whitepadding' src="./rocket.svg"/>
                    </div>
                    <div className='col-7'>
                      <div className='process '>
                        Please wait while the transaction is processing
                      </div>
                    </div>
                  </div>:
                  <div className='row'>
                  <div className='col-3'>
                    <img className='whitepadding' src="./check.svg"/>
                  </div>
                  <div className='col-7'>
                    <div className='processs '>
                      Your transaction has succeed
                    </div>
                  </div>
                </div>
                  } 
                </Modal.Body>
          
            </Modal>

          </div>
      </Loader>  
      </StyleRoot>
    )
}
export default Maincomponent;


