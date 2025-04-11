'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { WalletService, WalletInfo } from '@/services/wallet';

export default function WalletPage() {
  const [walletService, setWalletService] = useState<WalletService | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageToSign, setMessageToSign] = useState<string>('');
  const [signature, setSignature] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState<boolean>(false);

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
      setSignature(null);
    }
  };

  const handleSignMessage = async () => {
    if (!walletService || !messageToSign.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    setIsSigning(true);
    setError(null);

    try {
      const sig = await walletService.signMessage(messageToSign);
      setSignature(sig);
    } catch (err) {
      console.error('Failed to sign message:', err);
      setError('Failed to sign message. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wallet Management
          </h1>
          <p className="mt-4 text-gray-600">
            Connect your wallet and sign messages securely
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r mb-8 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 backdrop-blur-lg border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Wallet Connection</h2>
          </div>
          
          <div className="p-6">
            {walletInfo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Address</span>
                  <span className="text-sm font-mono bg-gray-50 px-3 py-1 rounded">{walletInfo.address}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Network</span>
                  <span className="text-sm font-medium">{walletInfo.networkName}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Chain ID</span>
                  <span className="text-sm font-medium">{walletInfo.chainId}</span>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <span className="text-gray-600">Balance</span>
                  <span className="text-lg font-bold">{parseFloat(walletInfo.balance).toFixed(4)} ETH</span>
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </span>
                  ) : (
                    'Connect MetaMask'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {walletInfo && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Sign Message</h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Sign
                </label>
                <textarea
                  id="message"
                  value={messageToSign}
                  onChange={(e) => setMessageToSign(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  rows={4}
                  placeholder="Enter a message to sign with your wallet"
                />
              </div>
              <button
                onClick={handleSignMessage}
                disabled={isSigning || !messageToSign.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigning ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing...
                  </span>
                ) : (
                  'Sign Message'
                )}
              </button>
              
              {signature && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Signature</h3>
                  <div className="font-mono text-xs break-all text-gray-600 bg-white p-3 rounded border border-gray-200">
                    {signature}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 