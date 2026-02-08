import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/google', authController.googleAuth.bind(authController));
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));

export default router;
