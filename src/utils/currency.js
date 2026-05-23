export const CURRENCIES = [
  // Norteamérica y globales
  { code: 'USD', symbol: 'US$', name: 'EE.UU.' },
  { code: 'MXN', symbol: '$', name: 'México' },
  { code: 'EUR', symbol: '€', name: 'Europa' },
  { code: 'CNY', symbol: '¥', name: 'China' },
  
  // Centroamérica
  { code: 'CRC', symbol: '₡', name: 'Costa Rica' },
  { code: 'NIO', symbol: 'C$', name: 'Nicaragua' },
  { code: 'GTQ', symbol: 'Q', name: 'Guatemala' },
  { code: 'HNL', symbol: 'L', name: 'Honduras' },
  { code: 'PAB', symbol: 'B/.', name: 'Panamá' },
  { code: 'BZD', symbol: 'BZ$', name: 'Belice' },
  
  // Sudamérica
  { code: 'ARS', symbol: '$', name: 'Argentina' },
  { code: 'COP', symbol: '$', name: 'Colombia' },
  { code: 'CLP', symbol: '$', name: 'Chile' },
  { code: 'PEN', symbol: 'S/', name: 'Perú' },
  { code: 'BRL', symbol: 'R$', name: 'Brasil' },
  { code: 'UYU', symbol: '$', name: 'Uruguay' },
  { code: 'PYG', symbol: '₲', name: 'Paraguay' },
  { code: 'BOB', symbol: 'Bs.', name: 'Bolivia' },
  { code: 'VES', symbol: 'Bs.', name: 'Venezuela' }
];

export const getCurrencySymbol = (code) => {
  const found = CURRENCIES.find(c => c.code === code);
  return found ? found.symbol : '$';
};
