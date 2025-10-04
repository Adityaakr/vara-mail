import { getMagic } from '../lib/magic';
import { formatVaraAddress, getAddressInfo } from '../utils/address';

export async function loginWithEmail(email) {
  const magic = getMagic();
  if (!magic) throw new Error('Vara Network Magic authentication not available');
  
  await magic.auth.loginWithEmailOTP({ email, showUI: true });
  const originalAddress = await magic.polkadot.getAccount();
  
  // Get detailed address info for debugging
  const addressInfo = getAddressInfo(originalAddress);
  console.log('Address conversion info:', addressInfo);
  
  // Convert to Vara Network format
  const varaAddress = formatVaraAddress(originalAddress);
  console.log('Final Vara Network address:', varaAddress);
  
  return varaAddress;
}
