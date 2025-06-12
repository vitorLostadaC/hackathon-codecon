import { useUser } from '@clerk/clerk-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Feedback, ratingSchema } from '@repo/api-types/feedback.schema'
import { useMutation } from '@tanstack/react-query'
import {
	Angry,
	Frown,
	Loader2,
	type LucideIcon,
	MessageCircleIcon,
	Smile,
	SmilePlus
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Popover, PopoverContent, PopoverTrigger } from '~/src/renderer/components/ui/popover'
import { Button } from '../../../components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../../../components/ui/form'
import { Label } from '../../../components/ui/label'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group'
import { Textarea } from '../../../components/ui/textarea'
import { cn } from '../../../lib/utils'
import { createFeedback } from '../../../requests/feedback/create-feedback'

const rating: {
	rating: Feedback['rating']
	icon: LucideIcon
}[] = [
	{
		rating: 'terrible',
		icon: Angry
	},
	{
		rating: 'bad',
		icon: Frown
	},
	{
		rating: 'good',
		icon: Smile
	},
	{
		rating: 'excellent',
		icon: SmilePlus
	}
] as const

const formSchema = z.object({
	feedback: z.string().min(3, {
		message: 'sua mensagem deve conter pelo menos 3 caracteres'
	}),
	rating: ratingSchema
})

type FormSchema = z.infer<typeof formSchema>

export function SidebarFeedback() {
	const [open, setOpen] = useState(false)
	const { user } = useUser()

	const [loading, setLoading] = useState(false)

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			feedback: localStorage.getItem('feedback') || ''
		}
	})

	const { mutateAsync: sendFeedbackAsync } = useMutation({
		mutationKey: ['send-feedback'],
		mutationFn: async (data: FormSchema) =>
			await createFeedback({
				userId: user?.id || '',
				message: data.feedback,
				rating: data.rating
			})
	})

	const handleSubmit = form.handleSubmit(async (data) => {
		setLoading(true)
		try {
			await sendFeedbackAsync(data)
			localStorage.removeItem('feedback')
			form.reset({
				feedback: ''
			})
			toast.success('Mais um trouxa achando que eu vou ler com sucesso')
			setOpen(false)
		} catch {
			toast.error('Eita, fudeu tudo aqui. Tenta mais tarde que o dev é lento...')
		} finally {
			setLoading(false)
		}
	})

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<Button
					variant="ghost"
					className="flex gap-2 items-center text-gray-500 pl-2 justify-start w-full"
				>
					<MessageCircleIcon className="size-4" />
					Feedback
				</Button>
			</PopoverTrigger>
			<PopoverContent side="right">
				<Form {...form}>
					<form
						onSubmit={handleSubmit}
						className="bg-background w-full max-w-96 rounded md:max-w-80"
					>
						<FormField
							control={form.control}
							name="feedback"
							render={({ field }) => (
								<FormItem>
									<FormLabel />
									<FormControl>
										<Textarea
											{...field}
											onChange={(e) => {
												localStorage.setItem('feedback', e.target.value)
												field.onChange(e.target.value)
											}}
											className="min-h-24 resize-none"
											placeholder="Que app merda..."
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>

						<footer className="mt-4 flex items-center justify-between">
							<div className="flex gap-2">
								<FormField
									control={form.control}
									name="rating"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<RadioGroup onValueChange={field.onChange} className="flex gap-2">
													{rating.map(({ icon: Icon, rating }) => (
														<FormItem key={rating}>
															<FormControl>
																<RadioGroupItem value={rating} id={rating} className="sr-only" />
															</FormControl>
															<Label htmlFor={rating} className="cursor-pointer">
																<Icon
																	strokeWidth={1.5}
																	className={cn(
																		'stroke-gray-500 size-5',
																		field.value === rating && 'stroke-tangerine-500'
																	)}
																/>
															</Label>
														</FormItem>
													))}
												</RadioGroup>
											</FormControl>
											<FormDescription />
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button type="submit" disabled={loading || !form.formState.isValid} className="w-20">
								{loading ? <Loader2 className="size-4 animate-spin" /> : 'Enviar'}
							</Button>
						</footer>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	)
}
