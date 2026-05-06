import { prisma } from '../config/database'
import { logger } from '../config/logger'
import { WalletService } from './wallet.service'
import { TransakService } from './transak.service'
import { AppError, BankDetails } from '../types'

const walletService = new WalletService()
const transakService = new TransakService()

export class TransactionService {
  private async settlePendingTransaction(
    transactionId: string,
    orderId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const pendingTransaction = await tx.transaction.findFirst({
        where: {
          id: transactionId,
          status: 'PENDING'
        }
      })

      if (!pendingTransaction) {
        return tx.transaction.findUniqueOrThrow({
          where: { id: transactionId }
        })
      }

      const claimed = await tx.transaction.updateMany({
        where: {
          id: pendingTransaction.id,
          status: 'PENDING'
        },
        data: {
          status: 'COMPLETED',
          transakOrderId: orderId ?? pendingTransaction.transakOrderId,
          completedAt: new Date(),
          failureReason: null
        }
      })

      if (claimed.count === 0) {
        return tx.transaction.findUniqueOrThrow({
          where: { id: transactionId }
        })
      }

      if (pendingTransaction.type === 'ONRAMP') {
        if (!pendingTransaction.receiverWalletId) {
          throw new AppError(400, 'On-ramp receiver wallet is missing')
        }

        await tx.wallet.update({
          where: { id: pendingTransaction.receiverWalletId },
          data: {
            balance: {
              increment: pendingTransaction.amount
            }
          }
        })
      }

      if (pendingTransaction.type === 'OFFRAMP') {
        if (!pendingTransaction.senderWalletId) {
          throw new AppError(400, 'Off-ramp sender wallet is missing')
        }

        const wallet = await tx.wallet.findUnique({
          where: { id: pendingTransaction.senderWalletId }
        })

        if (!wallet) {
          throw new AppError(404, 'Sender wallet not found')
        }

        if (Number(wallet.balance) < Number(pendingTransaction.amount)) {
          throw new AppError(400, 'Insufficient balance for off-ramp settlement')
        }

        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: Number(wallet.balance) - Number(pendingTransaction.amount)
          }
        })
      }

      return tx.transaction.findUniqueOrThrow({
        where: { id: pendingTransaction.id }
      })
    })
  }

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
        walletAddress: wallet.address,
        network: 'ethereum',
        redirectURL: '/dashboard'
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
        walletAddress: wallet.address,
        network: 'ethereum',
        walletRedirection: true,
        redirectURL: '/withdraw'
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
        include: {
          senderUser: {
            select: { id: true, name: true, email: true }
          },
          receiverUser: {
            select: { id: true, name: true, email: true }
          }
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
      },
      include: {
        senderUser: {
          select: { id: true, name: true, email: true }
        },
        receiverUser: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!transaction) {
      throw new AppError(404, 'Transaction not found')
    }

    return transaction
  }

  async completeOnRampSession(
    userId: string,
    sessionId: string,
    orderId?: string
  ) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        transakSessionId: sessionId,
        senderUserId: userId,
        type: 'ONRAMP'
      }
    })

    if (!transaction) {
      throw new AppError(404, 'On-ramp session not found')
    }

    if (transaction.status === 'COMPLETED') {
      return transaction
    }

    if (transaction.status === 'FAILED') {
      throw new AppError(400, 'On-ramp session has already failed')
    }

    return this.settlePendingTransaction(transaction.id, orderId)
  }

  async completeOffRampSession(
    userId: string,
    sessionId: string,
    orderId?: string
  ) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        transakSessionId: sessionId,
        senderUserId: userId,
        type: 'OFFRAMP'
      }
    })

    if (!transaction) {
      throw new AppError(404, 'Off-ramp session not found')
    }

    if (transaction.status === 'COMPLETED') {
      return transaction
    }

    if (transaction.status === 'FAILED') {
      throw new AppError(400, 'Off-ramp session has already failed')
    }

    return this.settlePendingTransaction(transaction.id, orderId)
  }

  /* =====================================================
     TRANSAK WEBHOOK HANDLER
  ===================================================== */
  async handleTransakWebhook(event: string, payload: any) {
    const sessionId =
      payload?.sessionId ??
      payload?.session_id ??
      payload?.widgetSessionId ??
      payload?.data?.sessionId
    const orderId = payload?.id ?? payload?.orderId ?? payload?.order_id

    if (!sessionId) return

    const transaction = await prisma.transaction.findFirst({
      where: { transakSessionId: sessionId }
    })

    if (!transaction) {
      logger.warn('No transaction for Transak session', { sessionId })
      return
    }

    const isCompletedEvent =
      event === 'ORDER_COMPLETED' || event === 'TRANSAK_ORDER_SUCCESSFUL'
    const isFailedEvent =
      event === 'ORDER_FAILED' || event === 'TRANSAK_ORDER_FAILED'

    if (isCompletedEvent && transaction.status === 'COMPLETED') {
      logger.info('Duplicate ORDER_COMPLETED webhook ignored', {
        transactionId: transaction.id,
        sessionId,
        orderId
      })
      return
    }

    if (isFailedEvent && transaction.status === 'FAILED') {
      logger.info('Duplicate ORDER_FAILED webhook ignored', {
        transactionId: transaction.id,
        sessionId,
        orderId
      })
      return
    }

    if (isFailedEvent && transaction.status === 'COMPLETED') {
      logger.warn('ORDER_FAILED received for completed transaction, ignoring', {
        transactionId: transaction.id,
        sessionId,
        orderId
      })
      return
    }

    if (isCompletedEvent) {
      await this.settlePendingTransaction(transaction.id, orderId)
      return
    }

    if (isFailedEvent) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          failureReason: payload?.statusReason || payload?.message || 'Order failed'
        }
      })

      return
    }

    logger.info('Unhandled Transak webhook event', {
      transactionId: transaction.id,
      sessionId,
      event
    })
  }
}
