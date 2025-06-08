import { cn } from '@renderer/lib/utils'
import type { PetType } from '~/src/shared/types/configs'
import { useConfig } from './hooks/use-config'

import duck from '@renderer/assets/animals/duck/duck-walking.gif'

export function AppearancePage() {
	const { configs, updateConfig } = useConfig()

	if (!configs) return null

	const skins: { slug: PetType; preview: string }[] = [
		{ slug: 'duck', preview: duck },
		{ slug: 'capybara', preview: duck },
		{ slug: 'codecon', preview: duck }
	]

	const handleChangeSkin = (slug: PetType) => {
		updateConfig({ appearance: { ...configs.appearance, selectedPet: slug } })
	}

	return (
		<div className="w-full flex-1 space-y-8">
			<h2 className="text-linen-200">Aparência</h2>
			<div className="grid grid-cols-4 gap-8">
				{skins.map((skin) => {
					const isSelected = configs.appearance.selectedPet === skin.slug

					return (
						<label
							key={skin.slug}
							style={
								{
									'--padding': '0.125rem',
									'--border-radius': '0.375rem'
								} as React.CSSProperties
							}
							className={cn(
								'flex items-center justify-center aspect-square cursor-pointer',
								'rounded-[var(--border-radius)] bg-gradient-to-t bg-[length:400%_400%] p-[var(--padding)]',
								'focus-visible:ring-ring/50 focus-visible:ring-[3px] animate-animated-border',
								isSelected
									? 'from-tangerine-500 to-tangerine-400'
									: 'hover:from-granite-500 hover:to-granite-100'
							)}
						>
							<input
								type="radio"
								name="pet-skin"
								value={skin.slug}
								checked={isSelected}
								onChange={() => handleChangeSkin(skin.slug)}
								className="sr-only"
								aria-label={`Tema ${skin.slug}`}
							/>
							<div
								className={cn(
									'bg-granite-950 rounded-[calc(var(--border-radius)-var(--padding))] w-full h-full'
								)}
							>
								<img
									src={skin.preview}
									alt={`Prévia do tema ${skin.slug}`}
									className="w-full h-full"
								/>
							</div>
						</label>
					)
				})}
			</div>
		</div>
	)
}
