import { z } from 'zod'

export const curseConfigSchema = z.object({
	safeMode: z.boolean()
})

export const curseScreenshotRequestSchema = z.object({
	imageBase64: z.string(),
	config: curseConfigSchema
})

export const curseScreenshotResponseSchema = z.object({
	message: z.string()
})

export type CurseScreenshotRequest = z.infer<typeof curseScreenshotRequestSchema>
export type CurseScreenshotResponse = z.infer<typeof curseScreenshotResponseSchema>
export type CurseConfig = z.infer<typeof curseConfigSchema>
