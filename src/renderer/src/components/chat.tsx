import React from 'react'

interface ChatProps {
  message?: string
  isVisible: boolean
  direction?: number // 1 para direita, -1 para esquerda
  style?: React.CSSProperties
}

export const Chat = ({
  message,
  isVisible,
  direction = 1,
  style
}: ChatProps): React.JSX.Element => {
  if (!isVisible || !message) {
    return <div></div>
  }

  // Define a posição baseada na direção
  const chatPosition = direction === 1 ? 'left-6' : '-right-10'

  return (
    <div className={`absolute bottom-16 ${chatPosition}`} style={style}>
      <div className="bg-white rounded-lg p-3 shadow-md min-w-56">
        <p className="text-gray-800 text-sm break-words hyphens-auto leading-tight">{message}</p>
        {/* Triângulo apontando para baixo */}
        <div
          className={`absolute top-full ${direction === 1 ? 'left-4' : 'right-4'} w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white`}
        ></div>
      </div>
    </div>
  )
}
