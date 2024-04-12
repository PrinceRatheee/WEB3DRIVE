import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json"
import './App.css';
import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import Modal from "./components/Modal";
import Display from "./components/Display";

function App() {

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  const [provider, setProvider] = useState("");
  const [modalOpen, setModalOpen] = useState("");

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);  // provider for metamask
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        // await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();  // to write data on blockchain we need signer
        // const address = await signer.getAddress();
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        setAccount(accounts[0]);

        let contractAddress = "0x46438F253079e4185E4F092d4d792f14A95dBA14"; // deployed on sepolia testnet
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        // console.log("contract=----==", contract);
        setContract(contract);
        setProvider(provider);
      }
      else {
        console.error("Metamask is not installed");
      }

    };
    provider && loadProvider();
  }, [])
  return (
    <>
      <div className="App">
        <h1 style={{ color: "white" }}>Web3Drive</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  );
}

export default App;
