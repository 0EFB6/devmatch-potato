// utils/walletUtils.js
export const getWalletAddressByIndex = (index) => {
    const storedAddresses = sessionStorage.getItem('walletAddresses');
    if (storedAddresses) {
      try {
        const walletAddresses = JSON.parse(storedAddresses);
  
        if (Array.isArray(walletAddresses) && index >= 0 && index < walletAddresses.length) {
          return walletAddresses[index];
        } else {
          throw new Error('Index out of bounds or invalid data format');
        }
      } catch (error) {
        console.error('Failed to parse wallet addresses:', error);
        return null;
      }
    } else {
      console.error('No wallet addresses found in session storage');
      return null;
    }
  };  