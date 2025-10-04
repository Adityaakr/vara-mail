import { Magic } from 'magic-sdk';
import { PolkadotExtension } from '@magic-ext/polkadot';

let magic;

export const getMagic = () => {
  if (typeof window !== 'undefined' && !magic) {
    const apiKey = process.env.NEXT_PUBLIC_MAGIC_KEY;
    if (!apiKey) {
      console.error('NEXT_PUBLIC_MAGIC_KEY environment variable is required for Vara Network authentication');
      return null;
    }
    
    try {
      magic = new Magic(apiKey, {
        extensions: [
          new PolkadotExtension({ 
            rpcUrl: 'wss://testnet.vara.network', // Vara Network testnet RPC
            ss58Format: 137 // Vara Network SS58 prefix for native address format
          }),
        ],
      });
      console.log('Magic.link initialized successfully for Vara Network with SS58 format 137');
    } catch (error) {
      console.error('Failed to initialize Magic.link for Vara Network:', error);
      return null;
    }
  }
  return magic;
};

export { magic };
