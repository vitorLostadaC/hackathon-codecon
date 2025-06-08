import { api } from '@renderer/lib/axios'
import type { CurseScreenshotRequest, CurseScreenshotResponse } from '@repo/api-types/curse.dto'

interface CurseRequest extends CurseScreenshotRequest {
	userId: string
}

export const curse = async ({
	imageBase64,
	config,
	userId
}: CurseRequest): Promise<CurseScreenshotResponse> => {
	const response = await api.post(`/curse/${userId}`, { imageBase64, config })
	return response.data
}
