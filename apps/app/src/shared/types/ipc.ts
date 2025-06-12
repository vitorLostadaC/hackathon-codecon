import type { Configs } from './configs'

export interface TakeScreenshotResponse {
	/**
	 * The screenshot of the screen in base64 format
	 */
	screenshot: string | null
}

export interface UpdateConfigRequest {
	config: Partial<Configs>
}

export interface UpdateConfigResponse {
	config: Configs
}

export interface GetConfigResponse {
	config: Configs
}
