"use client";
import React, { useState } from "react";
import CreateWalletModal from "../Create-wallet";
import GetSignModal from "../signing";
import WalletSwitcher from "../Switch-wallet"
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get } from "http";
import LogIn from "../LogIn";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSwitchWalletModalOpen, setIsSwitchWalletModalOpen] = useState(false);
  const [isSignModalOpen, setIsSigntModalOpen] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSwitchWalletModal = () => {
    setIsSwitchWalletModalOpen(true);
  };

  const closeSwitchWalletModal = () => {
    setIsSwitchWalletModalOpen(false);
  };

  const openSignModal = () => {
    setIsSigntModalOpen(true);
  };

  const closeSignModal = () => {
    setIsSigntModalOpen(false);
  };

  const openLogIn = () => {
    setIsLogIn(true);
  };

  const closeLogIn = () => {
    setIsLogIn(false);
  };

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/create-user`,
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
        throw new Error("Failed to create user");
      }

      const result = await response.json();
      //   console.log("User created:", result);
      const walletAddress = result.result.wallet.wallet_address;
      let walletAddresses = JSON.parse(sessionStorage.getItem("walletAddresses")) || [];
      walletAddresses.push(walletAddress);
      sessionStorage.setItem("walletAddressForApi", walletAddresses);
      sessionStorage.setItem("walletAddresses", JSON.stringify(walletAddresses));
      sessionStorage.setItem("currentWalletIndex", walletAddresses.length - 1);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 User created successfully!
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
      closeModal();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("🦄 Error creating user", {
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


  const updateWalletInStorage = (newAddress) => {
    // Retrieve the current wallet list from sessionStorage
    const storedAddresses = sessionStorage.getItem('walletAddresses');
    
    if (storedAddresses) {
        try {
            // Parse the JSON string into an array
            const addresses = JSON.parse(storedAddresses);
            console.log('Current wallet addresses:', addresses);
            // check if newAddress is already in the list
            if (addresses.includes(newAddress)) {
                console.error('Address already exists:', newAddress);
                return;
            }
            else
            {
                // Update the address at the specified index
                addresses.push(newAddress);

                // Store the updated list back to sessionStorage
                sessionStorage.setItem('walletAddresses', addresses);
                sessionStorage.setItem('currentWalletIndex', addresses.length - 1);
                console.log(`Updated address at index ${index}: ${newAddress}`);
            }
        } catch (error) {
            console.error('Failed to parse wallet addresses:', error);
        }
    } else {
        console.error('No wallet addresses found in sessionStorage.');
    }
    };


  const handleLogIn = async (data, walletList = null) => {
    try {
        let wallets;
        if (walletList) {
            // Use the provided walletList if available
            wallets = walletList;
        } else {
            // Fetch the wallet list if not provided
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

            wallets = result.result;

            if (!Array.isArray(wallets)) {
                console.error('Expected an array but got:', wallets);
                return null; // or [] if you prefer to return an empty array
            }
        }

        const searchName = data.name.trim().toLowerCase();
        for (const wallet of wallets) {
            if (wallet.name.trim().toLowerCase() === searchName) {
                // Log and store the wallet address if found
                console.log("Login: ", wallet.address);
                updateWalletInStorage(wallet.address);
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
                closeLogIn(); // Assuming this function is defined elsewhere
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

  const handleAccept = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/create-user`,
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
        throw new Error("Failed to sign certificate");
      }

      const result = await response.json();
      //   console.log("User created:", result);
      const walletAddress = result.result.wallet.wallet_address;
      let walletAddresses = JSON.parse(sessionStorage.getItem("walletAddresses")) || [];
      walletAddresses.push(walletAddress);
      sessionStorage.setItem("walletAddressForApi", walletAddresses);
      sessionStorage.setItem("walletAddresses", JSON.stringify(walletAddresses));
      sessionStorage.setItem("currentWalletIndex", walletAddresses.length - 1);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 Certificate signed!
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
      closeSignModal();
    } catch (error) {
      console.error("Error sign certificate:", error);
      toast.error("🦄 Error sign certificate", {
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
      closeSignModal();
      return;
    }
  };

  const handleReject = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/create-user`,
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
        throw new Error("Failed to sign certificate");
      }

      const result = await response.json();
      //   console.log("User created:", result);
      const walletAddress = result.result.wallet.wallet_address;
      let walletAddresses = JSON.parse(sessionStorage.getItem("walletAddresses")) || [];
      walletAddresses.push(walletAddress);
      sessionStorage.setItem("walletAddressForApi", walletAddresses);
      sessionStorage.setItem("walletAddresses", JSON.stringify(walletAddresses));
      sessionStorage.setItem("currentWalletIndex", walletAddresses.length - 1);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 Certificate rejected.
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
      closeSignModal();
    } catch (error) {
      console.error("Error sign certificate:", error);
      toast.error("🦄 Error sign certificate", {
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

  return (
    <header className="w-full py-6 lg:py-4 relative border-b bg-amber-200">
      <div className="container mx-auto px-8 lg:px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-3xl">Jom Claim</h1>
        </div>
        <button
          onClick={openModal}
          className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300 bg-red-400"
        >
          {typeof window !== "undefined" &&
          window.sessionStorage.getItem("walletAddress") ? (
            <span className="text-sm">
              {/* {`${getWalletAddressByIndex("currentWalletIndex")
                .slice(0, 6)}...${getWalletAddressByIndex("currentWalletIndex")
                .slice(-4)}`} */}Register
            </span>
          ) : (
            "Register"
          )}
        </button>
        {/* <button
          onClick={openLogIn}
          className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300">
          Log In
        </button> */}
        <button
          onClick={openSwitchWalletModal}
          className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300">
          Switch Wallet
        </button>
        <button
          onClick={openSignModal}
          className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300">
          Sign application
        </button>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <CreateWalletModal onSubmit={handleSubmit} onClose={closeSignModal} />           
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSwitchWalletModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <WalletSwitcher onClose={closeSwitchWalletModal} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSignModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <GetSignModal onSubmit={handleAccept} onClose={closeSignModal} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isLogIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <LogIn onSubmit={handleLogIn} onClose={closeLogIn} />
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
    </header>
  );
};

export default Header;
