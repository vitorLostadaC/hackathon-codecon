import { cn } from '@renderer/lib/utils'
import { useConfig } from './hooks/use-config'

import { type PetType, pets } from '../pet/constants/pet'

export function AppearancePage() {
	const { configs, updateConfig } = useConfig()

	if (!configs) return null

	const handleChangeSkin = (slug: PetType) => {
		updateConfig({ appearance: { ...configs.appearance, selectedPet: slug } })
	}

	return (
		<div className="w-full flex-1 space-y-8">
			<h2 className="">Aparência</h2>
			<div className="grid grid-cols-4 gap-8">
				{Object.entries(pets).map(([slug, preview]) => {
					const isSelected = configs.appearance.selectedPet === slug

					return (
						<label
							key={slug}
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
									: 'hover:from-gray-700 hover:to-gray-800'
							)}
						>
							<input
								type="radio"
								name="pet-skin"
								value={slug}
								checked={isSelected}
								onChange={() => handleChangeSkin(slug as PetType)}
								className="sr-only"
								aria-label={`Tema ${slug}`}
							/>
							<div
								className={cn(
									'bg-gray-950 rounded-[calc(var(--border-radius)-var(--padding))] w-full h-full'
								)}
							>
								<img
									src={preview.walking}
									alt={`Prévia do tema ${slug}`}
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
