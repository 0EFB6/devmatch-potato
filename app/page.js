"use client";
import { useState, useEffect } from "react";
import ApplicationModal from "./components/Application";
import WalletListModal from "./components/WalletList";
import MintTokenModal from "./components/Mint-token";
import TransferTokenModal from "./components/Transfer-token";
import GetInfoModal from "./components/Get-Info";
import GetCertificateListModal from "./components/Get-certificate-list";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CertificateList from "./GetCert";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);

  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isGetCertificateListModalOpen, setIsGetCertificateListModalOpen] = useState(false);
  const [isApplicationModal, setIsApplicationModal] = useState(false);
  const [isWalletListModal, setIsWalletListModal] = useState(false);

  const openMintModal = () => {
    setIsMintModalOpen(true);
  };

  const closeMintModal = () => {
    setIsMintModalOpen(false);
  };

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const openInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  }

  const openGetCertificateListModal = () => {
    setIsGetCertificateListModalOpen(true);
  }

  const closeGetCertificateListModal = () => {
    setIsGetCertificateListModalOpen(false);
  }

  const openApplicationModal = () => {
    setIsApplicationModal(true);
  }

  const closeApplicationModal = () => {
    setIsApplicationModal(false);
  }

  const openWalletListModal = () => {
    setIsWalletListModal(true);
  }

  const closeWalletListModal = () => {
    setIsWalletListModal(false);
  }

  const getWalletAddressByIndex = (index) => {
    // Retrieve and parse the wallet addresses from session storage
    const storedAddresses = sessionStorage.getItem('walletAddresses');
    if (storedAddresses) {
      try {
        const walletAddresses = JSON.parse(storedAddresses);
  
        // Check if index is within bounds
        if (Array.isArray(walletAddresses) && index >= 0 && index < walletAddresses.length) {
          return walletAddresses[index];
        } else {
          throw new Error('Index out of bounds or invalid data format');
        }
      } catch (error) {
        console.error('Failed to parse wallet addresses:', error);
        return null; // or handle it as needed
      }
    } else {
      console.error('No wallet addresses found in session storage');
      return null; // or handle it as needed
    }
  };

  useEffect(() => {
    const storedWalletAddress = getWalletAddressByIndex(sessionStorage.getItem('currentWalletIndex'));
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const clearWalletAddress = () => {
    sessionStorage.removeItem("walletAddress");
    setWalletAddress(null);
  };

  //fix function here late
  const handleMintSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/mint`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mint token");
      }

      const result = await response.json();
      console.log("Token Minted:", result);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 Minted token successfully!
        Wallet address: ${walletAddress}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      closeMintModal();
    } catch (error) {
      console.error("Error minting token:", error);
      toast.error("🦄 Error minting token", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Don't send the request if there's an error
      return;
    }
  };

  //fix function here late
  const handleTransferSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/token-transfer`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to transfer token");
      }

      const result = await response.json();
      console.log("Transfered Token:", result);
      // const walletAddress = result.result.wallet.wallet_address;
      // //   console.log("Wallet address:", walletAddress);
      // // Store the wallet address in sessionStorage
      // sessionStorage.setItem("walletAddress", walletAddress);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 Token transfered successfully!
        Wallet address: ${walletAddress}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      closeTransferModal();
    } catch (error) {
      console.error("Error transfering token:", error);
      toast.error("🦄 Error transfering token", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Don't send the request if there's an error
      return;
    }
  };

  const handleGetInfoSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/balance`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      console.log("Data:", data);
      if (!response.ok) {
        throw new Error("Failed to get token info");
      }

      const result = await response.json();
      console.log("Token Info:", result);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 Token info successfully!
        Wallet address: ${walletAddress}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      closeInfoModal();
    } catch (error) {
      console.error("Error getting token info:", error);
      toast.error("🦄 Error getting token info", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Don't send the request if there's an error
      return;
    }
  }

  // const handleGetCertificateListSubmit = async (data) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/certificate/get-smart-contract`,
  //       {
  //         method: "GET",
  //         headers: {
  //           client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  //           client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to get token transactions");
  //     }

  //     const result = await response.json();
  //     console.log("Certificate List:", result);

  //     if (!walletAddress) {
  //       throw new Error("Wallet address not found in the response");
  //     }

  //     toast.success(
  //       `🦄 Get Certifiacte List successfully!
  //       Wallet address: ${walletAddress}`,
  //       {
  //         position: "bottom-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       }
  //     );
  //     closeGetCertificateListModal();
  //   } catch (error) {
  //     console.error("Error getting certificate list:", error);
  //     toast.error("🦄 Error getting certificate list", {
  //       position: "bottom-center",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //     // Don't send the request if there's an error
  //     return;
  //   }
  // }

  const findWalletsByName = (wallets, namee) => {
    if (!Array.isArray(wallets)) {
      console.error('Expected an array but got:', wallets);
      return [];
    }
    const searchName = namee.trim().toLowerCase();
    wallets.forEach(wallet => {
      if (wallet.name.trim().toLowerCase() === searchName) {
          console.log("functiondebug: ",wallet.address);
          sessionStorage.setItem("findWalletAddress", wallet.address);
      }
    });
  };

  const getWalletByName = async (namee) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/wallet?type=2`,
            {
                method: "GET",
                headers: {
                    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to list wallet");
        }

        const result = await response.json();
        sessionStorage.setItem("walletss", JSON.stringify(result));

        const wallets = result.result;

        if (!Array.isArray(wallets)) {
            console.error('Expected an array but got:', wallets);
            return null; // or [] if you prefer to return an empty array
        }

        const searchName = namee.trim().toLowerCase();
        for (const wallet of wallets) {
            if (wallet.name.trim().toLowerCase() === searchName) {
              // console.log("functiondebug: ",wallet.address);
                sessionStorage.setItem("getWalletAddress", wallet.address);
                toast.success("🦄 Wallet found successfully!", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                closeApplicationModal(); // Assuming this function is defined elsewhere
                return wallet.address; // Return the wallet address when found
            }
        }

        toast.info("🦄 Wallet not found", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

        return null; // Return null if no matching wallet is found
    } catch (error) {
        console.error("Error listing wallet:", error);
        toast.error("🦄 Error listing wallet", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        return null; // Return null in case of an error
    }
};


  const handleApplicationSubmit = async (formData) => {
    try {
      console.log("Applicant(form):", sessionStorage.getItem("applicantName"));
      console.log("Wallet Address(form):", sessionStorage.getItem("applicantWalletAddress"));
      sessionStorage.removeItem("getWalletAddress");
      console.log("Applicant name", sessionStorage.getItem("applicantName"));
      getWalletByName(sessionStorage.getItem("applicantName"))
      .then(address => {
          console.log('Wallet Address(db):', address);
          if (address === sessionStorage.getItem("applicantWalletAddress")) {
              console.log("Application verified.")
              sessionStorage.setItem("signStatus", "Verified");
          }
          else
          { 
              console.log("Application not verified.")
              sessionStorage.setItem("signStatus", "Not Verified");
          }
          // You can now use the wallet address as needed
      })
      .catch(error => {
          console.error('Error handling wallet search:', error);
      });
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/certificate/mint-certificate`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          },
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
  
      const result = await response.json();
      console.log("Result:", result);
  
      toast.success("🦄 Application submitted successfully!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  
      closeApplicationModal();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("🦄 Error submitting application", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleWalletList = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/wallet?type=2`,
        {
          method: "GET",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: data,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to list wallet");
      }
  
      const result = await response.json();
      sessionStorage.setItem("walletss", result);
      console.log("Wallets:", result);
      findWalletsByName(result.result, sessionStorage.getItem("listWalletName"));
  
      toast.success("🦄 List wallet successfully!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  
      closeApplicationModal();
    } catch (error) {
      console.error("Error listing wallet:", error);
      toast.error("🦄 Error listing wallet", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const [certificateList, setCertificateList] = useState([]);

const handleGetCertificateListSubmit = async (data) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/certificate/get-certificate?to=${sessionStorage.getItem("walletAddressForApi")}`,
            {
                method: "GET",
                headers: {
                    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to get certificate list");
        }

        const result = await response.json();
        console.log("Certificate List:", result);
        // console.log("trx: ", result.result[0].transactionHash);
        // console.log("contract address: ", result.result[0].token.contract_address);
        // console.log("from: ", result.result[0].from_wallet);
        // console.log("to: ", result.result[0].to_wallet);
        // console.log("time: ", result.result[0].created_at);
        // console.log("time: ", sessionStorage.getItem("applicantName"));

        // session storage store all
        sessionStorage.setItem("signtransactionHash", result.result[0].transactionHash);
        sessionStorage.setItem("signcontractAddress", result.result[0].token.contract_address);
        sessionStorage.setItem("signfromWallet", result.result[0].from_wallet);
        sessionStorage.setItem("signtoWallet", result.result[0].to_wallet);
        sessionStorage.setItem("signcreatedAt", result.result[0].created_at);
        
        console.log("sessionStorage: ", sessionStorage.getItem("signtransactionHash"));
        console.log("sessionStorage: ", sessionStorage.getItem("signcontractAddress"));
        console.log("sessionStorage: ", sessionStorage.getItem("signfromWallet"));
        console.log("sessionStorage: ", sessionStorage.getItem("signtoWallet"));
        console.log("sessionStorage: ", sessionStorage.getItem("signcreatedAt"));
        console.log("sessionStorage: ", sessionStorage.getItem("applicantName"));
        console.log("sessionStorage: ", sessionStorage.getItem("signStatus"));

        // Check if the response has the expected data
        if (result.status === 200 && Array.isArray(result.result)) {
            setCertificateList(result.result);
            toast.success(
                `🦄 Get Certificate List successfully!`,
                {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
            );
            closeGetCertificateListModal();
        } else {
            throw new Error("Unexpected response format");
        }
    } catch (error) {
        console.error("Error getting certificate list:", error);
        toast.error("🦄 Error getting certificate list", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
};


  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <h1 className="font-bold text-2xl uppercase text-center">
        Jom Claim Demo
      </h1>
      <p className="text-sm text-gray-500 lowercase font-normal mt-4">
        {walletAddress ? (
          <>
            {`Connected: ${walletAddress}`}
            {/* ...${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )} */}
           {/* <CertificateList certificates={certificateList} /> */}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={clearWalletAddress}
                className="w-full mt-4 border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Disconnect Wallet
              </button>
              {/* <button
                onClick={openMintModal}
                className="mt-4 border w-full rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Mint Token
              </button>

              <button
                onClick={openTransferModal}
                className="mt-4 w-full border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Transfer Token
              </button>

              <button
                onClick={openInfoModal}
                className="mt-4 w-full border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Get Account Balance Info
              </button> */}

              <button
                onClick={openApplicationModal}
                className="mt-4 w-full border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Submit Application
              </button>

              <button
                onClick={openGetCertificateListModal}
                className="mt-4 w-full border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Get Certifiacte
              </button>

              <button
                onClick={openWalletListModal}
                className="mt-4 w-full border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Get Wallet List
              </button>
            </div>
          </>
        ) : (
          "Create Wallet to Get Started"
        )}
      </p>
      <AnimatePresence>
        {isMintModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MintTokenModal
              onSubmit={handleMintSubmit}
              onClose={closeMintModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTransferModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <TransferTokenModal
              onSubmit={handleTransferSubmit}
              onClose={closeTransferModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isInfoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <GetInfoModal
              onSubmit={handleGetInfoSubmit}
              onClose={closeInfoModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isGetCertificateListModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <GetCertificateListModal
              onSubmit={handleGetCertificateListSubmit}
              onClose={closeGetCertificateListModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isApplicationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <ApplicationModal
              onSubmit={handleApplicationSubmit}
              onClose={closeApplicationModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isWalletListModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <WalletListModal
              onSubmit={handleWalletList}
              onClose={closeWalletListModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  );
}
