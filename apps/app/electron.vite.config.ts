import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'node:path'
import tsconfigPathsPlugin from 'vite-tsconfig-paths'

const tsconfigPaths = tsconfigPathsPlugin({
	projects: [resolve('tsconfig.json')]
})

export default defineConfig({
	main: {
		plugins: [tsconfigPaths, externalizeDepsPlugin()],
		publicDir: resolve('resources')
	},
	preload: {
		plugins: [tsconfigPaths, externalizeDepsPlugin()]
	},
	renderer: {
		define: {
			'process.platform': JSON.stringify(process.platform),
			'process.env.CLERK_TELEMETRY_DEBUG': JSON.stringify(
				process.env.CLERK_TELEMETRY_DEBUG || 'false'
			),
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		},
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer')
			}
		},
		plugins: [tsconfigPaths, react()],
		build: {
			rollupOptions: {
				input: {
					main: resolve('src/renderer/index.html')
				}
			}
		},
		assetsInclude: ['**/*.svg']
	}
})
