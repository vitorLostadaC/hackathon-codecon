import { useUser } from '@clerk/clerk-react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PaymentPlan, PaymentResponse } from '@repo/api-types/payment.dto'
import { useMutation } from '@tanstack/react-query'
import { cpf } from 'cpf-cnpj-validator'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { maskCpf } from '~/src/renderer/components/masks/cpf'
import { maskPhone } from '~/src/renderer/components/masks/phone'
import { Button } from '~/src/renderer/components/ui/button'
import { DialogFooter } from '~/src/renderer/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '~/src/renderer/components/ui/form'
import { Input } from '~/src/renderer/components/ui/input'
import { createPixPayment } from '~/src/renderer/requests/payments/create-pix-payment'

type PixQrCodeFormProps = {
	plan: PaymentPlan
	defaultValues?: PixFormValues
	setPixPayment: (pixPayment: PaymentResponse) => void
}

const formSchema = z.object({
	name: z.string().min(3, 'Mínimo 3 caracteres.').max(100, 'Máximo 100 caracteres.'),
	cpf: z
		.string()
		.min(14, 'Mínimo 14 caracteres.')
		.max(14, 'Máximo 14 caracteres.')
		.refine((value) => cpf.isValid(value), {
			message: 'CPF inválido.'
		}),
	phone: z.string().min(15, 'Mínimo 15 caracteres.').max(15, 'Máximo 15 caracteres.')
})

export type PixFormValues = z.infer<typeof formSchema>

export const PixQrCodeForm = ({ plan, defaultValues, setPixPayment }: PixQrCodeFormProps) => {
	const { user } = useUser()
	const form = useForm<PixFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues
	})

	const { mutateAsync: createPixPaymentMutation, isPending } = useMutation({
		mutationKey: ['create-pix-payment'],
		mutationFn: createPixPayment
	})

	useEffect(() => {
		if (defaultValues) {
			form.reset(defaultValues)
		}
	}, [defaultValues, form])

	async function onSubmit(values: PixFormValues) {
		if (!user) return

		const response = await createPixPaymentMutation({
			plan,
			userId: user?.id,
			email: user.emailAddresses[0]?.emailAddress ?? 'example@example.com',
			document: values.cpf,
			...values
		})

		setPixPayment(response)
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-5">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="col-span-2">
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Vitor Lostada da Cunha" maxLength={100} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="cpf"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CPF</FormLabel>
							<FormControl>
								<Input
									placeholder="000.000.000-00"
									maxLength={14}
									{...field}
									onChange={(e) => field.onChange(maskCpf(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Telefone</FormLabel>
							<FormControl>
								<Input
									placeholder="(00) 00000-0000"
									{...field}
									onChange={(e) => field.onChange(maskPhone(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter className="col-span-2">
					<Button type="submit" variant="default" className="w-full mt-2" disabled={isPending}>
						<AnimatePresence initial={false} mode="popLayout">
							<motion.span
								key={isPending ? 'loading' : 'default'}
								initial={{
									y: -25,
									opacity: 0
								}}
								animate={{
									y: 0,
									opacity: 1,
									transition: { bounce: 0, type: 'spring', duration: 0.3 }
								}}
								exit={{ y: 25, opacity: 0 }}
							>
								{isPending && <Loader2 className="size-4 animate-spin text-tangerine-950" />}
								{!isPending && 'Gerar QR Code'}
							</motion.span>
						</AnimatePresence>
					</Button>
				</DialogFooter>
			</form>
		</Form>
	)
}
