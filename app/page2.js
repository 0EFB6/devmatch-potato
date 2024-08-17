import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        const storedWalletAddress = sessionStorage.getItem("walletAddress");
        if (storedWalletAddress) {
          setWalletAddress(storedWalletAddress);
        }
      }, []);

      const handleUserLogin = async (data) => {
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
            `🦄 Login successfully!
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
          console.error("Error Login:", error);
          toast.error("🦄 Error Login", {
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
        <main className="flex min-h-screen flex-col items-center justify-center ">
          <h1 className="font-bold text-2xl uppercase text-center">
            Maschain API Workshop Demo
          </h1>
          <p className="text-sm text-gray-500 lowercase font-normal mt-4">
            {walletAddress ? (
              <>
                {`Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
                  -4
                )}`}
                <div className="flex flex-col items-center justify-center">
                  <button
                    onClick={openMintModal}
                    className="mt-4 border w-full rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Login
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