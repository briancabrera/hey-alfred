"use client"

import { useState, useCallback, useRef } from "react"
import { detectLanguage, getVoiceSettings } from "@/utils/language-detector"

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const lastSpokenMessageRef = useRef<string>("")

  const speak = useCallback((text: string) => {
    // Evitar reproducir el mismo mensaje múltiples veces (solo para auto-reproducción)
    if (lastSpokenMessageRef.current === text) {
      return
    }

    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Detectar idioma automáticamente
      const detectedLanguage = detectLanguage(text)
      const voiceSettings = getVoiceSettings(detectedLanguage)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = detectedLanguage
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch

      utterance.onstart = () => {
        setIsSpeaking(true)
        lastSpokenMessageRef.current = text
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }, [])

  // Función específica para repetir que bypasea la verificación de duplicados
  const repeatSpeak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Detectar idioma automáticamente
      const detectedLanguage = detectLanguage(text)
      const voiceSettings = getVoiceSettings(detectedLanguage)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = detectedLanguage
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const clearLastSpoken = useCallback(() => {
    lastSpokenMessageRef.current = ""
  }, [])

  return { speak, repeatSpeak, stop, isSpeaking, clearLastSpoken }
}
