import type React from 'react'
import { Button } from '../components/Button'

interface AppearanceTabProps {
	selectedTheme: number
	onThemeChange: (themeIndex: number) => void
}

export function AppearanceTab({
	selectedTheme,
	onThemeChange
}: AppearanceTabProps): React.JSX.Element {
	const themes = [
		{ id: 1, preview: 'theme1.png' },
		{ id: 2, preview: 'theme2.png' },
		{ id: 3, preview: 'theme3.png' }
	]

	return (
		<div className="flex flex-col mx-8 pt-6 pb-[9px] items-end h-full">
			<div className="w-full flex-1 space-y-8">
				<h2 className="text-primary text-lg">Aparencia</h2>
				<div className="flex gap-9">
					{themes.map((theme) => (
						<button
							key={theme.id}
							onClick={() => onThemeChange(theme.id)}
							className={`w-[109px] h-[102px] rounded-md border ${
								selectedTheme === theme.id ? 'border-border-primary' : 'border-border-secondary'
							} bg-[#D9D9D9] transition-colors hover:border-border-primary`}
						/>
					))}
				</div>
			</div>
			<Button>Escolher</Button>
		</div>
	)
}
