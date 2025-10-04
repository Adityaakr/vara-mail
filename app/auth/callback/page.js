'use client';

import { useEffect, useState } from 'react';
import { handleOAuthCallback } from '../../../auth/google';
import { getMagic } from '../../../lib/magic';

export default function VaraNetworkAuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function processVaraNetworkCallback() {
      try {
        const varaAddress = await handleOAuthCallback();
        const magic = getMagic();
        let userMetadata = null;
        if (magic) {
          try {
            userMetadata = await magic.user.getInfo();
          } catch (error) {
            console.warn('Could not get user metadata:', error);
            userMetadata = { email: 'User' };
          }
        }
        
        console.log('Vara Network OAuth success:', { varaAddress, userMetadata });
        
        // Redirect to home page with success
        window.location.href = '/';
      } catch (err) {
        console.error('Vara Network OAuth callback error:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    processVaraNetworkCallback();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: 24, textAlign: 'center' }}>
        <h1>Connecting to Vara Network...</h1>
        <p>Please wait while we complete your authentication.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24, textAlign: 'center' }}>
        <h1>Vara Network Authentication Error</h1>
        <div className="container">
          <p>There was an error connecting to Vara Network: {error}</p>
          <button onClick={() => window.location.href = '/'}>
            Return to Vara Network Home
          </button>
        </div>
      </main>
    );
  }

  return null;
}
