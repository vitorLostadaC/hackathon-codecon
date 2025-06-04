import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'

let settingsWindow: BrowserWindow | null = null

export function createSettingsWindow(): void {
	// If window exists, just focus it
	if (settingsWindow) {
		if (settingsWindow.isMinimized()) {
			settingsWindow.restore()
		}
		settingsWindow.focus()
		return
	}

	settingsWindow = new BrowserWindow({
		width: 774,
		height: 484,
		resizable: false,
		title: 'Configurações',
		show: false,
		autoHideMenuBar: true,
		frame: true,
		roundedCorners: true,
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			nodeIntegration: false,
			contextIsolation: true
		}
	})

	// Carrega a URL apropriada baseado no ambiente
	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		settingsWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}/settings`)
	} else {
		settingsWindow.loadFile(join(__dirname, '../renderer/settings.html'))
	}

	// Show window when it's ready to avoid flashing
	settingsWindow.once('ready-to-show', () => {
		settingsWindow?.show()
		settingsWindow?.focus()
	})

	// Clean up reference when window is closed
	settingsWindow.on('closed', () => {
		settingsWindow = null
	})
}
