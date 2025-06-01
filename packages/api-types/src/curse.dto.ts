import { z } from 'zod'

export const curseScreenshotRequestSchema = z.object({
	imageBase64: z.string(),
	config: z.object({
		safeMode: z.boolean()
	})
})

export const curseScreenshotResponseSchema = z.object({
	message: z.string()
})

export type CurseScreenshotRequest = z.infer<typeof curseScreenshotRequestSchema>
export type CurseScreenshotResponse = z.infer<typeof curseScreenshotResponseSchema>
