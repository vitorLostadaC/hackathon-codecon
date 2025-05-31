import { cn } from '@renderer/lib/utils'
import type React from 'react'
import type { TabButtonProps } from '../types'

export function TabButton({ icon, label, isActive, onClick }: TabButtonProps): React.JSX.Element {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'w-[133px] flex items-center gap-1.5 p-1 px-2 rounded-lg hover:bg-background-secondary relative overflow-hidden',
				isActive
					? 'bg-background-tertiary text-primary border-t-[1px] border-secondary/40'
					: 'bg-background-primary text-secondary'
			)}
		>
			{isActive && (
				<>
					<div className="absolute z-0 -right-6 w-[80px] h-[20px] rounded-full bg-gradient-to-l from-accent-secondary to-accent-secondary/60 blur-[12px]" />
					<div className="absolute z-0 right-0 w-[3px] h-4 rounded-l-full bg-accent-secondary" />
					<div className="absolute z-0 right-0 w-[3px] h-4 rounded-l-full bg-accent-secondary blur-[2.5px]" />
				</>
			)}
			<div className="w-[18px] h-[18px] flex items-center justify-center relative z-10">{icon}</div>
			<span className="text-base leading-[1.0] relative z-10">{label}</span>
		</button>
	)
}
