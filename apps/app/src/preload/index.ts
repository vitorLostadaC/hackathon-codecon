import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/constants/ipc'
import type {
	GetConfigResponse,
	TakeScreenshotResponse,
	UpdateConfigRequest,
	UpdateConfigResponse
} from '../shared/types/ipc'

const api = {
	actions: {
		takeScreenshot: (): Promise<TakeScreenshotResponse> =>
			ipcRenderer.invoke(IPC.ACTIONS.TAKE_SCREENSHOT)
	},
	windows: {
		createSettingsWindow: () => ipcRenderer.invoke(IPC.WINDOWS.CREATE_SETTINGS),
		onOpenSettingsWindow: (callback: () => void) =>
			ipcRenderer.on(IPC.WINDOWS.ON_OPEN_SETTINGS, callback),
		onCloseSettingsWindow: (callback: () => void) =>
			ipcRenderer.on(IPC.WINDOWS.ON_CLOSE_SETTINGS, callback)
	},
	config: {
		getConfigs: (): Promise<GetConfigResponse> => ipcRenderer.invoke(IPC.CONFIG.GET_CONFIGS),
		updateConfig: (config: UpdateConfigRequest): Promise<UpdateConfigResponse> =>
			ipcRenderer.invoke(IPC.CONFIG.UPDATE_CONFIG, config)
	}
} as const

if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('api', api)
	} catch (error) {
		console.error(error)
	}
} else {
	window.api = api
}

declare global {
	interface Window {
		api: typeof api
	}
}
