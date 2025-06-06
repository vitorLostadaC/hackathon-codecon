import { createElectronRouter } from 'electron-router-dom'

export const { Router, registerRoute, settings } = createElectronRouter({
	port: 5173,

	types: {
		ids: ['main', 'settings']
	}
})
