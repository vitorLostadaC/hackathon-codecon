import { electronApp, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, ipcMain } from 'electron'
import { join } from 'node:path'
import { createMainWindow, createWindow } from './factories'
import { takeScreenshot } from './process-functions/take-screenshot'

app.whenReady().then(() => {
	if (process.platform === 'darwin') {
		app.dock?.hide()
	}

	electronApp.setAppUserModelId('com.electron')

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	createMainWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createMainWindow()
		}
	})
})

ipcMain.handle('take-screenshot', takeScreenshot)

ipcMain.handle('create-settings-window', ({ sender }) => {
	const settingsWindow = createWindow({
		id: 'settings',
		width: 774,
		height: 484,
		resizable: false,
		title: 'Configurações',
		show: false,
		titleBarStyle: 'hiddenInset',
		trafficLightPosition: {
			x: 16,
			y: 16
		},
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

	settingsWindow.on('closed', () => {
		if (sender.isDestroyed()) {
			return
		}

		sender.send('settings-window-closed')
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
