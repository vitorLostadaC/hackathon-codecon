import { cn } from '@renderer/lib/utils'
import type React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/sidebar'

export function Layout(): React.JSX.Element {
	const isMacOS = process.platform === 'darwin'

	return (
		<div className="flex h-screen bg-background-primary relative">
			<div className={cn('h-8 w-full absolute region-drag', !isMacOS && 'hidden')} />
			<Sidebar />
			<div className="w-0.5 bg-background-secondary h-screen" />
			<div className="flex-1 mx-4 my-4">
				<Outlet />
			</div>
		</div>
	)
}
