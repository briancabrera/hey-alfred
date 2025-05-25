"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/utils/translations"

const languageFlags: Record<Language, string> = {
  es: "🇪🇸",
  en: "🇺🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
  pt: "🇧🇷",
}

const languageNames: Record<Language, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
}

export function LanguageSelector() {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  console.log("🎛️ LanguageSelector render - current:", currentLanguage)

  const handleLanguageChange = (lang: Language) => {
    console.log("🖱️ Language button clicked:", lang)
    if (lang !== currentLanguage) {
      changeLanguage(lang)
    }
    setIsOpen(false)
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Cerrar dropdown con ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <div ref={dropdownRef} className="fixed top-4 right-4 z-50 font-mono" style={{ zIndex: 9999 }}>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className={`
          bg-black/80 backdrop-blur-sm border-2 border-green-400/50 
          text-green-300 hover:bg-yellow-400/10 hover:border-yellow-400 hover:text-yellow-300
          transition-all duration-300
          flex items-center space-x-2 px-3 py-2
          ${isOpen ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : ""}
        `}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-bold">{languageFlags[currentLanguage]}</span>
        <span className="text-xs hidden sm:inline">{languageNames[currentLanguage]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[180px] bg-black/90 backdrop-blur-sm border-2 border-green-400/50 rounded-lg overflow-hidden">
          <div className="py-1">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`
                  w-full px-4 py-3 text-left flex items-center space-x-3
                  transition-all duration-200 text-sm font-medium
                  ${
                    currentLanguage === lang
                      ? "bg-yellow-500/20 text-yellow-300 border-l-4 border-yellow-400"
                      : "text-green-300 hover:bg-yellow-500/10 hover:text-yellow-300 hover:border-l-4 hover:border-yellow-400"
                  }
                `}
              >
                <span className="text-lg">{languageFlags[lang]}</span>
                <span className="font-medium">{languageNames[lang]}</span>
                {currentLanguage === lang && <span className="ml-auto text-yellow-400 text-xs">✓</span>}
              </button>
            ))}
          </div>

          {/* Footer con info */}
          <div className="border-t border-green-400/30 px-4 py-2 bg-black/50">
            <div className="text-xs text-green-400 text-center font-mono">🌐 Multilingual AI Interface</div>
          </div>
        </div>
      )}
    </div>
  )
}
