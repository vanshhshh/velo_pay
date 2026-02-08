import { SUPPORTED_CURRENCIES } from '../types';

export class CurrencyService {
  getSupportedCurrencies() {
    return SUPPORTED_CURRENCIES;
  }

  isCurrencySupported(currencyCode: string): boolean {
    return SUPPORTED_CURRENCIES.some(c => c.code === currencyCode);
  }

  getCurrencyInfo(currencyCode: string) {
    return SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  }

  formatAmount(amount: number, currencyCode: string): string {
    const currency = this.getCurrencyInfo(currencyCode);
    if (!currency) return `${amount}`;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  }
}