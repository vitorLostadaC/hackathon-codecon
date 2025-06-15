import { queryOptions } from '@tanstack/react-query'
import { getUser } from './get-user'

export const getUserOptions = (userId: string) =>
	queryOptions({
		queryKey: ['user', userId],
		queryFn: () => getUser(userId),
		enabled: !!userId
	})
