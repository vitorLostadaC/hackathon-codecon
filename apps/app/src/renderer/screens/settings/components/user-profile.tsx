import { SignInButton, useUser } from '@clerk/clerk-react'
import { Button } from '~/src/renderer/components/ui/button'

export function UserProfile() {
	const auth = useUser()

	if (!auth.isLoaded) return <div>Loading...</div>

	if (!auth.isSignedIn)
		return (
			<SignInButton mode="modal">
				<Button className="w-40">Login</Button>
			</SignInButton>
		)

	return (
		<div className="flex flex-col gap-1 bg-granite-900 border border-smoke-700 rounded-lg p-2.5 px-4 w-40">
			<span className="text-linen-200 text-sm truncate">{auth.user?.fullName ?? ''}</span>
			<span className="text-granite-100 text-xs truncate">
				{auth.user.primaryEmailAddress?.emailAddress ?? ''}
			</span>
		</div>
	)
}
