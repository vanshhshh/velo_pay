import { Request, Response } from 'express';
import { TransakService } from '../services/transak.service';
import { WalletService } from '../services/wallet.service';
import { CurrencyService } from '../services/currency.service';
import { logger } from '../config/logger';
import { prisma } from '../config/database';

const transakService = new TransakService();
const walletService = new WalletService();
const currencyService = new CurrencyService();

export class TransakController {
  /**
   * Create widget URL for on-ramp (Add Money)
   */
  async createOnRampWidget(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency } = req.body;
      const userId = req.user!.id;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' });
        return;
      }

      if (!currency || !currencyService.isCurrencySupported(currency)) {
        res.status(400).json({ error: 'Unsupported currency' });
        return;
      }

      // Get user wallet
      const wallet = await walletService.getUserWallet(userId);

      // Create widget URL via Transak API
      const { widgetUrl, sessionId } =
  await transakService.createWidgetSession(
    userId,
    {
      productsAvailed: 'BUY',
      fiatCurrency: currency,
      fiatAmount: amount,
      cryptoCurrency: 'USDC',
      walletAddress: wallet.address,
    }
  )


      // Create pending transaction
      await prisma.transaction.create({
        data: {
          type: 'ONRAMP',
          status: 'PENDING',
          amount,
          currency,
          senderUserId: userId,
          receiverWalletId: wallet.id,
          transakSessionId: sessionId,
          metadata: { widgetUrl }
        }
      });

      logger.info('On-ramp widget created', { userId, amount, currency, sessionId });

      res.json({ widgetUrl, sessionId });
    } catch (error: any) {
      logger.error('Create on-ramp widget failed', { error, userId: req.user!.id });
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to create payment widget'
      });
    }
  }

  /**
   * Create widget URL for off-ramp (Withdraw)
   */
  async createOffRampWidget(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency, bankDetails } = req.body;
      const userId = req.user!.id;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' });
        return;
      }

      if (!currency || !currencyService.isCurrencySupported(currency)) {
        res.status(400).json({ error: 'Unsupported currency' });
        return;
      }

      if (!bankDetails) {
        res.status(400).json({ error: 'Bank details required' });
        return;
      }

      // Get user wallet
      const wallet = await walletService.getUserWallet(userId);
      const currentBalance = parseFloat(wallet.balance.toString());

      if (currentBalance < amount) {
        res.status(400).json({ error: 'Insufficient balance' });
        return;
      }

      // Create widget URL via Transak API
      const { widgetUrl, sessionId } =
  await transakService.createWidgetSession(
    userId,
    {
      productsAvailed: 'SELL',
      fiatCurrency: currency,
      fiatAmount: amount,
      cryptoCurrency: 'USDC',
      walletAddress: wallet.address
    }
  );


      // Create pending transaction
      const transaction = await prisma.transaction.create({
        data: {
          type: 'OFFRAMP',
          status: 'PENDING',
          amount,
          currency,
          senderUserId: userId,
          senderWalletId: wallet.id,
          transakSessionId: sessionId,
          bankDetails: bankDetails as any,
          metadata: { widgetUrl }
        }
      });

      logger.info('Off-ramp widget created', { userId, amount, currency, sessionId });

      res.json({ widgetUrl, sessionId, transactionId: transaction.id });
    } catch (error: any) {
      logger.error('Create off-ramp widget failed', { error, userId: req.user!.id });
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to create withdrawal widget'
      });
    }
  }

  /**
   * Get supported currencies
   */
  async getSupportedCurrencies(req: Request, res: Response): Promise<void> {
    try {
      const currencies = currencyService.getSupportedCurrencies();
      res.json({ currencies });
    } catch (error) {
      logger.error('Get currencies failed', { error });
      res.status(500).json({ error: 'Failed to get currencies' });
    }
  }
}