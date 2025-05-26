import React from 'react'
import { TabButtonProps } from '../types'
import { cn } from '@renderer/lib/utils'

export function TabButton({ icon, label, isActive, onClick }: TabButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-[133px] flex items-center gap-1.5 p-1 px-2 rounded-lg hover:bg-background-secondary',
        isActive ? 'bg-background-tertiary text-primary' : 'bg-background-primary text-secondary'
      )}
    >
      <div className="w-[18px] h-[18px] flex items-center justify-center">{icon}</div>
      <span className={'text-base'}>{label}</span>
    </button>
  )
}
