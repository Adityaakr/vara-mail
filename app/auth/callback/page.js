'use client';

import { useEffect, useState } from 'react';
import { getMagic } from '../../../lib/magic';

export default function VaraNetworkAuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function processVaraNetworkCallback() {
      try {
        // Simple callback processing - redirect to home
        console.log('Processing Vara Network authentication callback...');
        
        // Redirect to home page
        window.location.href = '/';
      } catch (err) {
        console.error('Vara Network callback error:', err);
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
