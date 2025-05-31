import { cn } from '@renderer/lib/utils'
import type React from 'react'

interface ButtonProps {
	children: React.ReactNode
	onClick?: () => void
	variant?: 'primary' | 'secondary'
	className?: string
	fullWidth?: boolean
}

export function Button({
	children,
	onClick,
	variant = 'primary',
	className = '',
	fullWidth = false
}: ButtonProps): React.JSX.Element {
	const baseStyles = 'py-3 px-4 rounded-lg font-medium text-base leading-[1.0] transition-colors'
	const variantStyles = {
		primary: 'bg-gradient-to-t from-accent-from to-accent-to text-[#190A02]',
		secondary: 'bg-background-tertiary text-primary'
	}
	const widthStyles = fullWidth ? 'w-full' : ''

	return (
		<button
			onClick={onClick}
			className={cn(baseStyles, variantStyles[variant], widthStyles, className)}
		>
			{children}
		</button>
	)
}
