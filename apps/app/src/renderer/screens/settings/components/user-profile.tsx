import type React from 'react'
import type { UserProfileProps } from '../types'

export function UserProfile({ name, email }: UserProfileProps): React.JSX.Element {
	return (
		<div className="flex flex-col gap-1 bg-background-secondary border border-smoke-700 rounded-lg p-2.5 px-4 w-40">
			<span className="text-linen-200 text-sm truncate">{name}</span>
			<span className="text-granite-100 text-xs truncate">{email}</span>
		</div>
	)
}
