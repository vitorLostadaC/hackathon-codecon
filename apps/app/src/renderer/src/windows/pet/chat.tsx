import { cn } from '@renderer/lib/utils'
import { Direction } from '@renderer/windows/pet/constants/pet'
import { forwardRef } from 'react'

interface ChatProps {
	message: string
	direction: Direction
}

export const Chat = forwardRef<HTMLDivElement, ChatProps>(
	({ message, direction }, ref): React.JSX.Element | null => {
		if (!message) return null

		const isRight = direction === Direction.RIGHT

		return (
			<div ref={ref} className={cn('absolute bottom-full', isRight ? 'left-0' : 'right-0')}>
				<div className="bg-white rounded-lg p-3 shadow-md min-w-56">
					<p className="text-gray-800 text-sm break-words hyphens-auto leading-tight">{message}</p>
					<div
						className={cn(
							'absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white',
							isRight ? 'left-7' : 'right-7'
						)}
					/>
				</div>
			</div>
		)
	}
)
Chat.displayName = 'Chat'
