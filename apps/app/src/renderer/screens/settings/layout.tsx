import { cn } from '@renderer/lib/utils'
import type React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/sidebar'

export function Layout(): React.JSX.Element {
	const isMacOS = process.platform === 'darwin'

	return (
		<div className="flex h-screen bg-gray-950 relative">
			<div className={cn('h-8 w-full absolute region-drag', !isMacOS && 'hidden')} />
			<Sidebar />
			<div className="w-px bg-gray-800 h-screen" />
			<div className={cn('flex-1 m-6', isMacOS && '')}>
				<Outlet />
			</div>
		</div>
	)
}
