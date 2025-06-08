import { useUser } from '@clerk/clerk-react'
import { cn } from '@renderer/lib/utils'
import { useQuery } from '@tanstack/react-query'
import type React from 'react'
import { Outlet } from 'react-router-dom'
import { getUserOptions } from '../../requests/user/config'
import { Sidebar } from './components/sidebar'

export function Layout(): React.JSX.Element {
	const isMacOS = process.platform === 'darwin'

	const response = useUser()

	const data = useQuery(getUserOptions(response.user?.id ?? ''))

	console.log(data.error)

	console.log(data.data)
	return (
		<div className="flex h-screen bg-granite-950 relative">
			<div className={cn('h-8 w-full absolute region-drag', !isMacOS && 'hidden')} />
			<Sidebar />
			<div className="w-0.5 bg-granite-900 h-screen" />
			<div className={cn('flex-1 m-6', isMacOS && '')}>
				<Outlet />
			</div>
		</div>
	)
}
