import { Direction } from '@renderer/hooks/usePetMovement'
import { cn } from '@renderer/lib/utils'
import React from 'react'

interface ChatProps {
  message?: string
  isVisible: boolean
  direction?: Direction
  style?: React.CSSProperties
}

export const Chat = ({
  message,
  isVisible,
  direction = Direction.RIGHT,
  style
}: ChatProps): React.JSX.Element | null => {
  if (!isVisible || !message) return null

  const chatPosition = direction === Direction.RIGHT ? 'left-6' : '-right-10'

  return (
    <div className={cn('absolute bottom-16', chatPosition)} style={style}>
      <div className="bg-white rounded-lg p-3 shadow-md min-w-56">
        <p className="text-gray-800 text-sm break-words hyphens-auto leading-tight">{message}</p>
        <div
          className={cn(
            'absolute top-full',
            direction === Direction.RIGHT ? 'left-4' : 'right-4',
            'w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white'
          )}
        ></div>
      </div>
    </div>
  )
}
