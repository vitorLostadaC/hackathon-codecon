import { cn } from '@renderer/lib/utils'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BlurEffect } from '~/src/renderer/components/ui/blur-effect'

export interface TabButtonProps {
	icon: LucideIcon
	label: string
	value: string
}

export function TabButton({ icon: Icon, label, value }: TabButtonProps): React.JSX.Element {
	const location = useLocation()
	const [isHovered, setIsHovered] = useState(false)

	const isActive = location.pathname === value

	return (
		<NavLink
			to={value}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={cn(
				'w-full flex items-center gap-1.5 p-1 px-2 rounded-lg relative overflow-hidden',
				'hover:bg-gray-900/50',
				isActive
					? 'bg-gray-900 [box-shadow:inset_0px_0.5px_0.8px_0px_#5b5858]'
					: 'text-gray-300 hover:text-gray-100'
			)}
		>
			<div
				className="absolute w-20 h-4 bg-tangerine-400 z-0"
				style={{
					opacity: isActive ? 1 : 0,
					right: isActive ? '-50px' : '-90px'
				}}
			/>

			<BlurEffect position="right" className="w-full" intensity={400} />

			{[...new Array(2)].map((_, i) => (
				<motion.div
					key={i}
					className={cn(
						'absolute z-10 right-0 w-[3px] top-0 bottom-0 rounded-l-full bg-tangerine-400 ',
						i === 1 && 'blur-[2.5px]'
					)}
					initial={{ opacity: 0.1, scaleY: 0.6 }}
					animate={{
						background: isActive || isHovered ? '#FF8904' : '#CFC9C9',
						opacity: isActive ? 1 : isHovered ? 0.5 : 0.1
					}}
					transition={{
						duration: 0
					}}
				/>
			))}
			<motion.div
				className="w-[18px] h-[18px] flex items-center justify-center relative z-10"
				transition={{ duration: 0.2 }}
			>
				<Icon className={cn('size-20 text-gray-600', isActive && 'text-gray-200')} />
			</motion.div>
			<motion.span
				className="text-base leading-[1.0] relative z-10"
				animate={{
					x: 0
				}}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				{label}
			</motion.span>
		</NavLink>
	)
}
