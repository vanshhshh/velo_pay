import { prisma } from '../config/database'
import { logger } from '../config/logger'
import { WalletService } from './wallet.service'
import { TransakService } from './transak.service'
import { AppError, BankDetails } from '../types'

const walletService = new WalletService()
const transakService = new TransakService()

export class TransactionService {
  /* =====================================================
     INTERNAL WALLET → WALLET TRANSFER
  ===================================================== */
  async createInternalTransfer(
    senderUserId: string,
    receiverEmail: string,
    amount: number,
    currency: string
  ) {
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
      include: { wallet: true }
    })

    if (!receiver) {
      throw new AppError(404, 'Receiver not found')
    }

    if (!receiver.wallet) {
      throw new AppError(400, 'Receiver wallet not found')
    }

    const senderWallet = await walletService.getUserWallet(senderUserId)

    return prisma.$transaction(async (tx) => {
      if (Number(senderWallet.balance) < amount) {
        throw new AppError(400, 'Insufficient balance')
      }

      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: Number(senderWallet.balance) - amount }
      })

      await tx.wallet.update({
        where: { id: receiver.wallet!.id },
        data: { balance: Number(receiver.wallet!.balance) + amount }
      })

      return tx.transaction.create({
        data: {
          type: 'INTERNAL',
          status: 'COMPLETED',
          amount,
          currency,
          senderUserId,
          receiverUserId: receiver.id,
          senderWalletId: senderWallet.id,
          receiverWalletId: receiver.wallet!.id,
          completedAt: new Date()
        }
      })
    })
  }

  /* =====================================================
     FIAT → CRYPTO (ON-RAMP via Transak iframe)
  ===================================================== */
  async initiateOnRamp(
    userId: string,
    amount: number,
    currency: string
  ) {
    const wallet = await walletService.getUserWallet(userId)

    const { widgetUrl, sessionId } =
      await transakService.createWidgetSession(userId, {
        productsAvailed: 'BUY',
        fiatCurrency: currency,
        fiatAmount: amount,
        walletAddress: wallet.address
      })

    const transaction = await prisma.transaction.create({
      data: {
        type: 'ONRAMP',
        status: 'PENDING',
        amount,
        currency,
        senderUserId: userId,
        receiverWalletId: wallet.id,
        transakSessionId: sessionId
      }
    })

    logger.info('On-ramp initiated', {
      transactionId: transaction.id,
      userId,
      sessionId
    })

    return {
      transactionId: transaction.id,
      widgetUrl
    }
  }

  /* =====================================================
     CRYPTO → FIAT (OFF-RAMP via Transak iframe)
  ===================================================== */
  async createDirectBankPayout(
    userId: string,
    amount: number,
    currency: string,
    bankDetails: BankDetails
  ) {
    const wallet = await walletService.getUserWallet(userId)

    if (Number(wallet.balance) < amount) {
      throw new AppError(400, 'Insufficient balance')
    }

    const { widgetUrl, sessionId } =
      await transakService.createWidgetSession(userId, {
        productsAvailed: 'SELL',
        fiatCurrency: currency,
        fiatAmount: amount,
        walletAddress: wallet.address
      })

    const transaction = await prisma.transaction.create({
      data: {
        type: 'OFFRAMP',
        status: 'PENDING',
        amount,
        currency,
        senderUserId: userId,
        senderWalletId: wallet.id,
        transakSessionId: sessionId,
        metadata: {
          bankDetails: {
            accountNumber: bankDetails.accountNumber,
            routingNumber: bankDetails.routingNumber ?? null,
            bankName: bankDetails.bankName,
            accountHolderName: bankDetails.accountHolderName,
            country: bankDetails.country,
            currency: bankDetails.currency
          }
        }
      }
    })

    logger.info('Off-ramp initiated', {
      transactionId: transaction.id,
      userId,
      sessionId
    })

    return {
      transactionId: transaction.id,
      widgetUrl
    }
  }

  /* =====================================================
     TRANSACTION HISTORY (USED BY CONTROLLER)
  ===================================================== */
  async getTransactionHistory(
    userId: string,
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          OR: [
            { senderUserId: userId },
            { receiverUserId: userId }
          ]
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({
        where: {
          OR: [
            { senderUserId: userId },
            { receiverUserId: userId }
          ]
        }
      })
    ])

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /* =====================================================
     SINGLE TRANSACTION
  ===================================================== */
  async getTransaction(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        OR: [
          { senderUserId: userId },
          { receiverUserId: userId }
        ]
      }
    })

    if (!transaction) {
      throw new AppError(404, 'Transaction not found')
    }

    return transaction
  }

  /* =====================================================
     TRANSAK WEBHOOK HANDLER
  ===================================================== */
  async handleTransakWebhook(event: string, payload: any) {
    const sessionId = payload?.sessionId
    const orderId = payload?.id

    if (!sessionId) return

    const transaction = await prisma.transaction.findFirst({
      where: { transakSessionId: sessionId }
    })

    if (!transaction) {
      logger.warn('No transaction for Transak session', { sessionId })
      return
    }

    if (event === 'ORDER_COMPLETED') {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            transakOrderId: orderId,
            completedAt: new Date()
          }
        })

        if (transaction.receiverWalletId) {
          const wallet = await tx.wallet.findUnique({
            where: { id: transaction.receiverWalletId }
          })

          if (wallet) {
            await tx.wallet.update({
              where: { id: wallet.id },
              data: {
                balance:
                  Number(wallet.balance) + Number(transaction.amount)
              }
            })
          }
        }
      })
    }

    if (event === 'ORDER_FAILED') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' }
      })
    }
  }
}
