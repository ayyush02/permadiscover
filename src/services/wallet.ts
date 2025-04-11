import { ethers } from 'ethers';

export type WalletType = 'metamask' | 'walletconnect' | 'coinbase';

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  networkName: string;
  isConnected: boolean;
}

export class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private walletInfo: WalletInfo = {
    address: '',
    balance: '0',
    chainId: 0,
    networkName: '',
    isConnected: false
  };

  /**
   * Initialize the wallet service
   */
  async initialize(): Promise<void> {
    // Check if window.ethereum is available
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: unknown) => {
        this.handleAccountsChanged(accounts as string[]);
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: unknown) => {
        this.handleChainChanged(chainId as string);
      });
    }
  }

  /**
   * Connect to a wallet
   * @param walletType - The type of wallet to connect to
   * @returns The wallet info
   */
  async connectWallet(walletType: WalletType = 'metamask'): Promise<WalletInfo> {
    if (!this.provider) {
      throw new Error('No Web3 provider available. Please install MetaMask or another Web3 wallet.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' }) as string[];
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }
      
      // Get the signer
      this.signer = await this.provider.getSigner();
      
      // Get the address
      const address = await this.signer.getAddress();
      
      // Get the network
      const network = await this.provider.getNetwork();
      
      // Get the balance
      const balance = await this.provider.getBalance(address);
      
      // Update wallet info
      this.walletInfo = {
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        networkName: network.name,
        isConnected: true
      };
      
      return this.walletInfo;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  /**
   * Disconnect the wallet
   */
  disconnectWallet(): void {
    this.signer = null;
    this.walletInfo = {
      address: '',
      balance: '0',
      chainId: 0,
      networkName: '',
      isConnected: false
    };
  }

  /**
   * Get the current wallet info
   * @returns The wallet info
   */
  getWalletInfo(): WalletInfo {
    return this.walletInfo;
  }

  /**
   * Check if a wallet is connected
   * @returns True if a wallet is connected
   */
  isWalletConnected(): boolean {
    return this.walletInfo.isConnected;
  }

  /**
   * Get the signer
   * @returns The signer
   */
  getSigner(): ethers.Signer | null {
    return this.signer;
  }

  /**
   * Get the provider
   * @returns The provider
   */
  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  /**
   * Sign a message
   * @param message - The message to sign
   * @returns The signature
   */
  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('No signer available. Please connect your wallet.');
    }
    
    try {
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  /**
   * Handle account changes
   * @param accounts - The new accounts
   */
  private async handleAccountsChanged(accounts: string[]): Promise<void> {
    if (accounts.length === 0) {
      // User disconnected their wallet
      this.disconnectWallet();
    } else {
      // User switched accounts
      if (this.provider && this.signer) {
        const address = accounts[0];
        const balance = await this.provider.getBalance(address);
        const network = await this.provider.getNetwork();
        
        this.walletInfo = {
          ...this.walletInfo,
          address,
          balance: ethers.formatEther(balance),
          chainId: Number(network.chainId),
          networkName: network.name
        };
      }
    }
  }

  /**
   * Handle chain changes
   * @param chainId - The new chain ID
   */
  private async handleChainChanged(chainId: string): Promise<void> {
    if (this.provider) {
      const network = await this.provider.getNetwork();
      
      this.walletInfo = {
        ...this.walletInfo,
        chainId: Number(chainId),
        networkName: network.name
      };
    }
  }
} 