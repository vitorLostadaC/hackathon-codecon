import { cn } from '@renderer/lib/utils'
import { motion } from 'framer-motion'
import type React from 'react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export interface TabButtonProps {
	icon: (isActive: boolean) => React.ReactNode
	label: string
	value: string
}

const NavLinkMotion = motion.create(NavLink)

export function TabButton({ icon, label, value }: TabButtonProps): React.JSX.Element {
	const location = useLocation()
	const [isHovered, setIsHovered] = useState(false)

	const isActive = location.pathname === value

	return (
		<NavLinkMotion
			to={value}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={cn(
				'w-full flex items-center gap-1.5 p-1 px-2 rounded-lg relative overflow-hidden transition-all duration-200 border-granite-500/0 border-t-[1px]',
				'hover:bg-granite-900/50',
				isActive
					? 'bg-background-button text-linen-200 border-t-[1px] border-granite-500/20'
					: 'bg-background-950 text-linen-400 hover:text-granite-100'
			)}
		>
			{/* Principal light animation */}
			<motion.div
				className="absolute z-0 -right-[10px] w-[65px] h-[15px] rounded-full bg-tangerine-400"
				style={{ transformOrigin: 'right' }}
				initial={{
					opacity: 0,
					filter: 'blur(2px)',
					scaleX: 0.4
				}}
				animate={
					isActive
						? {
								opacity: [0.4, 1],
								filter: ['blur(17px)', 'blur(14px)'],
								scaleX: [0.6, 1.1]
							}
						: isHovered
							? {
									opacity: [0, 0.4],
									filter: ['blur(2px)', 'blur(17px)'],
									scaleX: [0.4, 0.6]
								}
							: {
									opacity: 0,
									filter: 'blur(2px)',
									scaleX: 0.4
								}
				}
				transition={{
					duration: isActive ? 0.7 : isHovered ? 0.3 : 0.4,
					ease: isActive || isHovered ? 'easeOut' : 'easeIn'
				}}
			/>

			<motion.div
				className="absolute z-0 -right-[6px] w-[45px] h-[8px] rounded-full bg-tangerine-400"
				style={{ transformOrigin: 'right' }}
				initial={{
					opacity: 0,
					filter: 'blur(10px)',
					scaleX: 0.7
				}}
				animate={
					isActive
						? {
								opacity: 1,
								filter: ['blur(18px)', 'blur(8px)'],
								scaleX: [0.7, 1.1]
							}
						: {
								opacity: 0,
								filter: 'blur(10px)',
								scaleX: 0.7
							}
				}
				transition={{
					duration: isActive ? 0.4 : isHovered ? 0.2 : 0.3,
					delay: 0.2,
					ease: isActive || isHovered ? 'easeOut' : 'easeIn'
				}}
			/>

			{/* Borders with stagger (sequential animation) */}
			<motion.div
				className="absolute z-0 right-0 w-[3px] h-4 rounded-l-full bg-tangerine-400"
				initial={{ opacity: 0.1, scaleY: 0.6 }}
				animate={
					isActive || isHovered
						? { opacity: isActive ? 1 : 0.5, scaleY: isActive ? 1 : 0.9 }
						: { opacity: 0.1, scaleY: 0.6 }
				}
				transition={{
					duration: isActive ? 0.7 : 0.3,
					delay: 0.1,
					ease: 'easeOut'
				}}
			/>
			<motion.div
				className="absolute z-0 right-0 w-[3px] h-4 rounded-l-full bg-tangerine-400 blur-[2.5px]"
				initial={{ opacity: 0.1, scaleY: 0.6 }}
				animate={
					isActive || isHovered
						? { opacity: isActive ? 1 : 0.5, scaleY: isActive ? 1 : 0.9 }
						: { opacity: 0.1, scaleY: 0.6 }
				}
				transition={{
					duration: isActive ? 0.7 : 0.3,
					delay: 0.15,
					ease: 'easeOut'
				}}
			/>

			{/* Content with micro-animation */}
			<motion.div
				className="w-[18px] h-[18px] flex items-center justify-center relative z-10"
				animate={isActive ? { scale: 1.05 } : { scale: 1 }}
				transition={{ duration: 0.2 }}
			>
				{icon(isActive)}
			</motion.div>
			<motion.span
				className="text-base leading-[1.0] relative z-10"
				animate={isActive ? { x: 1 } : { x: 0 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
			>
				{label}
			</motion.span>
		</NavLinkMotion>
	)
}
