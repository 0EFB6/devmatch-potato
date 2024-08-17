import { useState, useEffect } from 'react';

const WalletSwitcher = ({ onClose }) => {
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const updateWalletAddresses = () => {
      const storedAddresses = sessionStorage.getItem('walletAddresses');
      if (storedAddresses) {
        try {
          const parsedAddresses = JSON.parse(storedAddresses);
          if (Array.isArray(parsedAddresses) && parsedAddresses.length > 0) {
            setWalletAddresses(parsedAddresses);
            setCurrentAddress(parsedAddresses[currentIndex] || '');
          } else {
            throw new Error('Invalid wallet addresses format');
          }
        } catch (error) {
          console.error('Failed to parse wallet addresses:', error);
          
        }
      } else {
        const defaultAddresses = ['0x001'];
        sessionStorage.setItem('walletAddresses', JSON.stringify(defaultAddresses));
        setWalletAddresses(defaultAddresses);
        setCurrentAddress(defaultAddresses[0]);
      }
    };

    updateWalletAddresses();

    // Listen for wallet updates
    window.addEventListener('walletUpdated', updateWalletAddresses);

    return () => {
      window.removeEventListener('walletUpdated', updateWalletAddresses);
    };
  }, [currentIndex]);

  const switchWallet = (address) => {
    const index = walletAddresses.indexOf(address);
    if (index !== -1) {
      setCurrentAddress(address);
      setCurrentIndex(index);
      console.log(`Switched to wallet address: ${address
        } at index: ${index}`);
      sessionStorage.setItem('currentWalletIndex', index.toString());
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-96 w-3/4">
        <h2 className="text-2xl font-bold mb-8">Wallet Switcher</h2>
        <p>Current Wallet Address: <span>{currentAddress}</span></p>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Available Wallets</h3>
          {/* <ul className="space-y-2">
            {walletAddresses.map((address) => (
              <li key={address} className="cursor-pointer hover:bg-gray-100 p-2 rounded-md" onClick={() => switchWallet(address)}>
                {address}
              </li>
            ))}
          </ul> */}
          <ul className="space-y-2">
            {walletAddresses
                .filter((_, index) => index !== 0) // Filter out the item at index 0
                .map((address) => (
                <li
                    key={address}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => switchWallet(address)}
                >
                    {address}
                </li>
                ))}
            </ul>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="mr-2 px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletSwitcher;
