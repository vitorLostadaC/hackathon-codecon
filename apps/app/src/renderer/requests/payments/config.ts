import { queryOptions } from '@tanstack/react-query'
import { getAllPayments } from './get-all-payments'
import { getPayment } from './get-payment'

export const getAllPaymentsOptions = (userId: string) =>
	queryOptions({
		queryKey: ['payments', userId],
		queryFn: () => getAllPayments(userId),
		enabled: !!userId
	})

export const getPaymentOptions = (paymentId: string) =>
	queryOptions({
		queryKey: ['payment', paymentId],
		queryFn: () => getPayment(paymentId),
		enabled: !!paymentId
	})
