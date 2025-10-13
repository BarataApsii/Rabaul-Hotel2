// src/lib/utils/format.ts

/**
 * Format number as currency with PGK symbol
 */
export const formatCurrency = (amount: number | string): string => {
  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) return 'Contact for pricing';
  
  // Format with PGK symbol and thousand separators
  return `PGK${numAmount.toLocaleString('en-PG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

/**
 * Format price for display
 * Handles numbers, strings, undefined, and null
 */
export const formatPrice = (price: number | string | undefined | null): string => {
  if (price === undefined || price === null) return 'Contact for pricing';
  
  // Handle empty objects or other non-numeric values
  if (typeof price === 'object' && Object.keys(price).length === 0) {
    return 'Contact for pricing';
  }
  
  // Convert string to number
  const amount = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if the result is a valid number
  if (isNaN(amount)) return 'Contact for pricing';
  
  return formatCurrency(amount);
};

/**
 * Format price (without per night suffix)
 */
export const formatNightlyRate = (price: number | string | undefined | null): string => {
  return formatPrice(price);
};