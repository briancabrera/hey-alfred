"use client"

import { Card } from "@/components/ui/card"
import { getLanguageName } from "@/utils/language-detector"
import { PipBoyLanguageSelector } from "./pip-boy-language-selector"

interface StatusPanelProps {
  userLanguage: string
  currentLanguage: string
  messagesCount: number
  isSpeaking: boolean
}

export function StatusPanel({ userLanguage, currentLanguage, messagesCount, isSpeaking }: StatusPanelProps) {
  return (
    <Card className="bg-black/50 border-slate-500/50 p-3 xl:p-4 mb-4 xl:mb-6">
      <div className="space-y-2 xl:space-y-3">
        {/* Header del Status Panel con selector de idioma */}
        <div className="flex justify-between items-center mb-2 xl:mb-4 pb-2 border-b border-slate-500/30">
          <span className="text-xs xl:text-sm font-bold text-white tracking-wider">SYSTEM_STATUS</span>
          <PipBoyLanguageSelector />
        </div>

        {/* Layout responsive: Grid en mobile, dos columnas en desktop */}
        <div className="xl:hidden">
          {/* Mobile: Grid compacto */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white font-medium">USER:</span>
              <span className="text-xs text-amber-300 font-bold">{getLanguageName(userLanguage).slice(0, 3)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-white font-medium">MEMORY:</span>
              <span className="text-xs text-cyan-300 font-bold">
                {messagesCount > 0 ? `${messagesCount} MSGS` : "EMPTY"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-white font-medium">AI:</span>
              <span className="text-xs text-cyan-300 font-bold">{getLanguageName(currentLanguage).slice(0, 3)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-white font-medium">VOICE:</span>
              <span className="text-xs text-white font-bold">{isSpeaking ? "SPEAK" : "READY"}</span>
            </div>
          </div>
        </div>

        {/* Desktop: Layout de dos columnas */}
        <div className="hidden xl:block space-y-3">
          {/* USER_LANG */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-white font-medium tracking-wider">USER_LANG:</span>
            <span className="text-sm text-amber-300 font-bold tracking-wider">{getLanguageName(userLanguage)}</span>
          </div>

          {/* AI_LANG */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-white font-medium tracking-wider">AI_LANG:</span>
            <span className="text-sm text-cyan-300 font-bold tracking-wider">{getLanguageName(currentLanguage)}</span>
          </div>

          {/* VOICE_MODE */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-white font-medium tracking-wider">VOICE_MODE:</span>
            <span className="text-sm text-white font-bold tracking-wider">{isSpeaking ? "SPEAKING" : "READY"}</span>
          </div>

          {/* MEMORY */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-white font-medium tracking-wider">MEMORY:</span>
            <span className="text-sm text-cyan-300 font-bold tracking-wider">
              {messagesCount > 0 ? `${messagesCount} MSGS` : "EMPTY"}
            </span>
          </div>

          {/* INTERFACE */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-white font-medium tracking-wider">INTERFACE:</span>
            <span className="text-sm text-cyan-300 font-bold tracking-wider">PIP-BOY_V3.0</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
