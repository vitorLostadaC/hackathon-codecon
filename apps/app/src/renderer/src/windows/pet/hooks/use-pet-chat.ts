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
	isVisible: boolean
} => {
	const [message, setMessage] = useState('')
	const [isVisible, setIsVisible] = useState(false)

	const chatTimerRef = useRef<NodeJS.Timeout | null>(null)
	const messageIntervalRef = useRef<NodeJS.Timeout | null>(null)

	const showMessage = useCallback(() => {
		onMessageShow()
		const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
		setMessage(randomMessage)
		setIsVisible(true)

		chatTimerRef.current = setTimeout(() => {
			setIsVisible(false)
			onMessageHide()
			scheduleNextMessage()
		}, MESSAGE_DURATION)
	}, [onMessageShow, onMessageHide])

	const scheduleNextMessage = useCallback(() => {
		messageIntervalRef.current = setTimeout(() => {
			showMessage()
		}, MESSAGE_INTERVAL)
	}, [showMessage])

	useEffect(() => {
		scheduleNextMessage()
		return () => {
			if (chatTimerRef.current) clearTimeout(chatTimerRef.current)
			if (messageIntervalRef.current) clearTimeout(messageIntervalRef.current)
		}
	}, [scheduleNextMessage])

	return { message, isVisible }
}
