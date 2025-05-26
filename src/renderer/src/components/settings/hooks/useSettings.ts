import { useContext } from 'react'
import { SettingsContextType } from '../types'
import { SettingsContext } from '../context/context'

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
