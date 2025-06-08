import type React from 'react'
import { InputNumber } from '../../components/ui/input-number'
import { Switch } from '../../components/ui/switch'
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
				return (
					<div className="flex items-center gap-4">
						<InputNumber
							value={setting.value as number}
							onValueChange={setting.onChange}
							min={1}
							className="w-16"
						/>
						<span className="text-granite-100 text-sm">minutos</span>
					</div>
				)
			case 'toggle':
				return <Switch checked={setting.value as boolean} onCheckedChange={setting.onChange} />
			default:
				return null
		}
	}

	return (
		<div className="space-y-8 ">
			{settings.map((setting) => (
				<div key={setting.id} className="flex justify-between items-start">
					<div className="space-y-1">
						<span className="text-linen-200 text-base">{setting.label}</span>
						{setting.description && (
							<p className="text-granite-100 text-sm">{setting.description}</p>
						)}
					</div>
					<div>{renderSettingControl(setting)}</div>
				</div>
			))}
		</div>
	)
}
