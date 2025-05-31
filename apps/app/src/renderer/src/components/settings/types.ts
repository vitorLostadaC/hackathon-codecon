export type SidebarTab = 'general' | 'appearance' | 'pricing'
export type Tab = SidebarTab | 'home'

export interface SettingsState {
	printInterval: number
	familyFriendly: boolean
	selectedTheme: number
	selectedPlan: number
}

export interface SettingsContextType extends SettingsState {
	updateSettings: (key: keyof SettingsState, value: SettingsState[keyof SettingsState]) => void
}

export interface TabButtonProps {
	icon: React.ReactNode
	label: string
	isActive: boolean
	onClick: () => void
}

export interface UserProfileProps {
	name: string
	email: string
}
