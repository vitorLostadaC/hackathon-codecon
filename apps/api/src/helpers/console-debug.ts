import { env } from '../env'

const COLORS = {
	aqua: '36m',
	red: '31m',
	yellow: '33m',
	green: '32m',
	none: '0m'
}

export const consoleDebug = (message: string, color: keyof typeof COLORS = 'aqua') => {
	if (env.DEBUG) {
		const colorCode = COLORS[color]
		console.log(`\x1b[${colorCode}%s\x1b[0m`, message)
	}
}
