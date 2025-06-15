import { useUser } from '@clerk/clerk-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { confetti } from '@tsparticles/confetti'
import Lottie from 'lottie-react'
import { useEffect } from 'react'
import { getPaymentOptions } from '~/src/renderer/requests/payments/config'
import { getUserOptions } from '~/src/renderer/requests/user/config'
import successDuck from './assets/success-duck.json'

interface PixQrCodeDialogProps {
	paymentId: string
	qrCodeBase64: string
}

export const PixQrCodeDialog = ({ paymentId, qrCodeBase64 }: PixQrCodeDialogProps) => {
	const queryClient = useQueryClient()
	const { user } = useUser()
	const { data } = useQuery({
		...getPaymentOptions(paymentId),
		refetchInterval: (query) => {
			const { data } = query.state
			return data?.status === 'paid' ? false : 2000
		}
	})

	const isPaid = data?.status === 'paid'

	useEffect(() => {
		if (!isPaid) return

		queryClient.invalidateQueries(getUserOptions(user?.id ?? ''))

		const config = {
			particleCount: 100,
			spread: 100,
			startVelocity: 45,
			decay: 0.9,
			gravity: 1,
			drift: 0,
			ticks: 200,
			colors: ['#DDA37A', '#FF6900', '#FF8904', '#FDA830'],
			shapes: ['square', 'circle'],
			scalar: 1,
			zIndex: 9999,
			disableForReducedMotion: false
		}

		Array.from({ length: 5 }).forEach((_, index) => {
			const angle = Math.random() * 360
			const origin = { x: Math.random(), y: Math.random() }

			confetti({
				...config,
				angle,
				origin
			})

			confetti({
				...config,
				angle: angle + index * 120,
				origin
			})
		})
	}, [isPaid])

	if (isPaid) {
		return (
			<div className="flex flex-col items-center gap-4">
				<Lottie
					animationData={successDuck}
					loop
					autoplay
					style={{ width: '150px', height: 'auto' }}
				/>
				<h1 className="font-medium text-xl">Pagamento realizado com sucesso!</h1>
				<p className="text-gray-400 text-center">Espero que se arrependa dessa compra! 😊</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4 items-center">
			<img src={qrCodeBase64} alt="Pix QR Code" className="bg-tangerine-400 p-2 rounded-md" />
			<span className="text-sm text-gray-400">Escaneie o QR Code para realizar o pagamento</span>
		</div>
	)
}
