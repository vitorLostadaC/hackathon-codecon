import './assets/main.css'

import { queryClient } from '@renderer/lib/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes } from './routes'

createRoot(document?.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Routes />
		</QueryClientProvider>
	</StrictMode>
)
