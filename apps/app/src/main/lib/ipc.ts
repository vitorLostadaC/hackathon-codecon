import { IPC } from '@shared/constants/ipc'
import type {
	GetConfigResponse,
	TakeScreenshotResponse,
	UpdateConfigRequest,
	UpdateConfigResponse
} from '@shared/types/ipc'
import { desktopCapturer, ipcMain, screen } from 'electron'
import type { Configs } from '~/src/shared/types/configs'
import { store } from './store'

ipcMain.handle(IPC.ACTIONS.TAKE_SCREENSHOT, async (): Promise<TakeScreenshotResponse> => {
	try {
		const sources = await desktopCapturer.getSources({
			types: ['screen'],
			thumbnailSize: {
				width: screen.getPrimaryDisplay().workAreaSize.width,
				height: screen.getPrimaryDisplay().workAreaSize.height
			}
		})

		if (sources.length === 0) {
			throw new Error('No screen sources found')
		}

		const primarySource = sources[0]

		if (!primarySource) {
			throw new Error('No primary source found')
		}

		const thumbnail = primarySource.thumbnail.toDataURL()
		return {
			screenshot: thumbnail
		}
	} catch (err) {
		console.error('Error taking screenshot:', err)
		return {
			screenshot: null
		}
	}
})

ipcMain.handle(IPC.CONFIG.GET_CONFIGS, async (): Promise<GetConfigResponse> => {
	return {
		config: store.get('configs')
	}
})

ipcMain.handle(
	IPC.CONFIG.UPDATE_CONFIG,
	async (_, { config }: UpdateConfigRequest): Promise<UpdateConfigResponse> => {
		const currentConfig = store.get('configs')
		const updatedConfig = { ...currentConfig, ...config } satisfies Configs
		store.set('configs', updatedConfig)

		return {
			config: updatedConfig
		}
	}
)
