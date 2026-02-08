import { Router } from 'express';
import { TransakController } from '../controllers/transak.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const transakController = new TransakController();

router.use(authenticate);

router.post('/on-ramp/widget', transakController.createOnRampWidget.bind(transakController));
router.post('/off-ramp/widget', transakController.createOffRampWidget.bind(transakController));
router.get('/currencies', transakController.getSupportedCurrencies.bind(transakController));

export default router;