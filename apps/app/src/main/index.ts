import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { takeScreenshot } from './process-functions/take-screenshot'
import { configureInvisibleOverlayWindow } from './utils/overlayWindow'
import { createSettingsWindow } from './utils/settingsWindow'

app.whenReady().then(() => {
	if (process.platform === 'darwin') {
		app.dock?.hide()
	}

	electronApp.setAppUserModelId('com.electron')

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	const mainWindow = configureInvisibleOverlayWindow()

	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
	}

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			configureInvisibleOverlayWindow()
		}
	})
})

ipcMain.handle('take-screenshot', takeScreenshot)

ipcMain.handle('open-settings-window', () => {
	createSettingsWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
