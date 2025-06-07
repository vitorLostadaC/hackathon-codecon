import { cn } from '@renderer/lib/utils'
import type React from 'react'
import { useConfig } from './hooks/use-config'

export function AppearancePage(): React.JSX.Element {
	const { configs, updateConfig } = useConfig()

	if (!configs) return <>test</>

	const themes = [
		{ slug: 'theme1', preview: 'theme1.png' },
		{ slug: 'theme2', preview: 'theme2.png' },
		{ slug: 'theme3', preview: 'theme3.png' }
	]

	const handleThemeChange = (slug: string) => {
		updateConfig({ appearance: { ...configs.appearance, selectedPet: slug } })
	}

	return (
		<div className="flex flex-col items-end h-full">
			<div className="w-full flex-1 space-y-8">
				<h2 className="text-linen-200 text-base">Aparencia</h2>
				<div className="flex gap-9">
					{themes.map((theme) => (
						<div
							key={theme.slug}
							className="w-[109px] h-[102px] flex items-center justify-center rounded-md bg-gradient-to-t from-accent-from to-accent-to"
						>
							<div
								className={cn(
									'bg-granite-950 rounded-md w-full h-full',
									configs.appearance.selectedPet === theme.slug && 'w-[105px] h-[98px]'
								)}
							>
								<button
									type="button"
									onClick={() => handleThemeChange(theme.slug)}
									className="w-full h-full rounded-md bg-[#D9D9D9]/50 "
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
