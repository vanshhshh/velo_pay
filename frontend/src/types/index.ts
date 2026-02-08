export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'ONRAMP' | 'OFFRAMP' | 'INTERNAL';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  amount: number;
  currency: string;
  senderUser?: {
    id: string;
    name: string;
    email: string;
  };
  receiverUser?: {
    id: string;
    name: string;
    email: string;
  };
  bankDetails?: any;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface BankDetails {
  accountNumber: string;
  routingNumber?: string;
  bankName: string;
  accountHolderName: string;
  country: string;
  currency: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}