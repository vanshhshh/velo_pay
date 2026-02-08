import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const transactionController = new TransactionController();

router.use(authenticate);

router.post('/transfer', transactionController.transfer.bind(transactionController));
router.post('/add-money', transactionController.addMoney.bind(transactionController));
router.post('/withdraw', transactionController.withdraw.bind(transactionController));
router.get('/', transactionController.getTransactions.bind(transactionController));
router.get('/:id', transactionController.getTransaction.bind(transactionController));

export default router;
