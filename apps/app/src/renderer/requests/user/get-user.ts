import { api } from '@renderer/lib/axios'
import type { User } from '@repo/api-types/user.dto'

export const getUser = async (userId: string): Promise<User> => {
	const response = await api.get(`/user/${userId}`)
	return response.data
}
