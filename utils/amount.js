// Utility functions for VARA amount conversion

// VARA token has 12 decimal places
const VARA_DECIMALS = 12;
const VARA_UNIT = BigInt(10 ** VARA_DECIMALS); // 1 VARA = 1,000,000,000,000 base units

/**
 * Convert VARA amount to base units (smallest unit)
 * @param {string|number} varaAmount - Amount in VARA (e.g., "1.5")
 * @returns {bigint} - Amount in base units
 */
export function varaToBaseUnits(varaAmount) {
  if (!varaAmount || varaAmount === '0') return BigInt(0);
  
  try {
    // Handle decimal amounts
    const amount = parseFloat(varaAmount);
    if (isNaN(amount) || amount < 0) {
      throw new Error('Invalid VARA amount');
    }
    
    // Convert to base units (multiply by 10^12)
    const baseUnits = BigInt(Math.floor(amount * Number(VARA_UNIT)));
    return baseUnits;
  } catch (error) {
    console.error('Error converting VARA to base units:', error);
    throw new Error('Invalid VARA amount format');
  }
}

/**
 * Convert base units to VARA amount
 * @param {bigint|string} baseUnits - Amount in base units
 * @returns {string} - Amount in VARA (formatted)
 */
export function baseUnitsToVara(baseUnits) {
  try {
    const units = typeof baseUnits === 'string' ? BigInt(baseUnits) : baseUnits;
    const varaAmount = Number(units) / Number(VARA_UNIT);
    return varaAmount.toFixed(6); // Show up to 6 decimal places
  } catch (error) {
    console.error('Error converting base units to VARA:', error);
    return '0';
  }
}

/**
 * Format VARA amount for display
 * @param {string|number} amount - VARA amount
 * @returns {string} - Formatted amount
 */
export function formatVaraAmount(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';
  
  // Format with appropriate decimal places
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M VARA';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K VARA';
  } else if (num >= 1) {
    return num.toFixed(4) + ' VARA';
  } else {
    return num.toFixed(6) + ' VARA';
  }
}

/**
 * Validate VARA amount input
 * @param {string} amount - Amount to validate
 * @returns {object} - Validation result
 */
export function validateVaraAmount(amount) {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }
  
  const num = parseFloat(amount);
  if (isNaN(num)) {
    return { isValid: false, error: 'Invalid number format' };
  }
  
  if (num <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (num > 1000000) {
    return { isValid: false, error: 'Amount too large (max: 1M VARA)' };
  }
  
  // Check for too many decimal places
  const decimalPlaces = (amount.split('.')[1] || '').length;
  if (decimalPlaces > 12) {
    return { isValid: false, error: 'Too many decimal places (max: 12)' };
  }
  
  return { isValid: true, amount: num };
}

/**
 * Get suggested amounts for quick selection
 */
export function getSuggestedAmounts() {
  return [
    { label: '0.1 VARA', value: '0.1' },
    { label: '1 VARA', value: '1' },
    { label: '5 VARA', value: '5' },
    { label: '10 VARA', value: '10' },
    { label: '50 VARA', value: '50' },
    { label: '100 VARA', value: '100' }
  ];
}
