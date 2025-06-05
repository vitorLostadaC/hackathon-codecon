import { BrowserWindow, screen } from 'electron'
import { join } from 'node:path'

export function configureInvisibleOverlayWindow(): BrowserWindow {
	const primaryDisplay = screen.getPrimaryDisplay()
	const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize
	const workArea = primaryDisplay.workArea

	// Determine window type based on platform
	const windowType = (): 'toolbar' | 'desktop' | 'dock' => {
		switch (process.platform) {
			case 'win32':
				return 'toolbar'
			case 'linux':
				return 'dock' // Use dock type for Linux to avoid desktop type issues
			default:
				return 'desktop'
		}
	}

	const mainWindow = new BrowserWindow({
		width: screenWidth,
		height: screenHeight,
		x: workArea.x,
		y: workArea.y,
		frame: false,
		transparent: true,
		alwaysOnTop: true,
		skipTaskbar: true,
		focusable: false,
		resizable: false,
		movable: false,
		minimizable: false,
		maximizable: false,
		hasShadow: false,
		show: false,
		type: windowType(),
		webPreferences: {
			preload: join(__dirname, '../../preload/index.js'),
			sandbox: false,
			nodeIntegration: false,
			contextIsolation: true,
			backgroundThrottling: false
		}
	})

	// Extra runtime guarantees
	mainWindow.setSkipTaskbar(true)
	mainWindow.setFocusable(false)
	mainWindow.setIgnoreMouseEvents(true, { forward: true })

	// Platform-specific z-index handling
	const setAlwaysOnTopByPlatform = (): void => {
		if (process.platform === 'darwin') {
			mainWindow.setAlwaysOnTop(true, 'floating', 1)
		} else {
			mainWindow.setAlwaysOnTop(true, 'screen-saver', 1)
		}
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
		setAlwaysOnTopByPlatform()
	})

	return mainWindow
}
