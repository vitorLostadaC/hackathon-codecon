import type { Payment } from '@repo/api-types/payment.dto'
import { api } from '../../lib/axios'

export const getAllPayments = async (userId: string): Promise<Payment[]> =>
	api.get(`/payment/all/${userId}`)
