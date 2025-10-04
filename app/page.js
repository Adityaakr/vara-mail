'use client';

import { useState, useEffect } from 'react';
import { getMagic } from '../lib/magic';
import { loginWithEmail } from '../auth/email';
import { sendVaraTokens } from '../chain/transfer';
import { isVaraAddress, formatVaraAddress, getAddressInfo } from '../utils/address';
import { validateVaraAmount, getSuggestedAmounts, formatVaraAmount as formatAmount } from '../utils/amount';
import './globals.css';

export default function VaraNetworkHome() {
  const [email, setEmail] = useState('');
  const [addr, setAddr] = useState('');
  const [dest, setDest] = useState('');
  const [amt, setAmt] = useState('1'); // VARA amount in human-readable format
  const [amountType, setAmountType] = useState('VARA'); // 'VARA' or 'base'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [txHash, setTxHash] = useState('');
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [loading, setLoading] = useState(true);
  const [magicError, setMagicError] = useState(false);

  useEffect(() => {
    // Check existing login
    const checkExistingLogin = async () => {
      const magic = getMagic();
      if (magic) {
        try {
          const magicIsLoggedIn = await magic.user.isLoggedIn();
          setIsLoggedIn(magicIsLoggedIn);
          
          if (magicIsLoggedIn) {
            try {
              // Get user metadata first
              let userInfo = { email: 'Vara Network User' };
              try {
                const metadata = await magic.user.getInfo();
                if (metadata && metadata.email) {
                  userInfo = { email: metadata.email };
                }
              } catch (metaError) {
                console.warn('Could not get user metadata:', metaError);
              }
              
              // Get Vara Network address
              const originalAddress = await magic.polkadot.getAccount();
              const addressInfo = getAddressInfo(originalAddress);
              console.log('Existing session address info:', addressInfo);
              console.log('User info:', userInfo);
              
              // Convert to Vara Network format
              const varaAddress = formatVaraAddress(originalAddress);
              setAddr(varaAddress);
              setUserMetadata(userInfo);
            } catch (error) {
              console.error('Error getting Vara Network account:', error);
              // Try to get at least user info if address fails
              try {
                const metadata = await magic.user.getInfo();
                if (metadata && metadata.email) {
                  setUserMetadata({ email: metadata.email });
                }
              } catch (metaError) {
                console.warn('Could not get user metadata after address error:', metaError);
              }
            }
          }
          setLoading(false);
        } catch (error) {
          console.error('Error checking login status:', error);
          setLoading(false);
        }
      } else {
        setMagicError(true);
        setLoading(false);
      }
    };
    
    checkExistingLogin();
  }, []);


  async function handleEmailLogin(e) {
    e.preventDefault();
    try {
      const varaAddress = await loginWithEmail(email);
      setAddr(varaAddress);
      setIsLoggedIn(true);
      
      // Try to get user metadata from Magic, fallback to email input
      let userInfo = { email: email };
      try {
        const magic = getMagic();
        if (magic) {
          const metadata = await magic.user.getInfo();
          if (metadata && metadata.email) {
            userInfo = { email: metadata.email };
          }
        }
      } catch (metaError) {
        console.warn('Could not get user metadata after login:', metaError);
      }
      
      setUserMetadata(userInfo);
      console.log('Login successful for:', userInfo.email);
      console.log('Vara Network address:', varaAddress);
    } catch (error) {
      console.error('Vara Network email login error:', error);
      alert('Login failed: ' + error.message);
    }
  }


  async function handleLogout() {
    const magic = getMagic();
    if (magic) {
      await magic.user.logout();
    }
    setIsLoggedIn(false);
    setAddr('');
    setUserMetadata({});
    setTxHash('');
  }

  async function refreshAddress() {
    const magic = getMagic();
    if (magic && isLoggedIn) {
      try {
        console.log('Refreshing Vara Network address...');
        const originalAddress = await magic.polkadot.getAccount();
        const addressInfo = getAddressInfo(originalAddress);
        console.log('Refreshed address info:', addressInfo);
        
        const varaAddress = formatVaraAddress(originalAddress);
        setAddr(varaAddress);
        console.log('Address refreshed:', varaAddress);
      } catch (error) {
        console.error('Error refreshing address:', error);
        alert('Failed to refresh address: ' + error.message);
      }
    }
  }

  async function handleSendVaraTransaction() {
    if (!dest || !amt) {
      alert('Please fill in destination Vara Network address and VARA amount');
      return;
    }

    // Validate amount
    const validation = validateVaraAmount(amt);
    if (!validation.isValid) {
      alert(`Invalid amount: ${validation.error}`);
      return;
    }

    setSendingTransaction(true);
    try {
      // Send with VARA amount (will be converted to base units automatically)
      const txHash = await sendVaraTokens(dest, amt);
      setTxHash(txHash);
      
      // Show success message with formatted amount
      const formattedAmount = formatAmount(amt);
      alert(`✅ ${formattedAmount} sent successfully to Vara Network!`);
      
      // Clear form
      setDest('');
      setAmt('1');
    } catch (error) {
      console.error('Vara Network transaction error:', error);
      alert('❌ Transaction failed: ' + error.message);
    }
    setSendingTransaction(false);
  }

  if (loading) {
    return (
      <main style={{ padding: 24, textAlign: 'center' }}>
        <h1>Loading Vara Network...</h1>
      </main>
    );
  }

  if (magicError) {
    return (
      <main style={{ padding: 24, textAlign: 'center' }}>
        <h1>Configuration Required</h1>
        <div className="container">
          <h2>Authentication Service Setup Needed</h2>
          <p>To use this application, you need to:</p>
          <ol style={{ textAlign: 'left', margin: '20px 0' }}>
            <li>Configure authentication service</li>
            <li>Set up API credentials</li>
            <li>Create environment configuration</li>
            <li>Add domain to allowlist</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Vara Network - Secure Access</h1>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Seamless Web3 onboarding for Vara Network with passwordless authentication
      </p>

      {!isLoggedIn ? (
        <div className="container">
          <h2>🚀 Access Vara Network</h2>
          <p style={{ 
            color: '#4a5568', 
            fontSize: '16px', 
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Enter your email to get started with secure, passwordless authentication
          </p>
          
          <form onSubmit={handleEmailLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#2d3748',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email Address
              </label>
              <input 
                name="email" 
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  fontSize: '18px',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '2px solid rgba(0, 212, 170, 0.2)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 212, 170, 0.1)'
                }}
              />
            </div>
            
            <button 
              type="submit"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                padding: '20px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #00d4aa 0%, #00a085 100%)',
                border: 'none',
                color: 'white',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(0, 212, 170, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              🔐 Secure Email Authentication
            </button>
          </form>

          <div style={{ 
            marginTop: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)',
            borderRadius: '16px',
            border: '2px solid rgba(0, 212, 170, 0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '12px' 
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>✨</span>
              <h3 style={{ 
                margin: 0, 
                color: '#065f46', 
                fontSize: '16px',
                fontWeight: '700'
              }}>
                Why Passwordless?
              </h3>
            </div>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px', 
              color: '#047857',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <li>🔒 <strong>No passwords</strong> - Ultra-secure authentication</li>
              <li>⚡ <strong>Instant access</strong> - One-click email verification</li>
              <li>🛡️ <strong>Account abstraction</strong> - Your keys, secured & managed</li>
              <li>🌐 <strong>Native Vara</strong> - Direct integration with Vara Network</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="user-info">
              <div className="avatar">
                {userMetadata.email ? userMetadata.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <h2 className="user-name">
                  {userMetadata.email ? userMetadata.email.split('@')[0] : 'User'}
                </h2>
                <p className="user-email">{userMetadata.email || 'user@example.com'}</p>
              </div>
            </div>
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              title="Logout"
            >
              🚪
            </button>
          </div>

          {/* Main Dashboard Content */}
          <div className="dashboard-content">
            
            {/* Primary Account Card - Full Width */}
            <div className="main-account-card">
              <div className="account-info-section">
                <h3>🏠 Your Vara Network Account</h3>
                <div className="status-indicator">
                  <span className={`status-dot ${isVaraAddress(addr) ? 'connected' : 'warning'}`}></span>
                  <span className="status-text">
                    {isVaraAddress(addr) ? 'Native SS58 Format' : 'Generic Format'}
                  </span>
                </div>
              </div>

              <div className="address-section">
                <div className="address-header">
                  <h4>Vara Network Address</h4>
                  <div className="address-actions">
                    {!addr && isLoggedIn && (
                      <button 
                        className="refresh-address-btn"
                        onClick={refreshAddress}
                        title="Refresh address"
                      >
                        🔄 Refresh
                      </button>
                    )}
                    <button 
                      className="copy-address-btn"
                      onClick={() => {
                        if (addr) {
                          navigator.clipboard.writeText(addr);
                          alert('Address copied!');
                        } else {
                          alert('No address to copy yet');
                        }
                      }}
                      title="Copy address"
                      disabled={!addr}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
                <div className="address-display-box">
                  <span className="address-value">
                    {addr ? addr : (isLoggedIn ? 'Loading your Vara Network address...' : 'Address will appear after login')}
                  </span>
                </div>
                <p className="address-description">
                  This is your unique Vara Network address in SS58 format
                </p>
              </div>

              <div className="actions-section">
                <a 
                  href={`https://vara.subscan.io/account/${addr}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="dashboard-action-btn primary"
                >
                  🔍 View on Explorer
                </a>
                <a 
                  href="https://idea.gear-tech.io/programs?node=wss%3A%2F%2Ftestnet.vara.network" 
                  target="_blank" 
                  rel="noreferrer"
                  className="dashboard-action-btn secondary"
                >
                  💧 Get Testnet Tokens
                </a>
              </div>
            </div>

            {/* Info Cards Row */}
            <div className="info-cards-row">
              <div className="info-card network-info">
                <h4>🌐 Network Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Network</span>
                    <span className="info-value">Vara Mainnet</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Token</span>
                    <span className="info-value">VARA</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Format</span>
                    <span className="info-value">SS58 Native</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className="info-value connected">🟢 Connected</span>
                  </div>
                </div>
              </div>

              <div className="info-card security-info">
                <h4>🔐 Security Features</h4>
                <div className="security-list">
                  <div className="security-item">
                    <span className="security-icon">🛡️</span>
                    <div className="security-details">
                      <strong>Account Abstraction</strong>
                      <p>Keys securely managed</p>
                    </div>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">🔒</span>
                    <div className="security-details">
                      <strong>Passwordless Auth</strong>
                      <p>Email-based access</p>
                    </div>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">⚡</span>
                    <div className="security-details">
                      <strong>Instant Transactions</strong>
                      <p>No wallet popups</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
