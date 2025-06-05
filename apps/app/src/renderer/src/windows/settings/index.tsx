import type React from 'react'
import { useState } from 'react'
import { Sidebar } from './components/sidebar'
import { SettingsProvider } from './context/settings-context'
import { useSettings } from './hooks/use-settings'
import { AppearanceTab } from './tabs/appearance-tab'
import { GeneralTab } from './tabs/general-tab'
import { HomeTab } from './tabs/home-tab'
import { PricingTab } from './tabs/pricing-tab'
import type { Tab } from './types'

function SettingsContent(): React.JSX.Element {
	const [activeTab, setActiveTab] = useState<Tab>('home')
	const settings = useSettings()

	const renderTab = (): React.JSX.Element => {
		switch (activeTab) {
			case 'general':
				return (
					<GeneralTab
						printInterval={settings.printInterval}
						onPrintIntervalChange={(value) => settings.updateSettings('printInterval', value)}
						familyFriendly={settings.familyFriendly}
						onFamilyFriendlyChange={(value) => settings.updateSettings('familyFriendly', value)}
					/>
				)
			case 'appearance':
				return (
					<AppearanceTab
						selectedTheme={settings.selectedTheme}
						onThemeChange={(value) => settings.updateSettings('selectedTheme', value)}
					/>
				)
			case 'pricing':
				return (
					<PricingTab
						selectedPlan={settings.selectedPlan}
						onPlanSelect={(value) => settings.updateSettings('selectedPlan', value)}
					/>
				)
			case 'home':
				return <HomeTab />
		}
	}

	return (
		<div className="flex h-screen bg-background-primary">
			<Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
			<div className="w-0.5 bg-background-secondary h-screen" />
			<div className="flex-1 mx-4 my-4">{renderTab()}</div>
		</div>
	)
}

export function Settings(): React.JSX.Element {
	return (
		<SettingsProvider>
			<SettingsContent />
		</SettingsProvider>
	)
}
