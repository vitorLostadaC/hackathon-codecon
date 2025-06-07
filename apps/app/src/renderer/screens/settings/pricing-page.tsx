import { cn } from '@renderer/lib/utils'
import type { Container, Engine } from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion, useAnimation } from 'framer-motion'
import { HandCoins, Mail } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useId, useState } from 'react'
import { Button } from './components/button'

interface PricingPlan {
	id: number
	name: string
	price: string
	credits: number
	features: string[]
	isHighlighted?: boolean
}

export function PricingPage(): React.JSX.Element {
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
										id={`particles-${generatedId}-${plan.id}`}
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
								{plan.price}
							</span>
							<div className="flex justify-between">
								<div className="flex items-center gap-1.5 text-secondary">
									<HandCoins size={16} />
									<span className="text-sm">{plan.credits} créditos</span>
								</div>
								{plan.features.map((feature, index) => (
									<div
										key={`${feature}-${index}`}
										className="flex items-center text-secondary gap-1.5"
									>
										<Mail size={16} />
										<span className="text-sm">{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>
					<Button
						variant={plan.isHighlighted ? 'primary' : 'secondary'}
						onClick={() => {}}
						className="mt-7 w-full"
					>
						Escolher
					</Button>
				</div>
			))}
		</div>
	)
}
