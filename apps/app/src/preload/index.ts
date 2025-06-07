import { type ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

const api = {
	takeScreenshot: () => ipcRenderer.invoke('take-screenshot'),
	createSettingsWindow: () => ipcRenderer.invoke('create-settings-window')
} as const

if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('electron', electronAPI)
		contextBridge.exposeInMainWorld('api', api)
	} catch (error) {
		console.error(error)
	}
} else {
	window.electron = electronAPI
	window.api = api
}

declare global {
	interface Window {
		electron: ElectronAPI
		api: typeof api
	}
}
