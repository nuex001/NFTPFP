import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEthersSigner } from './utils/ethers';
import ipfs from "./utils/Ipfs"
import { contractABI, contractAddress } from './utils/constants'
import { useWalletClient } from 'wagmi'
import { FiLoader } from "react-icons/fi"
import { ethers } from 'ethers'
function App() {
  const [laoding, setlaoding] = useState(0);
  const { data: walletClient } = useWalletClient();
  const signer = useEthersSigner();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (walletClient) {
        setlaoding(true);
        const name = e.target.username.value;
        const twitter = e.target.twitter.value;
        const data = {
          name: name,
          image: "QmNMGJbxVuQVzuhR5x4BRCb5ku2qRnSznisBeQnihnLuh3",
          description: "AN Nft PFP for pass",
          external_url: `https://twitter.com/${twitter}`
        };
        const dataString = JSON.stringify(data);
        const { cid } = await ipfs.add(dataString);
        const tokenUrl = cid.toString();
        console.log(dataString);
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const tx = await contract.mint(tokenUrl);
        setlaoding(false);
        e.target.reset();
      }
    } catch (error) {
      console.log(error);
      setlaoding(false);
    }
  }

  return (
    <div className="container">
      <nav>
        <a href="/"><span>P</span>F<span>P</span></a>
        <ConnectButton />
      </nav>
      <form action="" onSubmit={onSubmit}>
        <input type="text" name='username' placeholder='Username' required />
        <input type="text" name='twitter' placeholder='Twitter Username' required />
        <button>
          {
            laoding ?
              <FiLoader className='icon' />
              :
              "Mint"
          }
        </button>
      </form>
    </div>
  )
}

export default App
