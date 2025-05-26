import React from 'react'
import { Tab } from '../types'
import { TabButton } from './TabButton'
import { CreditCard, Angry, Settings } from 'lucide-react'
import { UserProfile } from './UserProfile'

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabIcons = {
  general: <Settings size={14} />,
  appearance: <Angry size={14} />,
  pricing: <CreditCard size={14} />
}

const tabLabels: Record<Tab, string> = {
  general: 'Geral',
  appearance: 'Aparência',
  pricing: 'Preços'
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps): React.JSX.Element {
  return (
    <div className="space-y-2 flex flex-col justify-between px-4 pb-6 pt-10 w-fit">
      <div className="flex flex-col gap-2">
        {(Object.keys(tabLabels) as Tab[]).map((tab) => (
          <TabButton
            key={tab}
            icon={tabIcons[tab]}
            label={tabLabels[tab]}
            isActive={activeTab === tab}
            onClick={() => onTabChange(tab)}
          />
        ))}
      </div>
      <UserProfile name="Vitor Lostada" email="vitorlostada@gmail.com" />
    </div>
  )
}
