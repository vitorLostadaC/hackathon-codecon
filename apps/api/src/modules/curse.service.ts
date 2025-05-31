import type { CurseScreenshotRequest, CurseScreenshotResponse } from '@repo/api-dto/curse.dto'

export class CurseService {
	async curseScreenshot({ imageBase64 }: CurseScreenshotRequest): Promise<CurseScreenshotResponse> {
		return { imageBase64 }
	}
}
