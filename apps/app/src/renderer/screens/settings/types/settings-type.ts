interface BaseSettings {
	id: number
	label: string
	description?: string
	soon?: boolean
}

type NumberSetting = BaseSettings & {
	type: 'number'
	value: number
	onChange: (value: number) => void
}

type ToggleSetting = BaseSettings & {
	type: 'toggle'
	value: boolean
	onChange: (value: boolean) => void
}

export type SettingsType = NumberSetting | ToggleSetting
