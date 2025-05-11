// utils/currencySymbols.ts
export const getCurrencySymbol = (countryName: string | null): string => {
  if (!countryName) return '$'; // default to USD

  const currencyMap: Record<string, string> = {
    'United States': '$',
    'United Kingdom': '£',
    'European Union': '€',
    'India': '₹',
    'Japan': '¥',
    'China': '¥',
    'United Arab Emirates': 'د.إ',
    'Canada': '$',
    'Australia': '$',
    'Singapore': '$',
    'Switzerland': 'CHF',
    'Sweden': 'kr',
    'Norway': 'kr',
    'Denmark': 'kr',
    'Russia': '₽',
    'Brazil': 'R$',
    'Mexico': '$',
    'South Africa': 'R',
    'South Korea': '₩',
    'Hong Kong': 'HK$',
    'New Zealand': '$',
    'Thailand': '฿',
    'Malaysia': 'RM',
    'Philippines': '₱',
    'Nigeria': '₦',
    'Egypt': '£',
    'Israel': '₪',
    'Poland': 'zł',
    'Czech Republic': 'Kč',
    'Hungary': 'Ft',
    'Indonesia': 'Rp',
    'Pakistan': '₨',
    'Bangladesh': '৳',
    'Vietnam': '₫',
    'Argentina': '$',
    'Chile': '$',
    'Colombia': '$',
    // Add more country names and currency symbols as needed
  };

  return currencyMap[countryName.trim()] || '$'; // default to USD if country not found
};
