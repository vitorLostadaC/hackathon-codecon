import type { ButtonHTMLAttributes } from 'react'
import { cn } from 'renderer/lib/utils'

const variantStyles = {
	primary: 'bg-gradient-to-t from-accent-from to-accent-to text-[#190A02]',
	primaryDisabled: 'bg-gradient-to-t from-accent-from/50 to-accent-to/50 text-[#190A02]',
	secondary: 'bg-background-tertiary text-primary'
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	variant?: keyof typeof variantStyles
}

export function Button({
	children,
	variant = 'primary',
	className,
	...props
}: ButtonProps): React.JSX.Element {
	const baseStyles = 'py-3 px-4 rounded-lg font-medium text-base leading-[1.0] transition-colors'

	return (
		<button className={cn(baseStyles, variantStyles[variant], className)} {...props}>
			{children}
		</button>
	)
}
