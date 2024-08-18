import { useState, useEffect } from "react";
import { signMessage } from "../utils/sign";
import Link from "next/link";
import Metamask from "../component/metamask";

const Index = () => {
  const ethers = require("ethers");
  const UsedAddress = "0xE06D2777cFe9854724797549352eB665d6F268Ba";
  // const UsedAddress = "0x083Cc08C85A91791ADe2c63697D7B2549218686b";
  const AllowanceClaimABI = require("../AllowanceABI.json")
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [client, setclient] = useState({
    isConnected: false,
  });
  
  async function submitApplications() {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = new ethers.Wallet("23db46afdcef2a3a18cf85b9a21847fbfba0d356b48eecbfb8dd4f7b76f45a80", provider);
    const submitContract = new ethers.Contract(UsedAddress, AllowanceClaimABI, signer);
    const tx = await submitContract.submitApplication("one", 2);
    await tx.wait();
    console.log("Transaction successful:", tx);
  }

  async function verifyApplications() {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = new ethers.Wallet("23db46afdcef2a3a18cf85b9a21847fbfba0d356b48eecbfb8dd4f7b76f45a80", provider);
    
    const submitContract = new ethers.Contract(UsedAddress, AllowanceClaimABI, signer);
    const tx = await submitContract.verifyApplication(1);
    await tx.wait();
    console.log("Transaction successful:", tx);
  }

  async function signApplications() {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = new ethers.Wallet("23db46afdcef2a3a18cf85b9a21847fbfba0d356b48eecbfb8dd4f7b76f45a80", provider);
    
    const submitContract = new ethers.Contract(UsedAddress, AllowanceClaimABI, signer);
    const tx = await submitContract.signApplication(1);
    await tx.wait();
    console.log("Transaction successful:", tx);
  }

  async function claimApplications() {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = new ethers.Wallet("23db46afdcef2a3a18cf85b9a21847fbfba0d356b48eecbfb8dd4f7b76f45a80", provider);
    
    const submitContract = new ethers.Contract(UsedAddress, AllowanceClaimABI, signer);
    const tx = await submitContract.claimAllowance(1);
    await tx.wait();
    console.log("Transaction successful:", tx);
  }

  const checkConnection = async () => {
    const { ethereum } = window;
    if (ethereum) {
      sethaveMetamask(true);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setclient({
          isConnected: true,
          address: accounts[0],
        });
      } else {
        setclient({
          isConnected: false,
        });
      }
    } else {
      sethaveMetamask(false);
    }
  };

  const connectWeb3 = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setclient({
        isConnected: true,
        address: accounts[0],
      });
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="fren-nav d-flex">
        <div>
          <h3>Jom Claim</h3>
        </div>
        <div className="d-flex" style={{ marginLeft: "auto" }}>
          <div>
            <button className="btn connect-btn" onClick={connectWeb3}>
              {client.isConnected ? (
                <>
                  {client.address.slice(0, 4)}...
                  {client.address.slice(38, 42)}
                </>
              ) : (
                <>Connect Wallet</>
              )}
            </button>
          </div>
          <div>
            <Link href="https://github.com/0efb6/devmatch-potato">
              <button className="btn tw-btn">GitHub Repo</button>
            </Link>
          </div>
        </div>
      </nav>
      {/* Navbar end */}

      <section className="container d-flex">
        <main>
          <h1 className="main-title">Jom Claim 🚀</h1>

          <p className="main-desc">
            Portal for Jom Claim! <br />
          </p>

          {/* ---- */}
          <p>
            {!haveMetamask ? (
              <Metamask />
            ) : client.isConnected ? (
              <>
                <br />
                <h2>You're connected ✅</h2>
                <button
                  onClick={submitApplications}
                  type="button"
                  className="btn sign-btn"
                >
                  Submit Application
                </button>
                <button
                  onClick={verifyApplications}
                  type="button"
                  className="btn sign-btn"
                >
                  Verify Application
                </button>
                <button
                  onClick={signApplications}
                  type="button"
                  className="btn sign-btn"
                >
                  Sign Application
                </button>
                <button
                  onClick={claimApplications}
                  type="button"
                  className="btn sign-btn"
                >
                  Claim Allowance
                </button>
              </>
            ) : (
              <>
                <br />
                <button className="btn connect-btn" onClick={connectWeb3}>
                  Connect Wallet
                </button>
              </>
            )}
          </p>
          {/* ---- */}
        </main>
      </section>
    </>
  );
};

export default Index;
