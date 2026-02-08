import axios, { AxiosInstance } from 'axios';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type BankDetails = {
  accountNumber: string;
  routingNumber?: string;
  bankName: string;
  accountHolderName: string;
  country: string;
  currency: string;
};

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login'
        ) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  googleAuth(token: string) {
    return this.client.post('/auth/google', { token });
  }

  getCurrentUser() {
    return this.client.get('/auth/me');
  }

  // Transak
  createOnRampWidget(data: { amount: number; currency: string }) {
    return this.client.post('/transak/on-ramp/widget', data);
  }

  createOffRampWidget(data: {
    amount: number;
    currency: string;
    bankDetails: BankDetails;
  }) {
    return this.client.post('/transak/off-ramp/widget', data);
  }

  getSupportedCurrencies() {
    return this.client.get('/transak/currencies');
  }

  // Transactions
  transfer(data: {
    amount: number;
    currency: string;
    receiverEmail?: string;
    bankDetails?: BankDetails;
  }) {
    return this.client.post('/transactions/transfer', data);
  }

  getTransactions(page = 1, limit = 20) {
    return this.client.get('/transactions', { params: { page, limit } });
  }

  getTransaction(id: string) {
    return this.client.get(`/transactions/${id}`);
  }
}

export const apiClient = new APIClient();
