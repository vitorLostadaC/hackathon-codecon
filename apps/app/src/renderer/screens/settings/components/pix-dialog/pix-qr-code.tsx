import { useQuery } from '@tanstack/react-query'
import { getPaymentOptions } from '~/src/renderer/requests/payments/config'

interface PixQrCodeDialogProps {
	paymentId: string
	qrCodeBase64: string
}

export const PixQrCodeDialog = ({ paymentId, qrCodeBase64 }: PixQrCodeDialogProps) => {
	const { data } = useQuery({
		...getPaymentOptions(paymentId),
		refetchInterval: (query) => {
			const { data } = query.state
			return data?.status === 'paid' ? false : 2000
		}
	})

	const isPaid = data?.status === 'paid'

	// TODO: Implement user feedback + implement animaiton when is loading pix

	return (
		<div className="flex flex-col gap-4 items-center">
			<img src={qrCodeBase64} alt="Pix QR Code" className="bg-tangerine-400 p-2 rounded-md" />
			<span className="text-sm text-gray-400">Escaneie o QR Code para realizar o pagamento</span>
		</div>
	)
}
