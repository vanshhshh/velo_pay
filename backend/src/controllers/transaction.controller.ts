import { Request, Response } from 'express'
import { TransactionService } from '../services/transaction.service'
import { logger } from '../config/logger'
import { TransferRequest, WithdrawRequest } from '../types'

const transactionService = new TransactionService()

export class TransactionController {
  /* =====================================================
     INTERNAL TRANSFER or OFF-RAMP (BANK)
  ===================================================== */
  async transfer(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency, receiverEmail, bankDetails }: TransferRequest =
        req.body
      const userId = req.user!.id

      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' })
        return
      }

      if (!currency) {
        res.status(400).json({ error: 'Currency is required' })
        return
      }

      let transaction

      // 👉 Wallet → Wallet
      if (receiverEmail) {
        transaction = await transactionService.createInternalTransfer(
          userId,
          receiverEmail,
          amount,
          currency
        )
      }
      // 👉 Wallet → Bank (Off-ramp)
      else if (bankDetails) {
        const result = await transactionService.createDirectBankPayout(
          userId,
          amount,
          currency,
          bankDetails
        )

        res.status(201).json(result)
        return
      } else {
        res.status(400).json({
          error: 'Either receiverEmail or bankDetails is required',
        })
        return
      }

      logger.info('Transfer completed', {
        transactionId: transaction.id,
        userId,
        amount,
        currency,
        type: transaction.type,
      })

      res.status(201).json({
        transactionId: transaction.id,
        type: transaction.type,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        createdAt: transaction.createdAt,
      })
    } catch (error: any) {
      logger.error('Transfer failed', {
        userId: req.user?.id,
        error,
      })

      res.status(error?.statusCode || 500).json({
        error: error?.message || 'Transfer failed',
      })
    }
  }

  /* =====================================================
     FIAT → CRYPTO (ON-RAMP via Transak iframe)
  ===================================================== */
  async addMoney(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency } = req.body
      const userId = req.user!.id

      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' })
        return
      }

      if (!currency) {
        res.status(400).json({ error: 'Currency is required' })
        return
      }

      const result = await transactionService.initiateOnRamp(
        userId,
        amount,
        currency
      )

      logger.info('On-ramp initiated', {
        userId,
        amount,
        currency,
        transactionId: result.transactionId,
      })

      res.json(result) // { transactionId, widgetUrl }
    } catch (error: any) {
      logger.error('Add money failed', {
        userId: req.user?.id,
        error,
      })

      res.status(error?.statusCode || 500).json({
        error: error?.message || 'Failed to add money',
      })
    }
  }

  /* =====================================================
     WALLET → BANK (OFF-RAMP shortcut endpoint)
  ===================================================== */
  async withdraw(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency, bankDetails }: WithdrawRequest = req.body
      const userId = req.user!.id

      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' })
        return
      }

      if (!currency) {
        res.status(400).json({ error: 'Currency is required' })
        return
      }

      if (!bankDetails) {
        res.status(400).json({ error: 'Bank details are required' })
        return
      }

      const result = await transactionService.createDirectBankPayout(
        userId,
        amount,
        currency,
        bankDetails
      )

      logger.info('Withdrawal initiated', {
        userId,
        amount,
        currency,
        transactionId: result.transactionId,
      })

      res.json(result) // { transactionId, widgetUrl }
    } catch (error: any) {
      logger.error('Withdrawal failed', {
        userId: req.user?.id,
        error,
      })

      res.status(error?.statusCode || 500).json({
        error: error?.message || 'Withdrawal failed',
      })
    }
  }

  /* =====================================================
     TRANSACTION LIST
  ===================================================== */
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 20

      const result = await transactionService.getTransactionHistory(
        userId,
        page,
        limit
      )

      res.json(result)
    } catch (error) {
      logger.error('Get transactions failed', {
        userId: req.user?.id,
        error,
      })
      res.status(500).json({ error: 'Failed to get transactions' })
    }
  }

  /* =====================================================
     SINGLE TRANSACTION
  ===================================================== */
  async getTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.id

      const transaction = await transactionService.getTransaction(id, userId)

      res.json(transaction)
    } catch (error: any) {
      logger.error('Get transaction failed', {
        transactionId: req.params.id,
        error,
      })

      res.status(error?.statusCode || 500).json({
        error: error?.message || 'Failed to get transaction',
      })
    }
  }
}
