import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt, {Secret} from 'jsonwebtoken';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { WalletService } from '../services/wallet.service';
import { AuthResponse, GoogleTokenPayload, AppError } from '../types';


const jwtSecret: Secret = process.env.JWT_SECRET as Secret;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const walletService = new WalletService();
const expiresIn: jwt.SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d';

export class AuthController {
  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ error: 'Token is required' });
        return;
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email || !payload.sub) {
        res.status(400).json({ error: 'Invalid token payload' });
        return;
      }

      let user = await prisma.user.findUnique({
  where: { email: payload.email },
  include: { wallet: true }
});

if (user && !user.googleId) {
  user = await prisma.user.update({
    where: { id: user.id },
    data: { googleId: payload.sub },
    include: { wallet: true }
  });
}
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name || payload.email,
            googleId: payload.sub,
            status: 'ACTIVE'
          },
          include: { wallet: true }
        });

        logger.info('New user created via Google Auth', {
          userId: user.id,
          email: user.email
        });
      }

      if (!user.wallet) {
        await walletService.createUserWallet(user.id);
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { wallet: true }
        });
      }

      await prisma.auditLog.create({
        data: {
          userId: user!.id,
          action: 'USER_LOGIN',
          entity: 'User',
          entityId: user!.id,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      });

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      const jwtToken = jwt.sign(
        {
          userId: user!.id,
          email: user!.email,
          name: user!.name
        },
        jwtSecret,
        { expiresIn }
      );

      const response: AuthResponse = {
        user: {
          id: user!.id,
          email: user!.email,
          name: user!.name,
          balance: parseFloat(user!.wallet?.balance.toString() || '0'),
          currency: ''
        },
        token: jwtToken
      };

      logger.info('User logged in successfully', {
        userId: user!.id,
        email: user!.email
      });

      res.json(response);
    } catch (error) {
      logger.error('Google auth error', { error });
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: { wallet: true }
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        balance: parseFloat(user.wallet?.balance.toString() || '0'),
        createdAt: user.createdAt
      });
    } catch (error) {
      logger.error('Get current user error', { error });
      res.status(500).json({ error: 'Failed to get user' });
    }
  }
}
