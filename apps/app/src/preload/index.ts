import { type ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/constants/ipc'
import type {
	GetConfigResponse,
	UpdateConfigRequest,
	UpdateConfigResponse
} from '../shared/types/ipc'

const api = {
	actions: {
		takeScreenshot: () => ipcRenderer.invoke(IPC.ACTIONS.TAKE_SCREENSHOT)
	},
	windows: {
		createSettingsWindow: () => ipcRenderer.invoke(IPC.WINDOWS.CREATE_SETTINGS)
	},
	config: {
		getConfigs: (): Promise<GetConfigResponse> => ipcRenderer.invoke(IPC.CONFIG.GET_CONFIGS),
		updateConfig: (config: UpdateConfigRequest): Promise<UpdateConfigResponse> =>
			ipcRenderer.invoke(IPC.CONFIG.UPDATE_CONFIG, config)
	}
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
