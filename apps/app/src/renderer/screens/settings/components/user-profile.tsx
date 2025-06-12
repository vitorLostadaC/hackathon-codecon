import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { CoinsIcon, LogOutIcon, MessageCircleIcon } from 'lucide-react'
import { Button } from '~/src/renderer/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/src/renderer/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '~/src/renderer/components/ui/popover'
import { getUserOptions } from '~/src/renderer/requests/user/config'
import { FeedbackForm } from './sidebar-feedback'

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
		<div className="flex flex-col gap-2">
			<Popover>
				<PopoverTrigger>
					<Button
						variant="ghost"
						className="flex gap-2 items-center text-gray-500 pl-2 justify-start w-full"
					>
						<MessageCircleIcon className="size-4" />
						Feedback
					</Button>
				</PopoverTrigger>
				<PopoverContent side="right">
					<FeedbackForm />
				</PopoverContent>
			</Popover>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex flex-col w-40 gap-0.5 bg-gray-900 rounded-lg p-2.5 px-4 select-none cursor-pointer">
						<div className="flex justify-between items-center">
							<span className="text-sm truncate">{auth.user?.fullName ?? ''}</span>
							<div className="text-sm flex gap-1 items-center">
								<CoinsIcon className="size-4" />
								{data?.credits}
							</div>
						</div>
						<span className="text-gray-300 text-xs truncate">
							{auth.user.primaryEmailAddress?.emailAddress ?? ''}
						</span>
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
		</div>
	)
}
