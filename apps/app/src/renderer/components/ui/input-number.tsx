import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Input } from './input'

interface InputNumberProps extends React.ComponentProps<'input'> {
	onValueChange: (value: number) => void
	value: number
}

type Direction = 1 | -1

export const InputNumber = ({
	className,
	onValueChange,
	value,
	min,
	max,
	step = 1,
	...props
}: InputNumberProps) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(e.target.value)
		if (!Number.isNaN(newValue)) {
			onValueChange(newValue)
		}
	}

	const handleStep = (direction: Direction) => {
		let newValue = value + direction * Number(step)
		if (typeof min === 'number') newValue = Math.max(newValue, min)
		if (typeof max === 'number') newValue = Math.min(newValue, max)
		onValueChange(newValue)
	}

	const stepButtons = [
		{
			ariaLabel: 'Increment',
			direction: 1 as Direction,
			Icon: ChevronUp,
			disabled: typeof max === 'number' && value >= max
		},
		{
			ariaLabel: 'Decrement',
			direction: -1 as Direction,
			Icon: ChevronDown,
			disabled: typeof min === 'number' && value <= min
		}
	]

	return (
		<div className={cn('flex items-center gap-2 relative', className)}>
			<Input
				type="number"
				className={cn('pr-8 w-full')}
				value={value}
				onChange={handleInputChange}
				min={min}
				max={max}
				step={step}
				{...props}
			/>
			<div className="flex flex-col absolute top-1/2 -translate-y-1/2 right-1 z-10">
				{stepButtons.map(({ ariaLabel, direction, Icon, disabled }) => (
					<button
						key={ariaLabel}
						type="button"
						aria-label={ariaLabel}
						onClick={() => handleStep(direction)}
						tabIndex={-1}
						disabled={disabled}
						className="focus:outline-none disabled:opacity-50 cursor-pointer"
					>
						<Icon className="text-linen-200 size-3.5 cursor-pointer" />
					</button>
				))}
			</div>
		</div>
	)
}
