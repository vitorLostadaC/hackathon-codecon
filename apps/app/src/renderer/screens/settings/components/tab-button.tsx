import { cn } from '@renderer/lib/utils'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

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

type BlurEffectProps = {
	className?: string
	intensity?: number
	position?: 'top' | 'bottom' | 'left' | 'right'
}

function BlurEffect({ className = '', intensity = 50, position = 'top' }: BlurEffectProps) {
	const intensityFactor = intensity / 50

	const blurLayers = [
		{ blur: `${1 * intensityFactor}px`, maskStart: 0, maskEnd: 25, zIndex: 1 },
		{ blur: `${3 * intensityFactor}px`, maskStart: 25, maskEnd: 75, zIndex: 2 },
		{ blur: `${6 * intensityFactor}px`, maskStart: 75, maskEnd: 100, zIndex: 3 }
	]

	const positionClasses = {
		bottom: 'bottom-0 left-0 right-0',
		top: 'top-0 left-0 right-0',
		left: 'left-0 top-0 bottom-0',
		right: 'right-0 top-0 bottom-0'
	}

	const gradientDirection = {
		bottom: 'to bottom',
		top: 'to top',
		left: 'to left',
		right: 'to right'
	}

	return (
		<div className={`absolute ${positionClasses[position]} z-10 ${className}`}>
			{blurLayers.map((layer, index) => (
				<div
					key={index}
					className="absolute inset-0 pointer-events-none"
					style={{
						zIndex: layer.zIndex,
						backdropFilter: `blur(${layer.blur})`,
						WebkitBackdropFilter: `blur(${layer.blur})`,
						maskImage: `linear-gradient(${gradientDirection[position]}, transparent ${layer.maskStart}%, black ${layer.maskEnd}%)`,
						WebkitMaskImage: `linear-gradient(${gradientDirection[position]}, transparent ${layer.maskStart}%, black ${layer.maskEnd}%)`
					}}
				/>
			))}
		</div>
	)
}
