import type React from 'react'
import { useState } from 'react'
import type { SettingsState } from '../types'
import { SettingsContext } from './context'

const initialState: SettingsState = {
	printInterval: 30,
	familyFriendly: false,
	selectedTheme: 1,
	selectedPlan: 1
}

export function SettingsProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
	const [settings, setSettings] = useState<SettingsState>(initialState)

	const updateSettings = (
		key: keyof SettingsState,
		value: SettingsState[keyof SettingsState]
	): void => {
		setSettings((prev) => ({ ...prev, [key]: value }))
	}

	return (
		<SettingsContext.Provider value={{ ...settings, updateSettings }}>
			{children}
		</SettingsContext.Provider>
	)
}
