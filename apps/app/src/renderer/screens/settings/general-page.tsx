import type React from 'react'
import { Badge } from '../../components/ui/badge'
import { InputNumber } from '../../components/ui/input-number'
import { Switch } from '../../components/ui/switch'
import { cn } from '../../lib/utils'
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
			description: 'Seu pet não falará palavrões',
			type: 'toggle',
			value: configs.general.safeMode,
			onChange: (value) => updateConfig({ general: { ...configs.general, safeMode: value } })
		},
		{
			id: 2,
			label: 'Modo foco',
			description: 'Você será incentivado a fazer coisas produtivas baseadas na sua profissão',
			type: 'toggle',
			value: !!configs.general.focusMode,
			onChange: (value) =>
				updateConfig({ general: { ...configs.general, focusMode: value ? { job: '' } : null } }),
			soon: true
			// TODO: implement submenu
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
							disabled={setting.soon}
							min={1}
							className="w-16"
						/>
						<span className="text-gray-300 text-sm">segundos</span>
					</div>
				)
			case 'toggle':
				return (
					<Switch
						checked={setting.value as boolean}
						onCheckedChange={setting.onChange}
						disabled={setting.soon}
					/>
				)
			default:
				return null
		}
	}

	return (
		<div className="space-y-8 ">
			{settings.map((setting) => (
				<div key={setting.id} className="flex justify-between items-start">
					<div className="space-y-1">
						<span className={cn('text-white font-medium', setting.soon && 'text-gray-300')}>
							{setting.label} {setting.soon && <Badge variant="secondary">Em breve</Badge>}
						</span>
						{setting.description && (
							<p className={cn('text-gray-300 text-sm max-w-96', setting.soon && 'text-gray-500')}>
								{setting.description}
							</p>
						)}
					</div>
					<div>{renderSettingControl(setting)}</div>
				</div>
			))}
		</div>
	)
}
