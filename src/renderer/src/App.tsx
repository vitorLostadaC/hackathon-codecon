import { useEffect, useState, useRef } from 'react'
import { Pet } from './components/pet'

export default function App(): React.JSX.Element {
  const [isWalking, setIsWalking] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  //TODO: this is a timer that will toggle the isWalking state every 12 seconds, just for testing
  useEffect(() => {
    const scheduleNextToggle = (walking: boolean): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      const duration = walking ? 12000 : 5000

      timerRef.current = setTimeout(() => {
        setIsWalking((prevWalking) => {
          const newWalking = !prevWalking
          scheduleNextToggle(newWalking)
          return newWalking
        })
      }, duration)
    }
    scheduleNextToggle(true)
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <>
      <Pet isWalking={isWalking} />
    </>
  )
}
