import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Configs } from '~/src/shared/types/configs'
import { getConfigsOptions } from '../../../requests/electron-store/config'

export const useConfig = () => {
	const queryClient = useQueryClient()
	const { data: configs } = useQuery(getConfigsOptions())

	const { mutateAsync: updateConfig } = useMutation({
		mutationKey: ['update-config'],
		mutationFn: (config: Partial<Configs>) => {
			return window.api.config.updateConfig({ config })
		},
		onSuccess: ({ config }) => {
			queryClient.setQueryData(getConfigsOptions().queryKey, (oldData) => {
				if (!oldData) return config

				return {
					...oldData,
					...config
				}
			})
		}
	})

	return { configs, updateConfig }
}
