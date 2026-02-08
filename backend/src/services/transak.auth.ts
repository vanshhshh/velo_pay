import axios from 'axios'
import { logger } from '../config/logger'

const TRANSAK_REFRESH_URL = 'https://api-stg.transak.com/partners/api/v2/refresh-token'
const TRANSAK_API_KEY = process.env.TRANSAK_API_KEY!
const TRANSAK_API_SECRET = process.env.TRANSAK_API_SECRET!

let cachedToken: string | null = null
let tokenTime = 0
const TOKEN_TTL = 25 * 60 * 1000 // 25 minutes

export async function getTransakAccessToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && now - tokenTime < TOKEN_TTL) {
    return cachedToken
  }

  const res = await axios.post(
    TRANSAK_REFRESH_URL,
    { apiKey: TRANSAK_API_KEY },
    {
      headers: {
        'api-secret': TRANSAK_API_SECRET,
        'content-type': 'application/json',
        accept: 'application/json',
      },
    }
  )

  const token = res.data?.data?.accessToken
  if (!token) {
    throw new Error('Transak access token missing')
  }

  cachedToken = token
  tokenTime = now

  logger.info('Transak access token refreshed')
  return token
}
