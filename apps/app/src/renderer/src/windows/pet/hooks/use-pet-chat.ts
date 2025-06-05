import { MESSAGES } from '@renderer/windows/pet/constants/messages'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MESSAGE_DURATION, MESSAGE_INTERVAL } from '../constants/chat'

interface PetChatCallbacks {
	onMessageShow: () => void
	onMessageHide: () => void
}

export const usePetChat = ({
	onMessageShow,
	onMessageHide
}: PetChatCallbacks): {
	message: string
} => {
	const [message, setMessage] = useState('')

	const chatTimerRef = useRef<NodeJS.Timeout | null>(null)
	const messageIntervalRef = useRef<NodeJS.Timeout | null>(null)

	const showMessage = useCallback(
		(message: string) => {
			onMessageShow()
			setMessage(message)

			chatTimerRef.current = setTimeout(() => {
				onMessageHide()
				setMessage('')
				scheduleNextMessage()
			}, MESSAGE_DURATION)
		},
		[onMessageShow, onMessageHide]
	)

	const scheduleNextMessage = useCallback(() => {
		messageIntervalRef.current = setTimeout(async () => {
			const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
			await new Promise((resolve) => setTimeout(resolve, 1000))
			showMessage(randomMessage)
		}, MESSAGE_INTERVAL)
	}, [showMessage])

	useEffect(() => {
		scheduleNextMessage()

		return () => {
			if (chatTimerRef.current) clearTimeout(chatTimerRef.current)
			if (messageIntervalRef.current) clearTimeout(messageIntervalRef.current)
		}
	}, [])

	return { message }
}
