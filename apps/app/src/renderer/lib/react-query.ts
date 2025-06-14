import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

broadcastQueryClient({
	queryClient,
	broadcastChannel: 'my-app'
})
