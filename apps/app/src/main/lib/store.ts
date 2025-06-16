import { is } from '@electron-toolkit/utils'
import Store from 'electron-store'
import type { Configs } from '../../shared/types/configs'

interface StoreConfig {
	configs: Configs
}

const defaults: StoreConfig = {
	configs: {
		appearance: {
			selectedPet: 'duck'
		},
		general: {
			cursingInterval: 60,
			safeMode: false,
			focusMode: null
		}
	}
}

export const store = new Store<StoreConfig>({
	name: is.dev ? 'dev-store' : 'store',
	defaults
	// I'm just keeping this commented as reference for future migrations
	// migrations: {
	// 	'1.0.1': (store: typeof Store) => {
	// 		store.set('configs.general.newKey', 'test')
	// 	}
	// }
})
