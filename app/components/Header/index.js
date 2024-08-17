"use client";
import React, { useState } from "react";
import CreateWalletModal from "../Create-wallet";
import WalletSwitcher from "../Switch-wallet"
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSwitchWalletModalOpen, setIsSwitchWalletModalOpen] = useState(false);

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

  return (
    <header className="w-full py-6 lg:py-4 relative border-b">
      <div className="container mx-auto px-8 lg:px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Maschain Demo</h1>
        </div>
        <button
          onClick={openModal}
          className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
        >
          {typeof window !== "undefined" &&
          window.sessionStorage.getItem("walletAddress") ? (
            <span className="text-sm">
              {`${getWalletAddressByIndex("currentWalletIndex")
                .slice(0, 6)}...${getWalletAddressByIndex("currentWalletIndex")
                .slice(-4)}`}
            </span>
          ) : (
            "Create Wallet"
          )}
        </button>
        <button
          onClick={openSwitchWalletModal}
          className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300">
          Switch Wallet
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
            <CreateWalletModal onSubmit={handleSubmit} onClose={closeModal} />
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
