import { ethers } from 'ethers';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { encrypt, decrypt } from '../utils/encryption';
import { AppError } from '../types';

export class WalletService {
  async createUserWallet(userId: string) {
    try {
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId }
      });

      if (existingWallet) {
        logger.info('Wallet already exists for user', { userId });
        return existingWallet;
      }

      const wallet = ethers.Wallet.createRandom();
      const encryptedKey = encrypt(wallet.privateKey);

      const newWallet = await prisma.wallet.create({
        data: {
          userId,
          type: 'USER',
          address: wallet.address,
          encryptedKey,
          balance: 0
        }
      });

      logger.info('Wallet created for user', {
        userId,
        walletId: newWallet.id,
        address: newWallet.address
      });

      return newWallet;
    } catch (error) {
      logger.error('Error creating wallet', { userId, error });
      throw new AppError(500, 'Failed to create wallet');
    }
  }

  async getOrCreateEscrowWallet() {
    try {
      let escrowWallet = await prisma.wallet.findFirst({
        where: { type: 'ESCROW' }
      });

      if (!escrowWallet) {
        const wallet = ethers.Wallet.createRandom();
        const encryptedKey = encrypt(wallet.privateKey);

        escrowWallet = await prisma.wallet.create({
          data: {
            type: 'ESCROW',
            address: wallet.address,
            encryptedKey,
            balance: 0
          }
        });

        logger.info('Escrow wallet created', {
          walletId: escrowWallet.id,
          address: escrowWallet.address
        });
      }

      return escrowWallet;
    } catch (error) {
      logger.error('Error getting/creating escrow wallet', { error });
      throw new AppError(500, 'Failed to get escrow wallet');
    }
  }

  async getUserWallet(userId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    return wallet;
  }

  async getWalletByAddress(address: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { address }
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    return wallet;
  }

  async updateBalance(walletId: string, amount: number, operation: 'ADD' | 'SUBTRACT') {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId }
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    const currentBalance = parseFloat(wallet.balance.toString());
    let newBalance: number;

    if (operation === 'ADD') {
      newBalance = currentBalance + amount;
    } else {
      newBalance = currentBalance - amount;
      if (newBalance < 0) {
        throw new AppError(400, 'Insufficient balance');
      }
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance }
    });

    logger.info('Wallet balance updated', {
      walletId,
      operation,
      amount,
      previousBalance: currentBalance,
      newBalance
    });

    return updatedWallet;
  }

  async transferInternal(senderWalletId: string, receiverWalletId: string, amount: number) {
    return await prisma.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: { id: senderWalletId }
      });

      const receiverWallet = await tx.wallet.findUnique({
        where: { id: receiverWalletId }
      });

      if (!senderWallet || !receiverWallet) {
        throw new AppError(404, 'Wallet not found');
      }

      const senderBalance = parseFloat(senderWallet.balance.toString());
      if (senderBalance < amount) {
        throw new AppError(400, 'Insufficient balance');
      }

      await tx.wallet.update({
        where: { id: senderWalletId },
        data: { balance: senderBalance - amount }
      });

      const receiverBalance = parseFloat(receiverWallet.balance.toString());
      await tx.wallet.update({
        where: { id: receiverWalletId },
        data: { balance: receiverBalance + amount }
      });

      logger.info('Internal transfer completed', {
        senderWalletId,
        receiverWalletId,
        amount
      });

      return { success: true };
    });
  }
}
