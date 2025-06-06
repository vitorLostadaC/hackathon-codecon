import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes } from './routes'

createRoot(document?.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<Routes />
	</StrictMode>
)
