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
          bg-black/80 backdrop-blur-sm border-2 border-cyan-400/50 
          text-cyan-300 hover:bg-pink-400/10 hover:border-pink-400 hover:text-pink-300
          transition-all duration-300 shadow-lg shadow-cyan-400/25 hover:shadow-pink-400/25
          flex items-center space-x-2 px-3 py-2
          ${isOpen ? "border-pink-400 bg-pink-400/10 text-pink-300 shadow-pink-400/25" : ""}
        `}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-bold">{languageFlags[currentLanguage]}</span>
        <span className="text-xs hidden sm:inline">{languageNames[currentLanguage]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[180px] bg-black/90 backdrop-blur-sm border-2 border-cyan-400/50 rounded-lg shadow-xl shadow-cyan-400/25 overflow-hidden">
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
                      ? "bg-purple-500/20 text-purple-300 border-l-4 border-purple-400"
                      : "text-cyan-300 hover:bg-pink-500/10 hover:text-pink-300 hover:border-l-4 hover:border-pink-400"
                  }
                `}
              >
                <span className="text-lg">{languageFlags[lang]}</span>
                <span className="font-medium">{languageNames[lang]}</span>
                {currentLanguage === lang && <span className="ml-auto text-purple-400 text-xs">✓</span>}
              </button>
            ))}
          </div>

          {/* Footer con info */}
          <div className="border-t border-cyan-400/30 px-4 py-2 bg-black/50">
            <div className="text-xs text-cyan-400 text-center font-mono">🌐 Multilingual AI Interface</div>
          </div>
        </div>
      )}
    </div>
  )
}
