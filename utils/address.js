import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';

// Vara Network SS58 prefix
const VARA_SS58_PREFIX = 137;

/**
 * Convert any Substrate address to Vara Network SS58 format
 */
export function convertToVaraAddress(address) {
  if (!address) return '';
  
  try {
    // Decode the address to get the public key
    const publicKey = decodeAddress(address);
    
    // Re-encode with Vara Network's SS58 prefix (137)
    const varaAddress = encodeAddress(publicKey, VARA_SS58_PREFIX);
    
    console.log(`Converted address: ${address} → ${varaAddress}`);
    return varaAddress;
  } catch (error) {
    console.error('Error converting address to Vara Network format:', error);
    return address; // Return original if conversion fails
  }
}

/**
 * Validate if an address is in Vara Network format
 */
export function isVaraAddress(address) {
  if (!address) return false;
  
  try {
    // Decode and re-encode to check if it matches Vara format
    const publicKey = decodeAddress(address);
    const varaFormatAddress = encodeAddress(publicKey, VARA_SS58_PREFIX);
    return address === varaFormatAddress;
  } catch (error) {
    return false;
  }
}

/**
 * Format address for Vara Network display
 */
export function formatVaraAddress(address) {
  if (!address) return '';
  
  // Always convert to Vara Network format
  return convertToVaraAddress(address);
}

/**
 * Get address info for debugging
 */
export function getAddressInfo(address) {
  if (!address) return { isValid: false };
  
  try {
    const publicKey = decodeAddress(address);
    const varaAddress = encodeAddress(publicKey, VARA_SS58_PREFIX);
    const isVara = address === varaAddress;
    
    return {
      isValid: true,
      original: address,
      varaFormat: varaAddress,
      isVaraFormat: isVara,
      publicKey: Array.from(publicKey).map(b => b.toString(16).padStart(2, '0')).join('')
    };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}
