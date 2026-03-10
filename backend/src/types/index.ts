import { User, Transaction, TransactionType, TransactionStatus } from '@prisma/client';

export interface GoogleTokenPayload {
  aud: string;
  email: string;
  email_verified: boolean;
  name: string;
  sub: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    balance: number;
    currency: string;
  };
  token: string;
}

export interface TransferRequest {
  amount: number;
  currency: string;
  receiverEmail?: string;
  bankDetails?: BankDetails;
}

export interface BankDetails {
  accountNumber: string;
  routingNumber?: string;
  bankName: string;
  accountHolderName: string;
  country: string;
  currency: string;
}

export interface TransakWidgetRequest {
  productsAvailed: 'BUY' | 'SELL';
  fiatCurrency?: string;
  fiatAmount?: number;
  cryptoCurrency?: string;
  walletAddress?: string;
  network?: string;
  walletRedirection?: boolean;
  redirectURL?: string;
}

export interface TransakWidgetResponse {
  widgetUrl: string;
  sessionId: string;
}

export interface TransakOrder {
  id: string;
  status: string;
  walletAddress: string;
  cryptoAmount: number;
  fiatAmount: number;
  fiatCurrency: string;
  cryptocurrency: string;
}

export interface TransakWebhookPayload {
  eventName: string;
  webhookData: {
    id: string;
    status: string;
    walletAddress?: string;
    cryptoAmount?: number;
    fiatAmount?: number;
    fiatCurrency?: string;
    cryptocurrency?: string;
  };
}

export interface WithdrawRequest {
  amount: number;
  currency: string;
  bankDetails: BankDetails;
}

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
] as const;

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface TransactionWithDetails extends Transaction {
  senderUser?: User | null;
  receiverUser?: User | null;
}


