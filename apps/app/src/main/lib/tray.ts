import { type BrowserWindow, Menu, Tray, app } from 'electron'
import { IPC } from '~/src/shared/constants/ipc'
import icon from '../../../resources/patoputoTemplate.png?asset'
import { createSettingsWindow } from '../factories'

export function createTray(window: BrowserWindow) {
	const tray = new Tray(icon)

	const menu = Menu.buildFromTemplate([
		{
			label: 'Pato Puto',
			enabled: false
		},
		{
			label: 'Configurações',
			click: () => {
				const settingsWindow = createSettingsWindow()
				settingsWindow.on('closed', () => {
					window.webContents.send(IPC.WINDOWS.ON_CLOSE_SETTINGS)
				})
				window.webContents.send(IPC.WINDOWS.ON_OPEN_SETTINGS)
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Sair do Pato Puto',
			click: () => {
				app.quit()
			}
		}
	])

	tray.setContextMenu(menu)
}
