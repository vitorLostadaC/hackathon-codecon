import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs))
}

// TODO: move this to a shared package
export async function catchError<T, E = Error>(
	promise: Promise<T>
): Promise<[E, undefined] | [undefined, T]> {
	try {
		const data = await promise
		return [undefined, data]
	} catch (error) {
		return [error as E, undefined]
	}
}
