import type { Container, Engine } from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion, useAnimation } from 'framer-motion'
import { useCallback, useEffect, useId, useState } from 'react'

export const PricingParticle = () => {
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
						id={`particles-${generatedId}`}
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
				className="absolute -top-3 left-0.5 w-[17px] h-[37px] bg-tangerine-300 opacity-95 blur-[6.7px]"
				initial={{ opacity: 0, scale: 0.5, rotate: -47 }}
				animate={{ opacity: 1, scale: 1, rotate: -47 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			/>
			<motion.div
				className="absolute -top-5 left-4 w-[17px] h-[80px] bg-tangerine-300 blur-[16px]"
				initial={{ opacity: 0, scale: 0.5, rotate: -47 }}
				animate={{ opacity: 1, scale: 1, rotate: -47 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			/>
		</>
	)
}
