import { ChevronDown, ChevronUp } from 'lucide-react'

import { useState } from 'react'

const INTERVAL_OPTIONS = [1, 5, 10, 15, 30, 60]

interface IntervalSelectProps {
	value: number
	onChange: (value: number) => void
}

export function IntervalSelect({ value, onChange }: IntervalSelectProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false)

	const handleIntervalChange = (direction: 'up' | 'down'): void => {
		const currentIndex = INTERVAL_OPTIONS.indexOf(value)
		if (direction === 'up' && currentIndex < INTERVAL_OPTIONS.length - 1) {
			onChange(INTERVAL_OPTIONS[currentIndex + 1])
		} else if (direction === 'down' && currentIndex > 0) {
			onChange(INTERVAL_OPTIONS[currentIndex - 1])
		}
	}

	return (
		<div className="flex items-center gap-4">
			<div className="relative">
				<div
					onClick={() => setIsOpen(!isOpen)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							setIsOpen(!isOpen)
						}
					}}
					className="bg-background-input rounded-md px-2 py-2 space-x-3 flex justify-between items-center w-fit cursor-pointer"
				>
					<span className="text-primary text-base w-5 text-center">{value}</span>
					<div className="flex flex-col text-primary">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								handleIntervalChange('up')
							}}
							className="h-3 flex items-center hover:text-primary/80 transition-colors"
						>
							<ChevronUp size={16} />
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								handleIntervalChange('down')
							}}
							className="h-3 flex items-center hover:text-primary/80 transition-colors"
						>
							<ChevronDown size={16} />
						</button>
					</div>
				</div>
				{isOpen && (
					<div className="absolute top-full mt-1 w-full bg-background-input rounded-md shadow-lg z-10">
						{INTERVAL_OPTIONS.map((option) => (
							<div
								key={option}
								onClick={() => {
									onChange(option)
									setIsOpen(false)
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										onChange(option)
										setIsOpen(false)
									}
								}}
								className="px-2 py-1 hover:bg-background-hover cursor-pointer text-primary text-center transition-colors"
							>
								{option}
							</div>
						))}
					</div>
				)}
			</div>
			<span className="text-tertiary text-sm">Minutos</span>
		</div>
	)
}
