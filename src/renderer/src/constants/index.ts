export const PET_WIDTH = 64
export const MOVEMENT_SPEED = 2
export const MESSAGE_DURATION = 5000
export const MESSAGE_INTERVAL = 10000

export const MESSAGES = [
  'Hello!',
  'How are you?',
  'What is your name?',
  'What is your favorite color?'
]

export enum PetState {
  WALKING = 'walking',
  PRINTING = 'printing',
  STOPPED = 'stopped'
}

export enum Direction {
  LEFT = -1,
  RIGHT = 1
}

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

// Dimensões do pet em pixels (convertido de tailwind w-16 h-16)
export const PET_DIMENSIONS = {
  width: 64,
  height: 64
}

// Configurações de animação
export const ANIMATION = {
  transformDuration: 100 // ms
}

export const CHAT_POSITION = {
  RIGHT_THRESHOLD: 220,
  LEFT_THRESHOLD: 244 + 30 // width + padding
}
