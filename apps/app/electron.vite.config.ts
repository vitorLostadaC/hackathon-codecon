import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()]
	},
	preload: {
		plugins: [externalizeDepsPlugin()]
	},
	renderer: {
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer/src')
			}
		},
		plugins: [react()],
		build: {
			rollupOptions: {
				input: {
					main: resolve('src/renderer/index.html'),
					settings: resolve('src/renderer/settings.html'),
					gear: resolve('src/renderer/gear.html')
				}
			}
		},
		assetsInclude: ['**/*.svg']
	}
})
