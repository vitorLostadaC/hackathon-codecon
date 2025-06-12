import axios from 'axios'
import { env } from '../env'
import type { ApiError } from '../types/api'

export const api = axios.create({
	baseURL: env.VITE_API_URL,
	withCredentials: true
})

api.interceptors.response.use(
	(response) => response.data,
	(e) => {
		const error = e.response?.data as ApiError
		throw new Error(error.error, { cause: error.message })
	}
)
