import type { TokensUsage } from '../types/ai'

export function aggregateTokens(
	tokenSources: Array<Record<string, TokensUsage> | undefined>
): Record<string, { input: number; output: number }> {
	const tokens: Record<string, { input: number; output: number }> = {}
	for (const tokenSource of tokenSources) {
		if (!tokenSource) continue
		for (const [modelId, usage] of Object.entries(tokenSource)) {
			if (!tokens[modelId]) {
				tokens[modelId] = { input: 0, output: 0 }
			}
			tokens[modelId].input += usage.input ?? 0
			tokens[modelId].output += usage.output ?? 0
		}
	}
	return tokens
}
