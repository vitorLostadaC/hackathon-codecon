import { catchError } from '@renderer/lib/utils'

export const getScreenContextReply = async () => {
	const [base64ImageError, base64Image] = await catchError(window.api.takeScreenshot())

	if (base64ImageError) {
		console.error('Error taking screenshot:', base64ImageError)
		return null
	}

	const response = await fetch('http://localhost:3333/curse/screenshot', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			imageBase64: base64Image,
			config: {
				safeMode: false
			}
		})
	})

	return response.json()
}
