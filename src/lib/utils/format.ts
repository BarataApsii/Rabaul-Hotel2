export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount.trim()) : amount;
  if (isNaN(num)) return 'Contact for pricing';
  return `PGK${num.toLocaleString('en-PG',{minimumFractionDigits:0,maximumFractionDigits:0})}`;
};

export const formatPrice = (price: number | string | undefined | null | object): string => {
  if (price === undefined || price === null) return 'Contact for pricing';
  if (typeof price === 'object' && Object.keys(price).length === 0) return 'Contact for pricing';
  const num = typeof price === 'string' ? parseFloat(price.trim()) : price;
  if (isNaN(Number(num))) return 'Contact for pricing';
  return formatCurrency(num as number);
};

export const formatNightlyRate = (rate: number | string | undefined | null): string => {
  if (rate === undefined || rate === null) return 'Contact for rates';
  if (typeof rate === 'string' && rate.toLowerCase().includes('request')) return rate.trim();
  return `${formatPrice(rate)} / night`;
};
