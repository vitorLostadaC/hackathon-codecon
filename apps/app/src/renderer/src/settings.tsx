import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Settings } from './screens/settings'

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<Settings />
	</StrictMode>
)
