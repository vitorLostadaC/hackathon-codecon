import type { Payment } from '@repo/api-types/payment.dto'
import { getAllPayments } from '../../../services/mongo/payment'

export class GetAllPaymentsUseCase {
	async execute(userId: string): Promise<Payment[]> {
		const payments = await getAllPayments(userId)
		return payments
	}
}
