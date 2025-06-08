import { queryOptions } from '@tanstack/react-query'

export const getConfigsOptions = () =>
	queryOptions({
		queryKey: ['config'],
		queryFn: async () => {
			const response = await window.api.config.getConfigs()
			return response.config
		}
	})
