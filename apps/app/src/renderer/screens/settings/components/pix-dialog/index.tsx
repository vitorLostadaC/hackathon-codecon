import type { PaymentPlan, PaymentResponse } from '@repo/api-types/payment.dto'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog'
import { type PixFormValues, PixQrCodeForm } from './pix-form'
import { PixQrCodeDialog } from './pix-qr-code'

interface PixDialogProps {
	plan: PaymentPlan
	defaultValues?: PixFormValues
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function PixDialog({ defaultValues, open, onOpenChange, plan }: PixDialogProps) {
	const [pixPayment, setPixPayment] = useState<PaymentResponse>()

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				if (!value) setPixPayment(undefined)

				onOpenChange(value)
			}}
		>
			<DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Pagamento via PIX - {plan}</DialogTitle>
				</DialogHeader>

				{pixPayment ? (
					<PixQrCodeDialog
						paymentId={pixPayment.paymentId}
						qrCodeBase64={pixPayment.qrCodeBase64}
					/>
				) : (
					<PixQrCodeForm plan={plan} defaultValues={defaultValues} setPixPayment={setPixPayment} />
				)}
			</DialogContent>
		</Dialog>
	)
}
