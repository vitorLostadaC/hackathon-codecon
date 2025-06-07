import type React from 'react'
import type { UserProfileProps } from '../types'

export function UserProfile({ name, email }: UserProfileProps): React.JSX.Element {
	return (
		<div className="w-fit">
			<div className="flex items-center gap-2.5 bg-background-secondary border border-smoke-700 rounded-[10px] p-2.5 px-4">
				<div className="flex flex-col gap-1">
					<span className="text-linen-200 text-sm">{name}</span>
					<span className="text-granite-100 text-xs">{email}</span>
				</div>
			</div>
		</div>
	)
}
