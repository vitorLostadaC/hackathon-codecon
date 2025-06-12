import './assets/main.css'

import { ClerkProvider } from '@clerk/clerk-react'
import { queryClient } from '@renderer/lib/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { env } from './env'
import { Routes } from './routes'

createRoot(document?.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY} afterSignOutUrl="#/settings">
			<QueryClientProvider client={queryClient}>
				<Routes />
				<Toaster />
			</QueryClientProvider>
		</ClerkProvider>
	</StrictMode>
)
