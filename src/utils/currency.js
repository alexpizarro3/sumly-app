export const CURRENCIES = [
  { code: 'USD', symbol: 'US$', name: 'EE.UU.' },
  { code: 'MXN', symbol: '$', name: 'México' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rica' },
  { code: 'EUR', symbol: '€', name: 'Europa' },
  { code: 'NIO', symbol: 'C$', name: 'Nicaragua' },
  { code: 'ARS', symbol: '$', name: 'Argentina' },
  { code: 'COP', symbol: '$', name: 'Colombia' },
  { code: 'CNY', symbol: '¥', name: 'China' },
];

export const getCurrencySymbol = (code) => {
  const found = CURRENCIES.find(c => c.code === code);
  return found ? found.symbol : '$';
};
