import { cn } from '@renderer/lib/utils'
import { HandCoins, Mail } from 'lucide-react'
import type React from 'react'
import { Button } from '../components/Button'

interface PricingPlan {
	id: number
	name: string
	price: string
	credits: number
	features: string[]
	isHighlighted?: boolean
}

interface PricingTabProps {
	selectedPlan: number
	onPlanSelect: (planId: number) => void
}

export function PricingTab({ selectedPlan, onPlanSelect }: PricingTabProps): React.JSX.Element {
	console.log(selectedPlan)
	const plans: PricingPlan[] = [
		{
			id: 1,
			name: 'Basic',
			price: 'R$ 9,90',
			credits: 50,
			features: []
		},
		{
			id: 2,
			name: 'Premium',
			price: 'R$ 9,90',
			credits: 50,
			features: [],
			isHighlighted: true
		},
		{
			id: 4,
			name: 'Basic',
			price: 'R$ 9,90',
			credits: 50,
			features: []
		},
		{
			id: 3,
			name: 'Ultra master premium',
			price: 'R$ 149,90',
			credits: 50,
			features: ['Email customizado com chuva de ofensas']
		}
	]

	return (
		<div className="flex gap-3 flex-wrap mx-4">
			{plans.map((plan) => (
				<div
					key={plan.id}
					className={cn(
						'flex-1 min-w-[159px] p-4 px-[14px] rounded-lg border relative overflow-hidden',
						plan.isHighlighted ? 'border-border-primary' : 'border-border-secondary'
					)}
				>
					{plan.isHighlighted && (
						<>
							<div className="absolute -top-3 left-0.5 w-[17px] h-[37px] rotate-[-47deg] bg-accent-tertiary opacity-95 blur-[6.7px]" />
							<div className="absolute -top-5 left-4 w-[17px] h-[86px] rotate-[-47deg] bg-accent-tertiary blur-[16px]" />
						</>
					)}
					<div className="space-y-[22px]">
						<h3 className="text-primary leading-[1.0] text-xl">{plan.name}</h3>
						<div className="space-y-5">
							<span className="text-primary text-2xl leading-[1.0] font-semibold block">
								{plan.price}
							</span>
							<div className="flex justify-between">
								<div className="flex items-center gap-1.5 text-secondary">
									<HandCoins size={16} />
									<span className="text-sm">{plan.credits} créditos</span>
								</div>
								{plan.features.map((feature, index) => (
									<div key={index} className="flex items-center text-secondary gap-1.5">
										<Mail size={16} />
										<span className="text-sm">{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>
					<Button
						variant={plan.isHighlighted ? 'primary' : 'secondary'}
						onClick={() => onPlanSelect(plan.id)}
						fullWidth
						className="mt-7"
					>
						Escolher
					</Button>
				</div>
			))}
		</div>
	)
}
