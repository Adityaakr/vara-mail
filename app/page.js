'use client';

import { useState, useEffect } from 'react';
import { getMagic } from '../lib/magic';
import { loginWithEmail } from '../auth/email';
import { isVaraAddress, formatVaraAddress, getAddressInfo } from '../utils/address';
import './globals.css';

export default function VaraNetworkHome() {
  const [email, setEmail] = useState('');
  const [addr, setAddr] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
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
    <main>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <img 
          src="/vara.png" 
          alt="Vara Network" 
          style={{ 
            height: '125px',
            width: 'auto',
            marginBottom: '-16px',
            objectFit: 'contain'
          }} 
        />
        <p style={{ 
          color: '#64748b', 
          fontSize: '18px',
          fontWeight: '500',
          margin: '0 auto',
          maxWidth: '400px',
          lineHeight: '1.6'
        }}>
          Secure Web3 Authentication
        </p>
      </div>

      {!isLoggedIn ? (
        <>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              marginBottom: '12px', 
              paddingBottom: '0',
              fontWeight: '700',
              color: '#16a34a'
            }}>
              Access Your Account
            </h2>
            <p style={{ 
              color: '#64748b', 
              fontSize: '16px', 
              marginBottom: '0',
              lineHeight: '1.5',
              fontWeight: '400'
            }}>
              Enter your email for secure authentication
            </p>
          </div>
          
          <form onSubmit={handleEmailLogin} style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <input 
                name="email" 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  marginBottom: '0'
                }}
              />
            </div>
            
            <button type="submit" style={{ marginBottom: '0' }}>
              Sign In
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '16px',
            background: 'rgba(22, 163, 74, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(22, 163, 74, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#16a34a' 
                }}></div>
                <span style={{ 
                  fontSize: '13px', 
                  color: '#16a34a', 
                  fontWeight: '600' 
                }}>
                  Secure
                </span>
              </div>
              <div style={{ width: '1px', height: '12px', background: '#e2e8f0' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#16a34a' 
                }}></div>
                <span style={{ 
                  fontSize: '13px', 
                  color: '#16a34a', 
                  fontWeight: '600' 
                }}>
                  Passwordless
                </span>
              </div>
              <div style={{ width: '1px', height: '12px', background: '#e2e8f0' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#16a34a' 
                }}></div>
                <span style={{ 
                  fontSize: '13px', 
                  color: '#16a34a', 
                  fontWeight: '600' 
                }}>
                  Web3 Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Vara Network Box */}
        <div className="container" style={{ 
          marginTop: '24px',
          padding: '32px 32px',
          background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.03) 0%, rgba(255, 255, 255, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(22, 163, 74, 0.1)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '700',
              color: '#16a34a',
              marginBottom: '16px',
              paddingBottom: '0',
              textAlign: 'center'
            }}>
              Why Choose Vara Network?
            </h3>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gap: '20px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(135deg, #16a34a, #15803d)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
                marginTop: '2px'
              }}>⚡</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                  Next-Generation Blockchain
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                  Built on cutting-edge technology with parallel processing and smart contract capabilities for unmatched performance.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(135deg, #16a34a, #15803d)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
                marginTop: '2px'
              }}>▲</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                  Lightning Fast & Scalable
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                  Experience instant transactions with minimal fees, designed to scale for millions of users worldwide.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(135deg, #16a34a, #15803d)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
                marginTop: '2px'
              }}>◆</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                  Enterprise-Grade Security
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                  Advanced cryptographic protocols and account abstraction ensure your assets and data remain completely secure.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(135deg, #16a34a, #15803d)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
                marginTop: '2px'
              }}>●</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                  Developer-Friendly Ecosystem
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                  Comprehensive tools, documentation, and APIs make building on Vara Network intuitive and powerful.
                </div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(22, 163, 74, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(22, 163, 74, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#16a34a', 
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              ★ Ready to Experience the Future?
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: '#64748b',
              lineHeight: '1.4'
            }}>
              Join thousands of developers and users building the next generation of decentralized applications.
            </div>
          </div>
        </div>
        </>
      ) : (
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {/* User Header */}
          <div className="dashboard-card" style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                }}>
                  {userMetadata.email ? userMetadata.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '18px', 
                    fontWeight: '700',
                    color: '#1a1a1a',
                    paddingBottom: '0'
                  }}>
                    Welcome back!
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: '#64748b',
                    textAlign: 'left'
                  }}>
                    {userMetadata.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="logout-button"
                style={{
                  padding: '10px 16px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  minWidth: '80px',
                  textAlign: 'center'
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Account Overview */}
          <div className="dashboard-card">
            <div className="card-title">
              <span>🏠</span>
              Your Vara Account
            </div>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                  Address
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!addr && isLoggedIn && (
                    <button 
                      onClick={refreshAddress}
                      style={{
                        padding: '4px 8px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      🔄
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (addr) {
                        navigator.clipboard.writeText(addr);
                        alert('Address copied!');
                      }
                    }}
                    disabled={!addr}
                    style={{
                      padding: '4px 8px',
                      background: addr ? '#ffffff' : '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: addr ? '#64748b' : '#94a3b8',
                      cursor: addr ? 'pointer' : 'not-allowed'
                    }}
                  >
                    📋
                  </button>
                </div>
              </div>
              <div style={{
                fontSize: '13px',
                fontFamily: 'Monaco, Menlo, monospace',
                color: '#16a34a',
                wordBreak: 'break-all',
                lineHeight: '1.4',
                fontWeight: '600'
              }}>
                {addr || 'Loading your address...'}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px'
            }}>
              <a 
                href={`https://vara.subscan.io/account/${addr}`} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  padding: '12px 16px',
                  background: '#16a34a',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🔍 Explorer
              </a>
              <a 
                href="https://idea.gear-tech.io/programs?node=wss%3A%2F%2Ftestnet.vara.network" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  padding: '12px 16px',
                  background: '#f1f5f9',
                  color: '#16a34a',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                💧 Tokens
              </a>
            </div>
          </div>

          {/* Network Status */}
          <div className="dashboard-card">
            <div className="card-title">
              <span>📊</span>
              Network Status
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">Connected</span>
                <span className="stat-label">Status</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">Vara</span>
                <span className="stat-label">Network</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">SS58</span>
                <span className="stat-label">Format</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">Active</span>
                <span className="stat-label">Account</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">Mainnet</span>
                <span className="stat-label">Chain</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">Secure</span>
                <span className="stat-label">Protocol</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="dashboard-card">
            <div className="card-title">
              <span>🔐</span>
              Security Features
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: '#f0fdf4', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>🛡️</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Account Abstraction
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Keys securely managed
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: '#f0fdf4', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>🔒</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Passwordless Auth
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Email-based verification
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Micropayments */}
          <div className="dashboard-card">
            <div className="card-title">
              <span>💳</span>
              Micropayments
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                fontSize: '24px', 
                marginBottom: '8px',
                opacity: '0.7'
              }}>⚡</div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#16a34a',
                marginBottom: '4px'
              }}>
                Fast & Efficient
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b',
                lineHeight: '1.4',
                marginBottom: '12px'
              }}>
                Send small payments instantly with minimal fees on Vara Network
              </div>
              <div style={{
                display: 'inline-block',
                padding: '4px 8px',
                background: '#16a34a',
                color: 'white',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Coming Soon
              </div>
            </div>
          </div>

          {/* A2A Payments Coming Soon */}
          <div className="dashboard-card">
            <div className="card-title">
              <span>🔄</span>
              A2A Payments
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '12px',
                opacity: '0.7'
              }}>🚀</div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#16a34a',
                marginBottom: '8px'
              }}>
                Coming Soon
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#64748b',
                lineHeight: '1.5',
                marginBottom: '12px'
              }}>
                Account-to-Account payments with advanced routing and smart contract integration
              </div>
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                background: '#16a34a',
                color: 'white',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                In Development
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
