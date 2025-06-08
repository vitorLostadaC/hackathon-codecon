import { useUser } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { curse } from '~/src/renderer/requests/curse/curse'
import { getConfigsOptions } from '~/src/renderer/requests/electron-store/config'
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
	const [message, setMessage] = useState('')

	const chatTimerRef = useRef<NodeJS.Timeout | null>(null)
	const messageIntervalRef = useRef<NodeJS.Timeout | null>(null)

	const { data: configs } = useQuery(getConfigsOptions())

	const updatedStates = useRef({
		auth,
		configs
	})

	useEffect(() => {
		updatedStates.current.auth = auth
		updatedStates.current.configs = configs
	}, [auth, configs])

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
		onTakingScreenshot?.()
		const { auth, configs: c } = updatedStates.current
		const configs = c!

		if (!auth.isLoaded) {
			scheduleNextMessage()
			return
		}

		if (!auth.isSignedIn) {
			showMessage('Você precisa estar logado, né cabeção')
			return
		}

		await curse({
			imageBase64: '',
			config: {
				safeMode: configs.general.safeMode
			},
			userId: auth.user?.id ?? ''
		})
	}

	const scheduleNextMessage = async () => {
		const { configs: c } = updatedStates.current
		const configs = c!

		messageIntervalRef.current = setTimeout(async () => {
			requestCurse()
		}, configs.general.cursingInterval * 1000)
	}

	function clearTimersAndSetups() {
		setMessage('')
		if (chatTimerRef.current) clearTimeout(chatTimerRef.current)
		if (messageIntervalRef.current) clearTimeout(messageIntervalRef.current)
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: this should be called only once
	useEffect(() => {
		if (!configs || !enabled) {
			clearTimersAndSetups()
			return
		}

		scheduleNextMessage()

		return () => {
			clearTimersAndSetups()
		}
	}, [!!configs, enabled])

	return { message }
}
