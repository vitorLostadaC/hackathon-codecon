import { ChevronDown, ChevronUp } from 'lucide-react'
import type React from 'react'
import { useRef } from 'react'
import { Toggle } from '../components/Toggle'

interface GeneralTabProps {
	printInterval: number
	onPrintIntervalChange: (value: number) => void
	familyFriendly: boolean
	onFamilyFriendlyChange: (value: boolean) => void
}

export function GeneralTab({
	printInterval,
	onPrintIntervalChange,
	familyFriendly,
	onFamilyFriendlyChange
}: GeneralTabProps): React.JSX.Element {
	const interval = useRef<NodeJS.Timeout | null>(null)
	const incrementRef = useRef(1)

	const handleMouseDown = (direction: 'up' | 'down'): void => {
		let current = printInterval

		const adjust = (): void => {
			incrementRef.current = Math.min(incrementRef.current * 1) // size limit
			const delta = incrementRef.current
			const newValue = direction === 'up' ? current + delta : Math.max(1, current - delta)

			current = newValue
			onPrintIntervalChange(newValue)
		}

		incrementRef.current = 1
		adjust()
		interval.current = setInterval(adjust, 200)
	}

	const handleMouseUp = (): void => {
		if (interval.current) clearInterval(interval.current)
		incrementRef.current = 1
	}

	return (
		<div className="space-y-8 mx-8 pt-4">
			<div className="flex justify-between items-center">
				<span className="text-primary text-lg leading-[1.0]">Intervalo de print</span>
				<div className="flex items-center gap-4">
					<div className="bg-background-input rounded-md px-2 py-2 space-x-3 flex justify-between items-center w-fit">
						<input
							type="number"
							value={printInterval}
							min={1}
							className="bg-transparent text-primary text-base w-5 outline-none text-center no-spinner"
						/>
						<div className="flex flex-col text-primary">
							<button
								onMouseDown={() => handleMouseDown('up')}
								onMouseUp={handleMouseUp}
								onMouseLeave={handleMouseUp}
								className="h-3 flex items-center"
							>
								<ChevronUp size={16} />
							</button>
							<button
								onMouseDown={() => handleMouseDown('down')}
								onMouseUp={handleMouseUp}
								onMouseLeave={handleMouseUp}
								className="h-3 flex items-center"
							>
								<ChevronDown size={16} />
							</button>
						</div>
					</div>
					<span className="text-tertiary text-base">Minutos</span>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<span className="text-primary text-lg">Family Friend</span>
					<Toggle checked={familyFriendly} onChange={onFamilyFriendlyChange} />
				</div>
				<p className="text-tertiary text-base">Seu pato não ficará falando palavrões</p>
			</div>
		</div>
	)
}
