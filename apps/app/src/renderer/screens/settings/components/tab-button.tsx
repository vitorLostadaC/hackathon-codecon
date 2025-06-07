import { cn } from '@renderer/lib/utils'
import { motion } from 'framer-motion'
import type React from 'react'
import { useState } from 'react'
import type { TabButtonProps } from '../types'

export function TabButton({ icon, label, isActive, onClick }: TabButtonProps): React.JSX.Element {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={cn(
				'w-full flex items-center gap-1.5 p-1 px-2 rounded-lg relative overflow-hidden transition-all duration-200 border-secondary/0 border-t-[1px]',
				'hover:bg-background-secondary/50',
				isActive
					? 'bg-background-button text-linen-200 border-t-[1px] border-secondary/20'
					: 'bg-background-primary text-secondary hover:text-tertiary'
			)}
		>
			{/* Principal light animation */}
			<motion.div
				className="absolute z-0 -right-[10px] w-[65px] h-[15px] rounded-full bg-accent-secondary"
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
				className="absolute z-0 -right-[6px] w-[45px] h-[8px] rounded-full bg-accent-secondary"
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
				className="absolute z-0 right-0 w-[3px] h-4 rounded-l-full bg-accent-secondary"
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
				className="absolute z-0 right-0 w-[3px] h-4 rounded-l-full bg-accent-secondary blur-[2.5px]"
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
				{icon}
			</motion.div>
			<motion.span
				className="text-base leading-[1.0] relative z-10"
				animate={isActive ? { x: 1 } : { x: 0 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
			>
				{label}
			</motion.span>
		</motion.button>
	)
}
