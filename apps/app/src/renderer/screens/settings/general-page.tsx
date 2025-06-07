import type React from 'react'
import { IntervalSelect } from './components/interval-select'
import { Toogle } from './components/toogle'
import { useConfig } from './hooks/use-config'
import type { SettingsType } from './types/settings-type'

export function GeneralPage() {
	const { configs, updateConfig } = useConfig()

	if (!configs) return null

	const settings: SettingsType[] = [
		{
			id: 0,
			label: 'Intervalo de xingamento',
			description: 'Tempo entre cada xingamento enviado pelo pet',
			type: 'number',
			value: configs.general.cursingInterval,
			onChange: (value) => updateConfig({ general: { ...configs.general, cursingInterval: value } })
		},
		{
			id: 1,
			label: 'Modo família',
			description: 'Seu pato não falará palavrões',
			type: 'toggle',
			value: configs.general.safeMode,
			onChange: (value) => updateConfig({ general: { ...configs.general, safeMode: value } })
		}
	]

	const renderSettingControl = (setting: SettingsType): React.ReactNode => {
		switch (setting.type) {
			case 'number':
				return <IntervalSelect value={setting.value as number} onChange={setting.onChange} />
			case 'toggle':
				return <Toogle checked={setting.value as boolean} onChange={setting.onChange} />
			default:
				return null
		}
	}

	return (
		<div className="space-y-8 ">
			{settings.map((setting) => (
				<div key={setting.id} className="space-y-3">
					<div className="flex justify-between items-center">
						<span className="text-linen-200 text-base">{setting.label}</span>
						{renderSettingControl(setting)}
					</div>
					{setting.description && <p className="text-granite-100 text-sm">{setting.description}</p>}
				</div>
			))}
		</div>
	)
}
