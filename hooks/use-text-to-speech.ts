"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { detectLanguage, getVoiceSettings } from "@/utils/language-detector"

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const lastSpokenMessageRef = useRef<string>("")

  // 🚀 NUEVO: Cleanup al desmontar el componente o recargar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("🔇 Página recargándose/cerrándose - deteniendo síntesis de voz")
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("🔇 Página oculta - deteniendo síntesis de voz")
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel()
          setIsSpeaking(false)
        }
      }
    }

    const handlePageHide = () => {
      console.log("🔇 Página ocultándose - deteniendo síntesis de voz")
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }

    // Agregar event listeners
    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", handlePageHide)

    // Cleanup al desmontar el hook
    return () => {
      console.log("🔇 Hook desmontándose - deteniendo síntesis de voz")
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [])

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
        console.log("🔊 Alfred comenzó a hablar")
        setIsSpeaking(true)
        lastSpokenMessageRef.current = text
      }

      utterance.onend = () => {
        console.log("🔇 Alfred terminó de hablar")
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error("❌ Error en síntesis de voz:", event.error)
        setIsSpeaking(false)
      }

      console.log("🎤 Iniciando síntesis de voz para:", text.substring(0, 50) + "...")
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
        console.log("🔊 Alfred comenzó a repetir")
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        console.log("🔇 Alfred terminó de repetir")
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error("❌ Error en repetición de voz:", event.error)
        setIsSpeaking(false)
      }

      console.log("🔄 Repitiendo síntesis de voz para:", text.substring(0, 50) + "...")
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      console.log("🛑 Deteniendo síntesis de voz manualmente")
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const clearLastSpoken = useCallback(() => {
    lastSpokenMessageRef.current = ""
  }, [])

  return { speak, repeatSpeak, stop, isSpeaking, clearLastSpoken }
}
