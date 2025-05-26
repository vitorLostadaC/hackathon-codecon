import React from 'react'
import { Toggle } from '../components/Toggle'

interface GeneralTabProps {
  printInterval: number
  onPrintIntervalChange: (value: number) => void
  familyFriendly: boolean
  onFamilyFriendlyChange: (value: boolean) => void
}

export function GeneralTab({
  printInterval,
  onPrintIntervalChange,
  familyFriendly,
  onFamilyFriendlyChange
}: GeneralTabProps): React.JSX.Element {
  return (
    <div className="space-y-8 mx-8 mt-6">
      <div className="flex justify-between items-center">
        <span className="text-primary text-lg">Intervalo de print</span>
        <div className="flex items-center gap-4">
          <div className="bg-background-input rounded-md px-3 py-2 flex justify-between items-center w-[70px]">
            <span className="text-primary text-base">{printInterval}</span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => onPrintIntervalChange(printInterval + 1)}
                className="focus:outline-none"
              >
                <svg width="8" height="4" viewBox="0 0 8 4" fill="none">
                  <path d="M4 0L8 4H0L4 0Z" fill="#E8E5E5" />
                </svg>
              </button>
              <button
                onClick={() => onPrintIntervalChange(Math.max(1, printInterval - 1))}
                className="focus:outline-none"
              >
                <svg width="8" height="4" viewBox="0 0 8 4" fill="none">
                  <path d="M4 4L0 0H8L4 4Z" fill="#E8E5E5" />
                </svg>
              </button>
            </div>
          </div>
          <span className="text-tertiary text-base">Minutos</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-primary text-lg">Family Friend</span>
          <Toggle checked={familyFriendly} onChange={onFamilyFriendlyChange} />
        </div>
        <p className="text-tertiary text-base">Seu pato nao ficara falando palavroes</p>
      </div>
    </div>
  )
}
