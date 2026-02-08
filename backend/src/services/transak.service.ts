import axios from 'axios'
import crypto from 'crypto'
import { AppError, TransakWidgetRequest } from '../types'
import { logger } from '../config/logger'
import { getTransakAccessToken } from './transak.auth'

const TRANSAK_API_URL = 'https://api-gateway-stg.transak.com'
const TRANSAK_API_KEY = process.env.TRANSAK_API_KEY!
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const TRANSAK_WEBHOOK_SECRET = process.env.TRANSAK_WEBHOOK_SECRET!

export class TransakService {
  async createWidgetSession(
    userId: string,
    request: TransakWidgetRequest
  ): Promise<{ widgetUrl: string; sessionId: string }> {
    try {
      const accessToken = await getTransakAccessToken()
      const referrerDomain = new URL(FRONTEND_URL).hostname

      const response = await axios.post(
        `${TRANSAK_API_URL}/api/v2/auth/session`,
        {
          widgetParams: {
            apiKey: TRANSAK_API_KEY,
            referrerDomain,
            productsAvailed: request.productsAvailed,
            fiatCurrency: request.fiatCurrency,
            fiatAmount: request.fiatAmount?.toString(),
            cryptoCurrencyCode: request.cryptoCurrency || 'USDC',
            walletAddress: request.walletAddress,
            disableWalletAddressForm: true,
            network: 'ethereum',
            redirectURL: `${FRONTEND_URL}/dashboard`,
          },
          landingPage: 'HOME',
        },
        {
          headers: {
            'content-type': 'application/json',
            'access-token': accessToken,
          },
        }
      )

      const widgetUrl = response.data?.data?.widgetUrl
      if (!widgetUrl) throw new Error('Widget URL missing')

      const sessionId = new URL(widgetUrl).searchParams.get('sessionId')
      if (!sessionId) throw new Error('Session ID missing')

      logger.info('Transak widget created', { userId, sessionId })
      return { widgetUrl, sessionId }
    } catch (err: any) {
      logger.error('Transak session creation failed', err.response?.data || err)
      throw new AppError(500, 'Failed to create Transak session')
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    const hmac = crypto
      .createHmac('sha256', TRANSAK_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex')

    return hmac === signature
  }
}
