import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WalletConnect from './WalletConnect';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  
  return (
    <div className="layout">
      <header className="header">
        <div className="logo">
          <Link href="/">
            <a>PermaDiscover</a>
          </Link>
        </div>
        <nav className="nav">
          <Link href="/">
            <a className={router.pathname === '/' ? 'active' : ''}>Home</a>
          </Link>
          <Link href="/discover">
            <a className={router.pathname === '/discover' ? 'active' : ''}>Discover</a>
          </Link>
          <Link href="/upload">
            <a className={router.pathname === '/upload' ? 'active' : ''}>Upload</a>
          </Link>
          <Link href="/wallet">
            <a className={router.pathname === '/wallet' ? 'active' : ''}>Wallet</a>
          </Link>
          <Link href="/about">
            <a className={router.pathname === '/about' ? 'active' : ''}>About</a>
          </Link>
        </nav>
        <div className="wallet-section">
          <WalletConnect />
        </div>
      </header>
      
      <main className="main">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} PermaDiscover. All rights reserved.</p>
      </footer>
      
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .logo a {
          font-size: 1.5rem;
          font-weight: bold;
          color: #4a90e2;
          text-decoration: none;
        }
        
        .nav {
          display: flex;
          gap: 1.5rem;
        }
        
        .nav a {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
          position: relative;
        }
        
        .nav a:hover {
          color: #4a90e2;
        }
        
        .nav a.active {
          color: #4a90e2;
        }
        
        .nav a.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #4a90e2;
        }
        
        .wallet-section {
          margin-left: 1rem;
        }
        
        .main {
          flex: 1;
          padding: 2rem;
          background-color: #f9f9f9;
        }
        
        .footer {
          padding: 1.5rem;
          text-align: center;
          background-color: #333;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Layout; 