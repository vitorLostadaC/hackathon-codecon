import { queryOptions } from '@tanstack/react-query'
import { getAllPayments } from './get-all-payments'

export const getAllPaymentsOptions = (userId: string) =>
	queryOptions({
		queryKey: ['payments', userId],
		queryFn: () => getAllPayments(userId),
		enabled: !!userId
	})
