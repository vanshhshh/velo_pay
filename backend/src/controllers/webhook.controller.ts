import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { TransakService } from '../services/transak.service';
import { logger } from '../config/logger';

const transactionService = new TransactionService();
const transakService = new TransakService();

export class WebhookController {
  async handleTransakWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-transak-signature'] as string;
      const payload = JSON.stringify(req.body);

      if (!signature || !transakService.verifyWebhook(payload, signature)) {
        logger.warn('Invalid webhook signature', {
          signature,
          body: req.body
        });
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      const { eventName, webhookData } = req.body;

      logger.info('Transak webhook received', {
        eventName,
        orderId: webhookData.id
      });

      await transactionService.handleTransakWebhook(eventName, webhookData);

      res.json({ success: true });
    } catch (error) {
      logger.error('Webhook processing failed', { error, body: req.body });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
}
