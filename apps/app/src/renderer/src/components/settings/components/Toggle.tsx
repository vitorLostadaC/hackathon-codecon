import type React from 'react'

interface ToggleProps {
	checked: boolean
	onChange: (checked: boolean) => void
	className?: string
}

export function Toggle({ checked, onChange, className = '' }: ToggleProps): React.JSX.Element {
	return (
		<button
			type="button"
			onClick={() => onChange(!checked)}
			className={`w-11 h-[22px] rounded-full p-0.5 transition-colors ${
				checked ? 'bg-accent-secondary' : 'bg-background-toggle'
			} ${className}`}
		>
			<div
				className={`w-5 h-[18px] bg-white rounded-full transform transition-transform ${
					checked ? 'translate-x-5' : 'translate-x-0'
				}`}
			/>
		</button>
	)
}
