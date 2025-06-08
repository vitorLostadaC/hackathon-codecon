import { electronApp, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app } from 'electron'
import { createMainWindow, createWindow } from './factories'

import { join } from 'node:path'
import './lib/ipc'
import './lib/store'

app.whenReady().then(() => {
	if (process.platform === 'darwin') {
		app.dock?.hide()
	}

	electronApp.setAppUserModelId('com.electron')

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	createMainWindow()

	createWindow({
		id: 'settings',
		width: 774,
		height: 488,
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

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createMainWindow()

			createWindow({
				id: 'settings',
				width: 774,
				height: 488,
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
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
