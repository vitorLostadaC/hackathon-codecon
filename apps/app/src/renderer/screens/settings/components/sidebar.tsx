import { CreditCard, Settings, Shirt } from 'lucide-react'
import type React from 'react'
import { TabButton } from './tab-button'
import { UserProfile } from './user-profile'

// Import SVG icons
import CardIcon from '@renderer/assets/icons/card.svg'
import CardSolidIcon from '@renderer/assets/icons/card_solid.svg'
import SettingIcon from '@renderer/assets/icons/setting.svg'
import SettingSolidIcon from '@renderer/assets/icons/setting_solid.svg'
import TShirtIcon from '@renderer/assets/icons/t_shirt.svg'
import TShirtSolidIcon from '@renderer/assets/icons/t_shirt_solid.svg'
import { cn } from '@renderer/lib/utils'

const tabIcons: Record<string, { default: string; active: string }> = {
	general: { default: SettingIcon, active: SettingSolidIcon },
	appearance: { default: TShirtIcon, active: TShirtSolidIcon },
	pricing: { default: CardIcon, active: CardSolidIcon }
}

const tabs = [
	{
		href: '/',
		label: 'Geral',
		icon: Settings
	},
	{
		href: '/appearance',
		label: 'Aparência',
		icon: Shirt
	},
	{
		href: '/pricing',
		label: 'Preços',
		icon: CreditCard
	}
]

export function Sidebar(): React.JSX.Element {
	const isMacOS = process.platform === 'darwin'

	return (
		<div
			className={cn('space-y-2 flex flex-col justify-between p-4 pt-7 w-fit', isMacOS && 'pt-12')}
		>
			<div className="flex flex-col gap-2">
				{tabs.map((tab) => (
					<TabButton
						value={tab.href}
						key={tab.href}
						icon={(isActive) => (
							<tab.icon className={cn('size-6 stroke-linen-300', isActive && 'stroke-white')} />
						)}
						label={tab.label}
					/>
				))}
			</div>
			<UserProfile name="Vitor Lostada" email="vitorlostada@gmail.comsdf sdf" />
		</div>
	)
}
