/**
 * Currency utility functions
 */

// Define currency type
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PLN' | 'JPY';

// Currency symbols map
export const currencySymbols: Record<CurrencyCode, string> = {
	USD: '$',
	EUR: '€',
	GBP: '£',
	PLN: 'zł',
	JPY: '¥'
};

// Currency symbol to code map
export const symbolToCurrency: Record<string, CurrencyCode> = {
	$: 'USD',
	'€': 'EUR',
	'£': 'GBP',
	zł: 'PLN',
	'¥': 'JPY'
};

/**
 * Get currency symbol from currency code
 */
export function getCurrencySymbol(currencyCode: CurrencyCode): string {
	return currencySymbols[currencyCode] || '$';
}

/**
 * Get currency code from symbol
 */
export function getCurrencyCode(symbol: string): CurrencyCode {
	return symbolToCurrency[symbol] || 'USD';
}

/**
 * Format price with currency
 */
export function formatPrice(
	price: number,
	currency: CurrencyCode | string = 'USD',
	decimals = 2
): string {
	// Handle both currency codes and symbols
	let currencyCode: string;

	if (currency in currencySymbols) {
		// It's a currency code
		currencyCode = currency;
	} else if (currency in symbolToCurrency) {
		// It's a currency symbol
		currencyCode = symbolToCurrency[currency as keyof typeof symbolToCurrency];
	} else {
		// It's a custom currency symbol, use simple formatting
		return `${currency}${price.toFixed(decimals)}`;
	}

	// Use Intl.NumberFormat for proper localized formatting
	try {
		return new Intl.NumberFormat('en', {
			style: 'currency',
			currency: currencyCode,
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		}).format(price);
	} catch (error) {
		// Fallback to simple formatting
		const symbol =
			currencyCode in currencySymbols
				? currencySymbols[currencyCode as CurrencyCode]
				: currencyCode;
		return `${symbol}${price.toFixed(decimals)}`;
	}
}
