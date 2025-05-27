"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { detectLanguage, getVoiceSettings } from "@/utils/language-detector"

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const lastSpokenMessageRef = useRef<string>("")
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isManualStopRef = useRef(false)

  // 🚀 MEJORADO: Cleanup más robusto
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("🔇 Página recargándose/cerrándose - deteniendo síntesis de voz")
      isManualStopRef.current = true
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("🔇 Página oculta - deteniendo síntesis de voz")
        isManualStopRef.current = true
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel()
          setIsSpeaking(false)
        }
      }
    }

    const handlePageHide = () => {
      console.log("🔇 Página ocultándose - deteniendo síntesis de voz")
      isManualStopRef.current = true
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
      isManualStopRef.current = true
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [])

  // 🚀 NUEVO: Función helper para limpiar utterance anterior
  const cleanupCurrentUtterance = useCallback(() => {
    if (currentUtteranceRef.current) {
      // Remover event listeners para evitar callbacks fantasma
      currentUtteranceRef.current.onstart = null
      currentUtteranceRef.current.onend = null
      currentUtteranceRef.current.onerror = null
      currentUtteranceRef.current = null
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      // Evitar reproducir el mismo mensaje múltiples veces (solo para auto-reproducción)
      if (lastSpokenMessageRef.current === text) {
        console.log("🔇 Mensaje ya reproducido, saltando:", text.substring(0, 30) + "...")
        return
      }

      if ("speechSynthesis" in window) {
        try {
          // Limpiar utterance anterior
          cleanupCurrentUtterance()

          // Cancel any ongoing speech
          isManualStopRef.current = true
          window.speechSynthesis.cancel()

          // Pequeño delay para asegurar que se cancele completamente
          setTimeout(() => {
            isManualStopRef.current = false

            // Detectar idioma automáticamente
            const detectedLanguage = detectLanguage(text)
            const voiceSettings = getVoiceSettings(detectedLanguage)

            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = detectedLanguage
            utterance.rate = voiceSettings.rate
            utterance.pitch = voiceSettings.pitch

            // Guardar referencia
            currentUtteranceRef.current = utterance

            utterance.onstart = () => {
              if (!isManualStopRef.current) {
                console.log("🔊 Alfred comenzó a hablar")
                setIsSpeaking(true)
                lastSpokenMessageRef.current = text
              }
            }

            utterance.onend = () => {
              if (!isManualStopRef.current) {
                console.log("🔇 Alfred terminó de hablar")
              }
              setIsSpeaking(false)
              cleanupCurrentUtterance()
            }

            utterance.onerror = (event) => {
              // 🚀 MEJORADO: Solo loggear errores que no sean interrupciones manuales
              if (!isManualStopRef.current && event.error !== "interrupted") {
                console.error("❌ Error en síntesis de voz:", event.error)
              } else if (event.error === "interrupted" && !isManualStopRef.current) {
                console.log("⚠️ Síntesis interrumpida (posiblemente por nueva síntesis)")
              }
              setIsSpeaking(false)
              cleanupCurrentUtterance()
            }

            console.log("🎤 Iniciando síntesis de voz para:", text.substring(0, 50) + "...")
            window.speechSynthesis.speak(utterance)
          }, 100) // Delay de 100ms para asegurar cancelación completa
        } catch (error) {
          console.error("❌ Error al iniciar síntesis de voz:", error)
          setIsSpeaking(false)
          cleanupCurrentUtterance()
        }
      }
    },
    [cleanupCurrentUtterance],
  )

  // Función específica para repetir que bypasea la verificación de duplicados
  const repeatSpeak = useCallback(
    (text: string) => {
      if ("speechSynthesis" in window) {
        try {
          // Limpiar utterance anterior
          cleanupCurrentUtterance()

          // Cancel any ongoing speech
          isManualStopRef.current = true
          window.speechSynthesis.cancel()

          // Delay para asegurar cancelación
          setTimeout(() => {
            isManualStopRef.current = false

            // Detectar idioma automáticamente
            const detectedLanguage = detectLanguage(text)
            const voiceSettings = getVoiceSettings(detectedLanguage)

            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = detectedLanguage
            utterance.rate = voiceSettings.rate
            utterance.pitch = voiceSettings.pitch

            // Guardar referencia
            currentUtteranceRef.current = utterance

            utterance.onstart = () => {
              if (!isManualStopRef.current) {
                console.log("🔊 Alfred comenzó a repetir")
                setIsSpeaking(true)
              }
            }

            utterance.onend = () => {
              if (!isManualStopRef.current) {
                console.log("🔇 Alfred terminó de repetir")
              }
              setIsSpeaking(false)
              cleanupCurrentUtterance()
            }

            utterance.onerror = (event) => {
              // Solo loggear errores que no sean interrupciones manuales
              if (!isManualStopRef.current && event.error !== "interrupted") {
                console.error("❌ Error en repetición de voz:", event.error)
              } else if (event.error === "interrupted" && !isManualStopRef.current) {
                console.log("⚠️ Repetición interrumpida (posiblemente por nueva síntesis)")
              }
              setIsSpeaking(false)
              cleanupCurrentUtterance()
            }

            console.log("🔄 Repitiendo síntesis de voz para:", text.substring(0, 50) + "...")
            window.speechSynthesis.speak(utterance)
          }, 100)
        } catch (error) {
          console.error("❌ Error al repetir síntesis de voz:", error)
          setIsSpeaking(false)
          cleanupCurrentUtterance()
        }
      }
    },
    [cleanupCurrentUtterance],
  )

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      console.log("🛑 Deteniendo síntesis de voz manualmente")
      isManualStopRef.current = true
      cleanupCurrentUtterance()
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [cleanupCurrentUtterance])

  const clearLastSpoken = useCallback(() => {
    lastSpokenMessageRef.current = ""
  }, [])

  return { speak, repeatSpeak, stop, isSpeaking, clearLastSpoken }
}
