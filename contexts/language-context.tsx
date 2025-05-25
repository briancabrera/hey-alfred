"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, getLanguageFromCode, type Language, type Translations } from "@/utils/translations"

interface LanguageContextType {
  currentLanguage: Language
  t: Translations
  changeLanguage: (language: Language) => void
  updateLanguageFromDetection: (detectedLangCode: string) => void
  availableLanguages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("es")
  const [t, setT] = useState<Translations>(translations.es)

  // Función para cambiar idioma manualmente
  const changeLanguage = (language: Language) => {
    console.log("🌐 Context: Changing language to:", language)

    setCurrentLanguage(language)
    setT(translations[language])

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("alfred-ui-language", language)
      console.log("💾 Context: Saved language to localStorage:", language)
    }

    console.log("✅ Context: Language change completed:", language)
  }

  // Función para actualizar idioma basado en la detección automática
  const updateLanguageFromDetection = (detectedLangCode: string) => {
    const language = getLanguageFromCode(detectedLangCode)
    console.log("🔍 Context: Auto-detected language:", language, "from code:", detectedLangCode)

    if (language !== currentLanguage) {
      console.log("🔄 Context: Auto-updating UI language from", currentLanguage, "to", language)
      setCurrentLanguage(language)
      setT(translations[language])
    }
  }

  // Cargar idioma guardado al inicializar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("alfred-ui-language") as Language
      console.log("📂 Context: Loading saved language:", savedLanguage)

      if (savedLanguage && translations[savedLanguage]) {
        setCurrentLanguage(savedLanguage)
        setT(translations[savedLanguage])
        console.log("✅ Context: Applied saved language:", savedLanguage)
      }
    }
  }, [])

  // Debug effect
  useEffect(() => {
    console.log("🌐 Context: Language state updated:", currentLanguage)
    console.log("📝 Context: Current translations sample:", t.startSession)
  }, [currentLanguage, t.startSession])

  const value: LanguageContextType = {
    currentLanguage,
    t,
    changeLanguage,
    updateLanguageFromDetection,
    availableLanguages: Object.keys(translations) as Language[],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
