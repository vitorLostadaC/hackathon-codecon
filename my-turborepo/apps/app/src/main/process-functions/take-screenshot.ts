import { desktopCapturer, screen } from 'electron'

// Screenshot handler function using Electron's desktopCapturer
export async function takeScreenshot(): Promise<string> {
	try {
		// Get all screens/sources
		const sources = await desktopCapturer.getSources({
			types: ['screen'],
			thumbnailSize: {
				width: screen.getPrimaryDisplay().workAreaSize.width,
				height: screen.getPrimaryDisplay().workAreaSize.height
			}
		})

		if (sources.length === 0) {
			throw new Error('No screen sources found')
		}

		// Get the primary display (or first available)
		const primarySource = sources[0]

		// Get the thumbnail as base64
		const thumbnail = primarySource.thumbnail.toDataURL()
		return thumbnail
	} catch (err) {
		console.error('Error taking screenshot:', err)
		throw err
	}
}
