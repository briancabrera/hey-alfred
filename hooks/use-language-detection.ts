"use client"

import { useCallback } from "react"
import { detectLanguage, detectUnsupportedLanguage, isLanguageSupported } from "@/utils/language-detector"

export function useLanguageDetection() {
  const detectMessageLanguage = useCallback((text: string) => {
    console.log("🎯 Detectando idioma para mensaje:", text.substring(0, 50) + "...")

    const detectedLang = detectLanguage(text)
    const unsupportedLang = detectUnsupportedLanguage(text)
    const isSupported = isLanguageSupported(detectedLang)

    console.log("🔍 Resultado detección:", {
      detectedLang,
      unsupportedLang,
      isSupported,
    })

    return {
      detectedLanguage: detectedLang,
      unsupportedLanguage: unsupportedLang,
      isSupported,
    }
  }, [])

  const createUnsupportedLanguageMessage = useCallback((detectedLang: string) => {
    const unsupportedMessage = `Lo siento, pero no estoy configurado para comunicarme en ese idioma. Actualmente solo puedo conversar en estos 5 idiomas: español, english, português, français, italiano.`

    return {
      id: `unsupported-${Date.now()}`,
      role: "assistant" as const,
      content: unsupportedMessage,
      createdAt: new Date(),
    }
  }, [])

  return {
    detectMessageLanguage,
    createUnsupportedLanguageMessage,
  }
}
