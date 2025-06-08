import { cn } from '@renderer/lib/utils'
import { plans as ApiPlans, type PaymentPlan } from '@repo/api-types/payment.dto'
import type { Container, Engine } from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion, useAnimation } from 'framer-motion'
import { HandCoins, Mail } from 'lucide-react'
import { useCallback, useEffect, useId, useState } from 'react'
import { Button } from '../../components/ui/button'

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
	const [init, setInit] = useState(false)
	const controls = useAnimation()
	const generatedId = useId()

	useEffect(() => {
		initParticlesEngine(async (engine: Engine) => {
			await loadSlim(engine)
			setInit(true)
		})
	}, [])

	const particlesLoaded = useCallback(
		async (container?: Container) => {
			if (container) {
				controls.start({
					opacity: 1,
					transition: {
						duration: 1
					}
				})
			}
		},
		[controls]
	)

	return (
		<div className="flex gap-3 flex-wrap">
			{plans.map((plan) => (
				<div
					key={plan.slug}
					className={cn(
						'flex-1 min-w-[159px] p-4 px-[14px] rounded-lg border relative overflow-hidden',
						plan.isHighlighted ? 'border-tangerine-200' : 'border-granite-500'
					)}
				>
					{plan.isHighlighted && (
						<>
							<motion.div
								animate={controls}
								className="absolute inset-0 opacity-0 w-[60%] h-[45%] rounded-full"
								style={{
									maskImage:
										'linear-gradient(to bottom, #000, transparent), linear-gradient(to right, #000, transparent)',
									WebkitMaskImage:
										'linear-gradient(to bottom, #000, transparent), linear-gradient(to right, #000, transparent)'
								}}
							>
								{init && (
									<Particles
										id={`particles-${generatedId}-${plan.slug}`}
										className="h-full w-full"
										particlesLoaded={particlesLoaded}
										options={{
											background: {
												color: {
													value: 'transparent'
												}
											},
											fullScreen: {
												enable: false,
												zIndex: 1
											},
											fpsLimit: 120,
											particles: {
												color: {
													value: '#FDA830'
												},
												bounce: {
													horizontal: {
														value: 1
													},
													vertical: {
														value: 1
													}
												},
												move: {
													enable: true,
													direction: 'bottom-right',
													speed: { min: 0.1, max: 0.5 },
													straight: false
												},
												number: {
													density: {
														enable: true,
														width: 200,
														height: 200
													},
													value: 60
												},
												opacity: {
													value: {
														min: 0.1,
														max: 0.4
													},
													animation: {
														enable: true,
														speed: 2,
														sync: false,
														startValue: 'random'
													}
												},
												shape: {
													type: 'circle'
												},
												size: {
													value: {
														min: 1,
														max: 2
													}
												},
												source: {
													position: {
														x: 0,
														y: 0
													},
													size: {
														width: 30,
														height: 30
													}
												}
											},
											detectRetina: true
										}}
									/>
								)}
							</motion.div>
							<motion.div
								className="absolute -top-3 left-0.5 w-[17px] h-[37px] bg-accent-tertiary opacity-95 blur-[6.7px]"
								initial={{ opacity: 0, scale: 0.5, rotate: -47 }}
								animate={{ opacity: 1, scale: 1, rotate: -47 }}
								transition={{ duration: 0.5, ease: 'easeOut' }}
							/>
							<motion.div
								className="absolute -top-5 left-4 w-[17px] h-[80px] bg-accent-tertiary blur-[16px]"
								initial={{ opacity: 0, scale: 0.5, rotate: -47 }}
								animate={{ opacity: 1, scale: 1, rotate: -47 }}
								transition={{ duration: 0.5, ease: 'easeOut' }}
							/>
						</>
					)}
					<div className="space-y-[22px]">
						<h3 className="text-linen-200 leading-[1.0] text-xl">{plan.name}</h3>
						<div className="space-y-5">
							<span className="text-linen-200 text-2xl leading-[1.0] font-semibold block">
								R$ {plan.price.toFixed(2).replace('.', ',')}
							</span>
							<div className="flex justify-between">
								<div className="flex items-center gap-1.5 text-linen-400">
									<HandCoins size={16} />
									<span className="text-sm">{plan.credits} créditos</span>
								</div>
								{plan.features.map((feature, index) => (
									<div
										key={`${feature}-${index}`}
										className="flex items-center text-linen-400 gap-1.5"
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
						onClick={() => {}}
						className="mt-7 w-full group"
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
