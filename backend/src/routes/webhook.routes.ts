import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();
const webhookController = new WebhookController();

router.post('/transak', webhookController.handleTransakWebhook.bind(webhookController));

export default router;
