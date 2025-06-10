import z from 'zod'
import { Button } from '~/src/renderer/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'

interface PixDialogProps {
	children: React.ReactNode
}

const formSchema = z.object({
	name: z.string(),
	cpf: z.string(),
	phone: z.string(),
	cpfCnpj: z
		.string({
			required_error: 'CPF é obrigatório.'
		})
		.refine((doc) => {
			const replacedDoc = doc.replace(/\D/g, '')
			return replacedDoc.length >= 11
		}, 'CPF deve conter no mínimo 11 caracteres.')
		.refine((doc) => {
			const replacedDoc = doc.replace(/\D/g, '')
			return !!Number(replacedDoc)
		}, 'CPF deve conter apenas números.')
})

export function PixDialog({ children }: PixDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Pagamento via PIX</DialogTitle>
				</DialogHeader>
				<div className="flex items-center gap-2">
					<div className="grid flex-1 gap-2">
						<label htmlFor="link" className="sr-only">
							Link
						</label>
						<Input id="link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />
					</div>
				</div>
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
