import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'node:path'

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
		publicDir: resolve('resources')
	},
	preload: {
		plugins: [externalizeDepsPlugin()]
	},
	renderer: {
		define: {
			'process.platform': JSON.stringify(process.platform)
		},
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
