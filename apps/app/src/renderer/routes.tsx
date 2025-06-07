import { Route } from 'react-router-dom'

import { Router } from '@shared/lib/electron-router-dom'
import { PetScreen } from './screens/pet/pet'
import { SettingsScreen } from './screens/settings'

export function Routes() {
	return (
		<Router
			main={<Route path="/" element={<PetScreen />} />}
			settings={<Route path="/" element={<SettingsScreen />} />}
		/>
	)
}
