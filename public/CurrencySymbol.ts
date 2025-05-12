// utils/currencySymbols.ts
export const getCurrencySymbol = (countryCode: string | null): string => {
  if (!countryCode) return '$'; // default to USD
  
  const currencyMap: Record<string, string> = {
    'US': '$',    // United States
    'GB': '£',    // United Kingdom
    'EU': '€',    // European Union (you might need to handle individual EU countries)
    'IN': '₹',    // India
    'JP': '¥',    // Japan
    'CN': '¥',    // China
    'AE': 'د.إ',  // UAE Dirham
    'CA': '$',    // Canada
    'AU': '$',    // Australia
    // Add more country codes and their currency symbols as needed
  };

  return currencyMap[countryCode] || '$'; // default to USD if country not found
};