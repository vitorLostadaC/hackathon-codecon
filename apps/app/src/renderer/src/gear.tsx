import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/main.css'
import { GearIcon } from './components/gear/GearIcon'

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<GearIcon />
	</StrictMode>
)
