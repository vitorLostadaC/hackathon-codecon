import { cn } from '@renderer/lib/utils'
import { plans as ApiPlans, type PaymentPlan } from '@repo/api-types/payment.dto'

import { useClerk, useUser } from '@clerk/clerk-react'
import { HandCoins, InfoIcon, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip'
import { PixDialog } from './components/pix-dialog'
import type { PixFormValues } from './components/pix-dialog/pix-form'
import { PricingParticle } from './components/pricing-particle'

interface PricingPlan {
	slug: PaymentPlan
	name: string
	hoverText: string
	price: number
	credits: number
	features: string[]
	isHighlighted: boolean
}

const planExtensions: Record<
	PaymentPlan,
	Pick<PricingPlan, 'features' | 'isHighlighted' | 'hoverText'>
> = {
	basic: {
		features: [],
		isHighlighted: false,
		hoverText: 'Mão de vaca'
	},
	premium: {
		features: [],
		isHighlighted: true,
		hoverText: 'Só isso?'
	},
	'ultra-premium': {
		features: [],
		isHighlighted: false,
		hoverText: 'Rico metido'
	},
	'ultra-master-premium': {
		features: ['Email customizado com chuva de ofensas'],
		isHighlighted: false,
		hoverText: 'Tem certeza que vais comprar essa merd...?'
	}
}

const plans: PricingPlan[] = Object.entries(ApiPlans).map(([slug, plan]) => {
	const extension = planExtensions[slug as PaymentPlan]

	return {
		slug: slug as PaymentPlan,
		name: plan.name,
		price: plan.price,
		credits: plan.credits,
		features: extension.features,
		isHighlighted: extension.isHighlighted,
		hoverText: extension.hoverText
	}
})

export function PricingPage() {
	const auth = useUser()
	const clerk = useClerk()
	const [modalOpen, setModalOpen] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>()

	const [modalDefaultValues, setModalDefaultValues] = useState<PixFormValues>()

	useEffect(() => {
		if (!auth.isLoaded || !auth.isSignedIn) return

		const { user } = auth

		setModalDefaultValues({
			name: user.fullName ?? '',
			cpf: '',
			phone: user.primaryPhoneNumber?.phoneNumber ?? ''
		})
	}, [auth.isLoaded])

	const handlePlanClick = (plan: PaymentPlan) => {
		if (!auth.isSignedIn) {
			clerk.openSignIn()
			return
		}
		setSelectedPlan(plan)
		setModalOpen(true)
	}

	return (
		<div className="grid grid-cols-3 gap-3">
			<PixDialog
				open={modalOpen}
				onOpenChange={setModalOpen}
				plan={selectedPlan ?? 'basic'}
				defaultValues={modalDefaultValues}
			/>
			{plans.map((plan) => (
				<div
					key={plan.slug}
					className={cn(
						'p-3 rounded-lg border relative overflow-hidden',
						plan.isHighlighted ? 'border-tangerine-200' : 'border-gray-800',
						plan.slug === 'ultra-master-premium' && 'col-span-3'
					)}
				>
					{plan.isHighlighted && <PricingParticle />}
					<div className="space-y-6">
						<h3 className="font-light text-xl">{plan.name}</h3>
						<div className="space-y-5">
							<span className="text-2xl font-medium">
								R$ {plan.price.toFixed(2).replace('.', ',')}
							</span>
							<div
								className={cn(
									'flex justify-between',
									plan.slug !== 'ultra-master-premium' && 'flex-col gap-2'
								)}
							>
								<div className="flex items-center gap-1.5 text-gray-400">
									<HandCoins size={16} />
									<span className="text-sm">{plan.credits} créditos</span>{' '}
									<Tooltip>
										<TooltipTrigger>
											<InfoIcon className="size-4 mb-2" />
										</TooltipTrigger>
										<TooltipContent className="">
											<p>
												Aproximadamente {(plan.credits / 60).toFixed(2).replace('.', ',')} horas de
												xingamentos seguidos
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
								{plan.features.map((feature, index) => (
									<div
										key={`${feature}-${index}`}
										className="flex items-center text-gray-400 gap-1.5"
									>
										<Mail size={16} />
										<span className="text-sm">{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<Button
						variant={plan.isHighlighted ? 'default' : 'secondary'}
						className="mt-7 w-full group"
						onClick={() => handlePlanClick(plan.slug)}
					>
						<div className="relative overflow-hidden w-full text-center">
							<span className="invisible">Escolher</span>
							<span className="group-hover:-translate-y-full absolute top-0 left-1/2 -translate-x-1/2 transition-transform duration-300 ease-in-out hover:duration-300">
								Escolher
							</span>
							<span className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-full transition-transform duration-300 ease-in-out hover:duration-300 group-hover:translate-y-0">
								{plan.hoverText}
							</span>
						</div>
					</Button>
				</div>
			))}
		</div>
	)
}
