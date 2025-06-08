import { api } from '@renderer/lib/axios'

export const getUser = async (userId: string) => {
	const response = await api.get(`/user/${userId}`)
	return response.data
}
