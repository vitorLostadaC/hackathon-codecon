import { useState } from 'react'
import duck from '../assets/animals/duck/duck.gif'

export const Pet = (): React.JSX.Element => {
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const handleDirection = (): void => {
    setDirection(direction === 'left' ? 'right' : 'left')
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src={duck}
        alt="pet"
        className={`w-20 h-20 ${direction === 'left' ? 'rotate-180' : ''}`}
      />
    </div>
  )
}
