import { cn } from '@renderer/lib/utils'
import { CreditCard, type LucideIcon, Settings, Shirt } from 'lucide-react'
import type React from 'react'
import { TabButton } from './tab-button'
import { UserProfile } from './user-profile'

const tabs: { href: string; label: string; icon: LucideIcon }[] = [
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
			className={cn('space-y-2 flex flex-col justify-between px-4 py-6 w-fit', isMacOS && 'pt-12')}
		>
			<div className="flex flex-col gap-2 w-40">
				{tabs.map((tab) => (
					<TabButton value={tab.href} key={tab.href} icon={tab.icon} label={tab.label} />
				))}
			</div>
			<UserProfile />
		</div>
	)
}
