import __Store from 'electron-store'
import type { Configs } from '../../shared/types/configs'

// @ts-expect-error https://github.com/sindresorhus/electron-store/issues/289
const Store = __Store?.default || __Store

interface StoreConfig {
	configs: Configs
}

const defaults: StoreConfig = {
	configs: {
		appearance: {
			selectedPet: 'duck'
		},
		general: {
			cursingInterval: 30,
			safeMode: false
		}
	}
}

export const store = new Store<StoreConfig>({
	defaults
	// I'm just keeping this commented as reference for future migrations
	// migrations: {
	// 	'1.0.1': (store: typeof Store) => {
	// 		store.set('configs.general.newKey', 'test')
	// 	}
	// }
})
