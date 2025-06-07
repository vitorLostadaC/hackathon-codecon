import AbacatePay from 'abacatepay-nodejs-sdk/dist/index.js'
import { env } from '../env'

export const abacatePay = AbacatePay(env.ABACATEPAY_API_KEY)
