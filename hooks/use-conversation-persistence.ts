"use client"

import { useState, useCallback } from "react"

// Constantes para localStorage
const STORAGE_KEYS = {
  MESSAGES: "alfred-conversation-messages",
  USER_LANGUAGE: "alfred-user-language",
  ALFRED_LANGUAGE: "alfred-alfred-language",
  LAST_PROCESSED_ID: "alfred-last-processed-id",
} as const

interface ConversationData {
  messages: any[]
  userLanguage: string
  alfredLanguage: string
  lastProcessedId: string
}

export function useConversationPersistence() {
  const [isLoaded, setIsLoaded] = useState(false)

  const saveToLocalStorage = useCallback((data: ConversationData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(data.messages))
      localStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, data.userLanguage)
      localStorage.setItem(STORAGE_KEYS.ALFRED_LANGUAGE, data.alfredLanguage)
      localStorage.setItem(STORAGE_KEYS.LAST_PROCESSED_ID, data.lastProcessedId)

      console.log("💾 Conversación guardada en localStorage:", {
        messages: data.messages.length,
        userLang: data.userLanguage,
        alfredLang: data.alfredLanguage,
        lastProcessedId: data.lastProcessedId,
      })
    } catch (error) {
      console.error("❌ Error guardando en localStorage:", error)
    }
  }, [])

  const loadFromLocalStorage = useCallback((): ConversationData | null => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
      const savedUserLang = localStorage.getItem(STORAGE_KEYS.USER_LANGUAGE)
      const savedAlfredLang = localStorage.getItem(STORAGE_KEYS.ALFRED_LANGUAGE)
      const savedLastProcessedId = localStorage.getItem(STORAGE_KEYS.LAST_PROCESSED_ID)

      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        const data = {
          messages: parsedMessages,
          userLanguage: savedUserLang || "es-ES",
          alfredLanguage: savedAlfredLang || "es-ES",
          lastProcessedId: savedLastProcessedId || "",
        }

        console.log("📂 Cargando conversación desde localStorage:", {
          messages: data.messages.length,
          userLang: data.userLanguage,
          alfredLang: data.alfredLanguage,
          lastProcessedId: data.lastProcessedId,
        })

        return data
      }
    } catch (error) {
      console.error("❌ Error cargando desde localStorage:", error)
    }
    return null
  }, [])

  const clearLocalStorage = useCallback(() => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      console.log("🗑️ localStorage limpiado completamente")
    } catch (error) {
      console.error("❌ Error limpiando localStorage:", error)
    }
  }, [])

  const initializeStorage = useCallback(() => {
    console.log("🚀 Inicializando sistema de persistencia...")
    setIsLoaded(true)
    return loadFromLocalStorage()
  }, [loadFromLocalStorage])

  return {
    isLoaded,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    initializeStorage,
  }
}
