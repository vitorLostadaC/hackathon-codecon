import { zodResolver } from '@hookform/resolvers/zod'
import type { PaymentPlan } from '@repo/api-types/payment.dto'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { maskCpf } from '~/src/renderer/components/masks/cpf'
import { maskPhone } from '~/src/renderer/components/masks/phone'
import { Button } from '~/src/renderer/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '~/src/renderer/components/ui/form'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'

interface PixDialogProps {
	plan: PaymentPlan
	defaultValues?: PixFormValues
	open: boolean
	onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
	name: z.string().min(3, 'Mínimo 3 caracteres.').max(100, 'Máximo 100 caracteres.'),
	cpf: z.string().min(14, 'Mínimo 14 caracteres.').max(14, 'Máximo 14 caracteres.'),
	phone: z.string().min(15, 'Mínimo 15 caracteres.').max(15, 'Máximo 15 caracteres.')
})

export type PixFormValues = z.infer<typeof formSchema>

export function PixDialog({ defaultValues, open, onOpenChange, plan }: PixDialogProps) {
	const form = useForm<PixFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues
	})

	function onSubmit(values: PixFormValues) {
		// handle form submission here
		console.log(values)
	}

	useEffect(() => {
		if (defaultValues) {
			form.reset(defaultValues)
		}
	}, [defaultValues, form])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Pagamento via PIX - {plan}</DialogTitle>
				</DialogHeader>
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
							<Button type="submit" variant="default" className="w-full mt-2">
								Gerar QR Code
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
