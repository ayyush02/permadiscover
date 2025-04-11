import { useState, useEffect } from 'react';
import { WalletService, WalletInfo } from '../services/wallet';

export default function WalletConnect() {
  const [walletService, setWalletService] = useState<WalletService | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initWalletService = async () => {
      try {
        const service = new WalletService();
        await service.initialize();
        setWalletService(service);
        
        // Check if wallet is already connected
        if (service.isWalletConnected()) {
          setWalletInfo(service.getWalletInfo());
        }
      } catch (err) {
        console.error('Failed to initialize wallet service:', err);
        setError('Failed to initialize wallet service. Please make sure MetaMask is installed.');
      }
    };

    initWalletService();
  }, []);

  const handleConnectWallet = async () => {
    if (!walletService) {
      setError('Wallet service not initialized');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const info = await walletService.connectWallet('metamask');
      setWalletInfo(info);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    if (walletService) {
      walletService.disconnectWallet();
      setWalletInfo(null);
    }
  };

  return (
    <div className="wallet-connect-container">
      <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {walletInfo ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Wallet Connected</p>
          <p>Address: {walletInfo.address.substring(0, 6)}...{walletInfo.address.substring(walletInfo.address.length - 4)}</p>
          <p>Network: {walletInfo.networkName}</p>
          <p>Balance: {parseFloat(walletInfo.balance).toFixed(4)} ETH</p>
          <button
            onClick={handleDisconnectWallet}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          disabled={isConnecting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      )}
    </div>
  );
} 