import { useUser } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { catchError } from '~/src/renderer/lib/utils'
import { curse } from '~/src/renderer/requests/curse/curse'
import { getConfigsOptions } from '~/src/renderer/requests/electron-store/config'
import { getAllPaymentsOptions } from '~/src/renderer/requests/payments/config'
import { getUserOptions } from '~/src/renderer/requests/user/config'
import { MESSAGE_DURATION } from '../constants/chat'

interface PetChatCallbacks {
	enabled: boolean
	onMessageShow?: () => void
	onMessageHide?: () => void
	onTakingScreenshot?: () => void
}

export const usePetChat = ({
	enabled,
	onMessageShow,
	onMessageHide,
	onTakingScreenshot
}: PetChatCallbacks): {
	message: string
} => {
	const auth = useUser()
	const queryClient = useQueryClient()
	const [message, setMessage] = useState('')

	const chatTimerRef = useRef<NodeJS.Timeout | null>(null)
	const messageIntervalRef = useRef<NodeJS.Timeout | null>(null)

	const { data: configs } = useQuery(getConfigsOptions())
	const { data: payments } = useQuery(getAllPaymentsOptions(auth.user?.id ?? ''))

	const updatedStates = useRef({
		auth,
		configs,
		payments
	})

	const { mutateAsync: curseMutation } = useMutation({
		mutationFn: curse,
		mutationKey: ['curse'],
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(getUserOptions(variables.userId))
		}
	})

	useEffect(() => {
		updatedStates.current.auth = auth
		updatedStates.current.configs = configs
		updatedStates.current.payments = payments
	}, [auth, configs, payments])

	const showMessage = (message: string) => {
		onMessageShow?.()
		setMessage(message)

		chatTimerRef.current = setTimeout(() => {
			onMessageHide?.()
			setMessage('')
			scheduleNextMessage()
		}, MESSAGE_DURATION)
	}

	const requestCurse = async () => {
		console.log('requestCurse')
		onTakingScreenshot?.()
		const updatedValues = updatedStates.current

		if (!updatedValues.auth.isLoaded) {
			scheduleNextMessage()
			return
		}

		if (!updatedValues.auth.isSignedIn) {
			showMessage('Você precisa estar logado, né cabeção. Clica no ícone lá em cima')
			return
		}

		const [error, base64] = await catchError(window.api.actions.takeScreenshot())

		if (error || !base64.screenshot) {
			showMessage('Deu erro pra eu ver a tua tela aqui, me dá permissão por$a!')
			return
		}

		const [errorCurse, curseResponse] = await catchError(
			curseMutation({
				imageBase64: base64.screenshot,
				config: {
					safeMode: updatedValues.configs!.general.safeMode
				},
				userId: updatedValues.auth.user?.id ?? ''
			})
		)

		if (errorCurse) {
			if (errorCurse.message === 'Insufficient credits') {
				const isPaidUser = !!updatedValues.payments?.find((payment) => payment.status === 'paid')

				if (isPaidUser) {
					showMessage(
						'Jovem, passamos momentos lindos, mas infelizmente nada dura para sempre. E o dinheiro acabou...'
					)
					return
				}

				showMessage(
					'Veio aqui só pra me fazer gastar com Clerk e OpenAI, mas pagar que é bom nada, né?'
				)
				return
			}

			showMessage(
				'Meu amigo, parece que algo quebrou, e algo grande... Se isso continuar por muito tempo, pode mandar um xingamento na aba de feedback, porque o dev que fez isso tá de sacanagem.'
			)
			return
		}

		showMessage(curseResponse.message)
	}

	const scheduleNextMessage = async () => {
		const updatedValues = updatedStates.current

		messageIntervalRef.current = setTimeout(async () => {
			requestCurse()
		}, updatedValues.configs!.general.cursingInterval * 1000)
	}

	function clearTimersAndSetups() {
		setMessage('')
		if (chatTimerRef.current) clearTimeout(chatTimerRef.current)
		if (messageIntervalRef.current) clearTimeout(messageIntervalRef.current)
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: this should be called only once
	useEffect(() => {
		if (!configs || !enabled) {
			console.log('clearTimersAndSetups via useEffect')
			clearTimersAndSetups()
			return
		}
		console.log('scheduleNextMessage')

		scheduleNextMessage()

		return () => {
			clearTimersAndSetups()
		}
	}, [!!configs, enabled])

	return { message }
}
