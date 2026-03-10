import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { TransakService } from '../services/transak.service';
import { logger } from '../config/logger';

const transactionService = new TransactionService();
const transakService = new TransakService();

export class WebhookController {
  async handleTransakWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signatureHeader = req.headers['x-transak-signature'];
      const signature = Array.isArray(signatureHeader)
        ? signatureHeader[0]
        : signatureHeader;
      const payload = Buffer.isBuffer(req.body)
        ? req.body.toString('utf8')
        : JSON.stringify(req.body);

      if (!signature || !transakService.verifyWebhook(payload, signature)) {
        logger.warn('Invalid webhook signature', {
          signature,
          body: req.body
        });
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      let parsedPayload: any
      try {
        parsedPayload = Buffer.isBuffer(req.body)
          ? JSON.parse(payload)
          : req.body
      } catch {
        res.status(400).json({ error: 'Malformed webhook payload' })
        return
      }
      const { eventName, webhookData } = parsedPayload;

      if (!eventName || !webhookData) {
        res.status(400).json({ error: 'Invalid webhook payload' });
        return;
      }

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
