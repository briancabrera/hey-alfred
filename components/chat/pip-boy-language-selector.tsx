"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  es: "ESPAÑOL",
  en: "ENGLISH",
  fr: "FRANÇAIS",
  it: "ITALIANO",
  pt: "PORTUGUÊS",
}

export function PipBoyLanguageSelector() {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLanguageChange = (lang: Language) => {
    console.log("🖱️ Pip-Boy Language button clicked:", lang)
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
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-1 px-2 py-1 border border-slate-500/50 bg-black/70 font-mono text-xs
          transition-all duration-300 hover:shadow-md
          ${
            isOpen
              ? "border-amber-300 text-amber-300 bg-amber-300/10 shadow-amber-300/50"
              : "text-white hover:border-white hover:bg-white/10 hover:shadow-white/50"
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-3 h-3" />
        <span className="text-xs font-bold">{languageFlags[currentLanguage]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 min-w-[180px] bg-black/95 border border-slate-500/50 shadow-xl shadow-white/25 overflow-hidden z-[100]"
          >
            <div className="py-1">
              {availableLanguages.map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`
                    w-full px-3 py-2 text-left flex items-center space-x-2
                    transition-all duration-200 text-xs font-mono font-medium
                    ${
                      currentLanguage === lang
                        ? "bg-white/20 text-white border-l-2 border-white"
                        : "text-white hover:bg-amber-300/10 hover:text-amber-300 hover:border-l-2 hover:border-amber-300"
                    }
                  `}
                  whileHover={{ x: 2 }}
                >
                  <span className="text-sm">{languageFlags[lang]}</span>
                  <span className="font-bold tracking-wider text-xs">{languageNames[lang]}</span>
                  {currentLanguage === lang && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto text-white text-xs"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <motion.div
              className="border-t border-slate-500/30 px-3 py-1 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-xs text-white text-center font-mono tracking-wider">🌐 LANG_SELECT</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
