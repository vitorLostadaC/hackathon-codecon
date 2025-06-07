import path, { join } from 'node:path'
import { BrowserWindow, screen } from 'electron'

import { registerRoute } from '../shared/lib/electron-router-dom'

type Route = Parameters<typeof registerRoute>[0]

interface WindowProps extends Electron.BrowserWindowConstructorOptions {
	id: Route['id']
	query?: Route['query']
}

export function createWindow({ id, query, ...options }: WindowProps) {
	const window = new BrowserWindow({
		width: 600,
		height: 250,
		show: false,
		resizable: false,
		alwaysOnTop: true,

		webPreferences: {
			preload: path.join(__dirname, '../preload/index.js'),
			contextIsolation: true
		},

		...options
	})

	registerRoute({
		id,
		query,
		browserWindow: window,
		htmlFile: path.join(__dirname, '../renderer/index.html')
	})

	window.on('ready-to-show', () => {
		window.show()
	})

	return window
}

export function createMainWindow() {
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

	const mainWindow = createWindow({
		id: 'main',
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
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			nodeIntegration: false,
			contextIsolation: true,
			backgroundThrottling: false
		}
	})

	mainWindow.setIgnoreMouseEvents(true, { forward: true })

	mainWindow.on('closed', () => {
		for (const browserWindow of BrowserWindow.getAllWindows()) {
			browserWindow.close()
		}
	})
}
