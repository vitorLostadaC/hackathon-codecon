import type { CurseScreenshotRequest, CurseScreenshotResponse } from '@repo/api-types/curse.dto'

export class CurseService {
	async curseScreenshot({ imageBase64 }: CurseScreenshotRequest): Promise<CurseScreenshotResponse> {
		return { message: 'Hello, world!' }
	}
}
