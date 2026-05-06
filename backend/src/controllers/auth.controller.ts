import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt, {Secret} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
  async emailLogin(req: Request, res: Response): Promise<void> {
    try {
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: { wallet: true }
      });

      if (!user || !user.passwordHash) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatches) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      let userWithWallet = user;
      if (!userWithWallet.wallet) {
        await walletService.createUserWallet(userWithWallet.id);
        userWithWallet = (await prisma.user.findUnique({
          where: { id: userWithWallet.id },
          include: { wallet: true }
        }))!;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      const jwtToken = jwt.sign(
        {
          userId: userWithWallet.id,
          email: userWithWallet.email,
          name: userWithWallet.name
        },
        jwtSecret,
        { expiresIn }
      );

      await prisma.auditLog.create({
        data: {
          userId: userWithWallet.id,
          action: 'USER_LOGIN',
          entity: 'User',
          entityId: userWithWallet.id,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      });

      res.json({
        user: {
          id: userWithWallet.id,
          email: userWithWallet.email,
          name: userWithWallet.name,
          balance: parseFloat(userWithWallet.wallet?.balance.toString() || '0'),
          currency: userWithWallet.currency
        },
        token: jwtToken
      });
    } catch (error) {
      logger.error('Email login error', { error });
      res.status(500).json({ error: 'Email login failed' });
    }
  }

  async devLogin(req: Request, res: Response): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'production') {
        res.status(404).json({ error: 'Not found' });
        return;
      }

      const email = 'dev@velo.local';
      const name = 'Local Dev';
      const googleId = 'local-dev-user';

      let user = await prisma.user.findUnique({
        where: { email },
        include: { wallet: true }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            googleId,
            status: 'ACTIVE'
          },
          include: { wallet: true }
        });

        logger.info('Local dev user created', {
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

      res.json({
        user: {
          id: user!.id,
          email: user!.email,
          name: user!.name,
          balance: parseFloat(user!.wallet?.balance.toString() || '0'),
          currency: user!.currency
        },
        token: jwtToken
      });
    } catch (error) {
      logger.error('Dev login error', { error });
      res.status(500).json({ error: 'Dev login failed' });
    }
  }

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
          currency: user!.currency
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
        currency: user.currency,
        createdAt: user.createdAt
      });
    } catch (error) {
      logger.error('Get current user error', { error });
      res.status(500).json({ error: 'Failed to get user' });
    }
  }
}
