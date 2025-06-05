import { Settings } from 'lucide-react'
import type React from 'react'

interface CSSProperties extends React.CSSProperties {
	WebkitAppRegion?: 'drag' | 'no-drag'
}

export function GearIcon(): React.JSX.Element {
	const handleClick = (): void => {
		window.api.openSettings()
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center bg-red-500"
			style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
		>
			<Settings className="w-6 h-6 text-gray-700" />
		</button>
	)
}
