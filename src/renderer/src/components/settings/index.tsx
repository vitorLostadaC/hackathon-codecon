import React from 'react'

export function Settings(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#151313] p-4">
      <div className="space-y-2">
        {/* General Settings */}
        <div className="flex items-center gap-2 p-1 px-2 rounded-lg hover:bg-[#201C1C] cursor-pointer">
          <div className="w-[18px] h-[18px] flex items-center justify-center">
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.75 7.125H3.75V7.125H3.75Z" stroke="#D8CDCD" strokeWidth="1.2" />
              <path
                d="M3 2.25C3 2.25 3 2.25 3 2.25C3 2.25 15 2.25 15 2.25V15.75H3V2.25Z"
                stroke="#D8CDCD"
                strokeWidth="1.2"
              />
            </svg>
          </div>
          <span className="text-[#CCBDBD] text-base">Geral</span>
        </div>

        {/* Appearance Settings */}
        <div className="flex items-center gap-2 p-1 px-2 rounded-lg hover:bg-[#201C1C] cursor-pointer">
          <div className="w-[18px] h-[18px] flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.25 2.25H15.75V15.75H2.25V2.25Z" stroke="#D8CDCD" />
              <path d="M6 6H12V12H6V6Z" stroke="#D8CDCD" />
            </svg>
          </div>
          <span className="text-[#CCBDBD] text-base">Aparência</span>
        </div>

        {/* Pricing Settings */}
        <div className="flex items-center gap-2 p-1 px-2 rounded-lg hover:bg-[#201C1C] cursor-pointer">
          <div className="w-[18px] h-[18px] flex items-center justify-center">
            <svg
              width="14"
              height="11"
              viewBox="0 0 14 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1.5 1.5H12.5V9.5H1.5V1.5Z" stroke="#D8CDCD" />
            </svg>
          </div>
          <span className="text-[#CCBDBD] text-base">Preços</span>
        </div>

        {/* User Profile Section */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2.5 bg-[#201C1C] border border-[#333333] rounded-[10px] p-2.5 px-4">
            <div className="flex flex-col gap-1">
              <span className="text-[#E8E5E5] text-sm">Vitor Lostada</span>
              <span className="text-[#C7C3C1] text-xs">vitorlostada@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
