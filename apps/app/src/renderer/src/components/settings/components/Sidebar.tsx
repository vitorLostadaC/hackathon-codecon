import type React from 'react'
import type { SidebarTab, Tab } from '../types'
import { TabButton } from './TabButton'
import { UserProfile } from './UserProfile'

// Import SVG icons
import CardIcon from '@renderer/assets/icons/card.svg'
import CardSolidIcon from '@renderer/assets/icons/card_solid.svg'
import SettingIcon from '@renderer/assets/icons/setting.svg'
import SettingSolidIcon from '@renderer/assets/icons/setting_solid.svg'
import TShirtIcon from '@renderer/assets/icons/t_shirt.svg'
import TShirtSolidIcon from '@renderer/assets/icons/t_shirt_solid.svg'

interface SidebarProps {
	activeTab: Tab
	onTabChange: (tab: Tab) => void
}

const tabIcons: Record<SidebarTab, { default: string; active: string }> = {
	general: { default: SettingIcon, active: SettingSolidIcon },
	appearance: { default: TShirtIcon, active: TShirtSolidIcon },
	pricing: { default: CardIcon, active: CardSolidIcon }
}

const tabLabels: Record<SidebarTab, string> = {
	general: 'Geral',
	appearance: 'Aparência',
	pricing: 'Preços'
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps): React.JSX.Element {
	return (
		<div className="space-y-2 flex flex-col justify-between px-4 pb-6 pt-7 w-fit">
			<div className="flex flex-col gap-2">
				{(Object.keys(tabLabels) as SidebarTab[]).map((tab) => (
					<TabButton
						key={tab}
						icon={
							<img
								src={activeTab === tab ? tabIcons[tab].active : tabIcons[tab].default}
								alt={tabLabels[tab]}
							/>
						}
						label={tabLabels[tab]}
						isActive={activeTab === tab}
						onClick={() => onTabChange(tab)}
					/>
				))}
			</div>
			<UserProfile name="Vitor Lostada" email="vitorlostada@gmail.com" />
		</div>
	)
}
