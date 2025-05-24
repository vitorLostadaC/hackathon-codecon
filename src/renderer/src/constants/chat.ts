import React from 'react'
import { Direction } from './pet'

export const MESSAGE_DURATION = 5000
export const MESSAGE_INTERVAL = 10000

export interface PetChatCallbacks {
  onMessageShow: () => void
  onMessageHide: () => void
}

export interface ChatProps {
  message?: string
  isVisible: boolean
  direction?: Direction
  style?: React.CSSProperties
}

export const CHAT_POSITION = {
  RIGHT_THRESHOLD: 220,
  LEFT_THRESHOLD: 244 + 30 // width + padding
}
