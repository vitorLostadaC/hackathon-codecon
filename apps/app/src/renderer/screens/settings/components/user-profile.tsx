import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { CoinsIcon, LogOutIcon } from 'lucide-react'
import { Button } from '~/src/renderer/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/src/renderer/components/ui/dropdown-menu'
import { getUserOptions } from '~/src/renderer/requests/user/config'

export function UserProfile() {
	const auth = useUser()

	const { data } = useQuery(getUserOptions(auth.user?.id ?? ''))

	if (!auth.isLoaded) return null

	if (!auth.isSignedIn)
		return (
			<SignInButton mode="modal" signUpForceRedirectUrl="/#/settings">
				<Button className="w-full">Login</Button>
			</SignInButton>
		)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex flex-col gap-4">
					<div className="text-sm flex gap-2 items-center">
						<CoinsIcon className="size-4" />
						{data?.credits}
					</div>
					<div className="flex flex-col w-40 gap-0.5 bg-granite-900 border border-smoke-700 rounded-lg p-2.5 px-4 select-none cursor-pointer">
						<span className="text-linen-200 text-sm truncate">{auth.user?.fullName ?? ''}</span>
						<span className="text-granite-100 text-xs truncate">
							{auth.user.primaryEmailAddress?.emailAddress ?? ''}
						</span>
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>
					{auth.user?.firstName ?? ''} {auth.user?.lastName ?? ''}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild className="w-full">
					<SignOutButton redirectUrl="/#/settings">
						<div className="flex items-center gap-2">
							<LogOutIcon className="size-4" /> Sair
						</div>
					</SignOutButton>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
