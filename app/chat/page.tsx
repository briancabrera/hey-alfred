"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Zap, VolumeX, Globe, ChevronDown, Volume2, RotateCcw, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useChat } from "ai/react"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/utils/translations"

import {
  detectLanguage,
  detectUnsupportedLanguage,
  getLanguageName,
  isLanguageSupported,
} from "@/utils/language-detector"

// 🚀 NUEVO: Constantes para localStorage
const STORAGE_KEYS = {
  MESSAGES: "alfred-conversation-messages",
  USER_LANGUAGE: "alfred-user-language",
  ALFRED_LANGUAGE: "alfred-alfred-language",
  LAST_PROCESSED_ID: "alfred-last-processed-id",
}

// Selector de idioma estilo Pip-Boy
const PipBoyLanguageSelector = () => {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
      {/* Trigger Button - más compacto */}
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

            {/* Footer compacto */}
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

// Visualizador de audio con barras de sonido
const AlfredAudioVisualizer = ({ isActive, isSpeaking }: { isActive: boolean; isSpeaking: boolean }) => {
  // Generar 12 barras con diferentes alturas y delays
  const bars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    baseHeight: 15 + Math.random() * 25, // Altura base entre 15-40 (antes 20-60)
    maxHeight: 40 + Math.random() * 50, // Altura máxima entre 40-90 (antes 60-140)
    delay: Math.random() * 0.5, // Delay aleatorio hasta 0.5s
    speed: 0.5 + Math.random() * 0.3, // Velocidad entre 0.5-0.8s
  }))

  return (
    <div className="relative w-48 h-32 mx-auto flex items-center justify-center">
      {/* Contenedor de barras */}
      <div className="flex items-end space-x-1 h-24">
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            className="bg-white rounded-t-sm"
            style={{
              width: "8px",
              minHeight: "8px",
            }}
            animate={
              isSpeaking
                ? {
                    height: [
                      `${bar.baseHeight}px`,
                      `${bar.maxHeight}px`,
                      `${bar.baseHeight * 0.7}px`,
                      `${bar.maxHeight * 0.8}px`,
                      `${bar.baseHeight}px`,
                    ],
                  }
                : isActive
                  ? {
                      height: [`${bar.baseHeight * 0.3}px`, `${bar.baseHeight * 0.6}px`, `${bar.baseHeight * 0.3}px`],
                      boxShadow: ["0 0 3px #ffffff", "0 0 8px #ffffff", "0 0 3px #ffffff"],
                    }
                  : {
                      height: `${bar.baseHeight * 0.2}px`,
                      boxShadow: "0 0 2px #ffffff",
                    }
            }
            transition={{
              duration: bar.speed,
              repeat: isSpeaking || isActive ? Number.POSITIVE_INFINITY : 0,
              delay: bar.delay,
              ease: "easeInOut",
              // Transiciones suaves solo cuando cambia el estado, no durante la animación
              ...(isSpeaking || isActive
                ? {}
                : {
                    type: "spring",
                    stiffness: 80,
                    damping: 12,
                    mass: 0.6,
                  }),
            }}
          />
        ))}
      </div>

      {/* Texto A.L.F.R.E.D - ABAJO de las barras */}
      <motion.div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center"
        animate={{
          textShadow: ["0 0 5px #ffffff", "0 0 10px #ffffff", "0 0 5px #ffffff"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <div className="text-white font-mono text-sm tracking-wider font-bold">A.L.F.R.E.D</div>
      </motion.div>
    </div>
  )
}

// Actualizar el componente TerminalMessage para mostrar el tag correcto:

const TerminalMessage = ({
  message,
  isUser,
  userLang,
  alfredLang,
}: {
  message: any
  isUser: boolean
  userLang: string
  alfredLang: string
}) => {
  const { t } = useLanguage()
  const displayLang = isUser ? userLang : alfredLang
  const displayName = getLanguageName(displayLang)

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`mb-3 xl:mb-4 font-mono text-xs xl:text-sm ${isUser ? "text-right" : "text-left"}`}
    >
      <div className={`inline-block max-w-[90%] xl:max-w-[80%] ${isUser ? "text-white" : "text-white"}`}>
        <div className="text-xs opacity-70 mb-1">
          {isUser ? "{'>'} USER_INPUT" : "{'>'} ALFRED_RESPONSE"}
          <span className="ml-2 text-amber-300">[{displayName}]</span>
        </div>
        <div className={`p-2 xl:p-3 border ${isUser ? "border-white/30" : "border-slate-500/50"} bg-black/50`}>
          {message.content}
        </div>
      </div>
    </motion.div>
  )
}

// Botón estilo Pip-Boy
const PipBoyButton = ({
  children,
  onClick,
  active = false,
  disabled = false,
  variant = "default",
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  variant?: "default" | "danger" | "warning"
}) => {
  const colors = {
    default: "border-emerald-500 text-emerald-400 hover:bg-emerald-400/10",
    danger: "border-red-400 text-red-400 hover:bg-red-400/10",
    warning: "border-amber-300 text-amber-300 hover:bg-amber-300/10",
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-3 py-2 border-2 bg-black/50 font-mono text-sm transition-all duration-300
        ${colors[variant]}
        ${active ? "bg-emerald-400/20" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  )
}

// 🚀 NUEVO: Componente para el botón de reset con confirmación
const ResetConversationButton = ({ onReset }: { onReset: () => void }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const { t } = useLanguage()

  const handleReset = () => {
    if (!showConfirm) {
      setShowConfirm(true)
      // Auto-cancelar después de 3 segundos
      setTimeout(() => setShowConfirm(false), 3000)
    } else {
      onReset()
      setShowConfirm(false)
    }
  }

  return (
    <div className="w-28 xl:w-36">
      <PipBoyButton onClick={handleReset} variant={showConfirm ? "danger" : "warning"}>
        <div className="flex items-center justify-center space-x-1 xl:space-x-2">
          {showConfirm ? <Trash2 className="w-3 h-3 xl:w-4 xl:h-4" /> : <RotateCcw className="w-3 h-3 xl:w-4 xl:h-4" />}
          <span className="text-xs xl:text-sm">{showConfirm ? "CONFIRM?" : "RESET"}</span>
        </div>
      </PipBoyButton>
    </div>
  )
}

export default function PipBoyInterface() {
  const [isActive, setIsActive] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("es-ES")
  const [userLanguage, setUserLanguage] = useState("es-ES")
  const lastProcessedMessageId = useRef<string>("")
  const [isProcessingUnsupported, setIsProcessingUnsupported] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false) // 🚀 NUEVO: Estado para controlar carga inicial

  const { messages, append, isLoading, setMessages } = useChat()
  const { isRecording, audioBlob, error, startRecording, forceStop, clearRecording } = useAudioRecorder()
  const { speak, stop, isSpeaking } = useTextToSpeech()
  const { t, updateLanguageFromDetection } = useLanguage()

  // 🚀 NUEVO: Funciones para persistencia
  const saveToLocalStorage = (messages: any[], userLang: string, alfredLang: string, lastProcessedId: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
      localStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, userLang)
      localStorage.setItem(STORAGE_KEYS.ALFRED_LANGUAGE, alfredLang)
      localStorage.setItem(STORAGE_KEYS.LAST_PROCESSED_ID, lastProcessedId)
      console.log("💾 Conversación guardada en localStorage:", {
        messages: messages.length,
        userLang,
        alfredLang,
        lastProcessedId,
      })
    } catch (error) {
      console.error("❌ Error guardando en localStorage:", error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
      const savedUserLang = localStorage.getItem(STORAGE_KEYS.USER_LANGUAGE)
      const savedAlfredLang = localStorage.getItem(STORAGE_KEYS.ALFRED_LANGUAGE)
      const savedLastProcessedId = localStorage.getItem(STORAGE_KEYS.LAST_PROCESSED_ID)

      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        console.log("📂 Cargando conversación desde localStorage:", {
          messages: parsedMessages.length,
          userLang: savedUserLang,
          alfredLang: savedAlfredLang,
          lastProcessedId: savedLastProcessedId,
        })

        setMessages(parsedMessages)
        if (savedUserLang) setUserLanguage(savedUserLang)
        if (savedAlfredLang) setCurrentLanguage(savedAlfredLang)
        if (savedLastProcessedId) lastProcessedMessageId.current = savedLastProcessedId

        return true // Indica que se cargaron datos
      }
    } catch (error) {
      console.error("❌ Error cargando desde localStorage:", error)
    }
    return false // No se cargaron datos
  }

  const clearLocalStorage = () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      console.log("🗑️ localStorage limpiado completamente")
    } catch (error) {
      console.error("❌ Error limpiando localStorage:", error)
    }
  }

  // 🚀 NUEVO: Cargar conversación al inicializar
  useEffect(() => {
    console.log("🚀 Inicializando interfaz de Alfred...")
    const hasData = loadFromLocalStorage()
    setIsLoaded(true)

    if (hasData) {
      console.log("✅ Conversación anterior restaurada")
    } else {
      console.log("🆕 Nueva sesión iniciada")
    }
  }, [setMessages])

  // 🚀 NUEVO: Guardar conversación cada vez que cambian los mensajes
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      saveToLocalStorage(messages, userLanguage, currentLanguage, lastProcessedMessageId.current)
    }
  }, [messages, userLanguage, currentLanguage, isLoaded])

  // 🚀 NUEVO: Función para resetear conversación
  const resetConversation = () => {
    console.log("🔄 Reseteando conversación completa...")

    // Detener cualquier síntesis de voz
    if (isSpeaking) {
      stop()
    }

    // Limpiar estados
    setMessages([])
    setCurrentLanguage("es-ES")
    setUserLanguage("es-ES")
    setIsProcessingUnsupported(false)
    lastProcessedMessageId.current = ""

    // Limpiar localStorage
    clearLocalStorage()

    console.log("✅ Conversación reseteada completamente")
  }

  // Cleanup adicional al desmontar el componente principal
  useEffect(() => {
    return () => {
      console.log("🔇 Componente principal desmontándose - limpieza final")
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Función para crear mensaje de idioma no soportado
  const createUnsupportedLanguageMessage = (detectedLang: string) => {
    const unsupportedMessage = `Lo siento, pero no estoy configurado para comunicarme en ese idioma. Actualmente solo puedo conversar en estos 5 idiomas: español, english, português, français, italiano.`

    return {
      id: `unsupported-${Date.now()}`,
      role: "assistant" as const,
      content: unsupportedMessage,
      createdAt: new Date(),
    }
  }

  // Función personalizada para manejar append con detección de idioma
  const handleAppendWithLanguageCheck = async (message: { role: "user" | "assistant"; content: string }) => {
    if (message.role === "user") {
      console.log("🎯 Detectando idioma para mensaje del usuario:", message.content.substring(0, 50) + "...")

      // Detectar idioma antes de enviar
      const detectedLang = detectLanguage(message.content)
      const unsupportedLang = detectUnsupportedLanguage(message.content)

      if (unsupportedLang || !isLanguageSupported(detectedLang)) {
        console.log(`🚫 Frontend: Idioma no soportado detectado: ${unsupportedLang || detectedLang}`)

        // Agregar mensaje del usuario inmediatamente
        const userMessage = {
          id: `user-${Date.now()}`,
          role: "user" as const,
          content: message.content,
          createdAt: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setUserLanguage(detectedLang)

        // Activar estado de procesamiento
        setIsProcessingUnsupported(true)

        // Simular tiempo de procesamiento de Alfred (1.5-2.5 segundos)
        const processingTime = 1500 + Math.random() * 1000 // Entre 1.5 y 2.5 segundos

        setTimeout(() => {
          // Crear respuesta de idioma no soportado después del delay
          const unsupportedResponse = createUnsupportedLanguageMessage(unsupportedLang || detectedLang)
          setMessages((prev) => [...prev, unsupportedResponse])
          setCurrentLanguage("es-ES") // La respuesta está en español
          setIsProcessingUnsupported(false) // Desactivar estado de procesamiento
        }, processingTime)

        return
      }

      console.log("✅ Idioma soportado detectado:", detectedLang)
      setUserLanguage(detectedLang)
    }

    // Si el idioma es soportado, usar el append normal
    try {
      await append(message)
    } catch (error: any) {
      // Manejar error del backend si detecta idioma no soportado
      if (error?.message?.includes("UNSUPPORTED_LANGUAGE")) {
        console.log("🚫 Backend: Error de idioma no soportado capturado")
        const unsupportedResponse = createUnsupportedLanguageMessage("unknown")
        setMessages((prev) => [...prev, unsupportedResponse])
        setCurrentLanguage("es-ES")
      } else {
        console.error("Error en chat:", error)
      }
    }
  }

  const handleMicClick = async () => {
    if (isRecording) {
      forceStop()
    } else if (audioBlob) {
      // Transcribir audio
      try {
        console.log("🎤 Starting transcription process...")

        const formData = new FormData()
        formData.append("audio", audioBlob, "recording.webm")

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        })

        console.log(`📡 Transcription API response: ${response.status} ${response.statusText}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          console.error("❌ Transcription API error:", response.status, errorData)
          throw new Error(`Transcription failed: ${response.status} - ${errorData.error || response.statusText}`)
        }

        const result = await response.json()
        console.log("✅ Transcription result:", result)

        // Check if we got a valid transcription
        if (result.text && result.text.trim()) {
          console.log("🎯 Valid transcription received, sending to chat...")
          await handleAppendWithLanguageCheck({ role: "user", content: result.text })
          clearRecording()
        } else {
          console.warn("⚠️ Empty transcription result")
          throw new Error("No valid text was transcribed from the audio")
        }
      } catch (error) {
        console.error("💥 Transcription error:", error)

        // Show user-friendly error message
        const errorMessage = error instanceof Error ? error.message : "Unknown transcription error"

        // You can add a toast notification here or update UI state to show the error
        // For now, just clear the recording so user can try again
        clearRecording()

        // Optionally, you could set an error state to show in the UI
        // setTranscriptionError(errorMessage)
      }
    } else {
      // Mutear a Alfred antes de comenzar a grabar
      if (isSpeaking) {
        stop()
      }
      startRecording()
    }
  }

  const getMicButtonState = () => {
    if (audioBlob && !isRecording) return { icon: Zap, text: t.transmit || "TRANSMIT", variant: "default" as const }
    if (isRecording) return { icon: MicOff, text: t.stopRecording || "STOP_REC", variant: "danger" as const }
    return { icon: Mic, text: t.record || "RECORD", variant: "default" as const }
  }

  const micState = getMicButtonState()

  // Auto-speak assistant responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (
      lastMessage &&
      lastMessage.role === "assistant" &&
      lastMessage.id !== lastProcessedMessageId.current &&
      !isSpeaking &&
      !isLoading &&
      isLoaded // 🚀 NUEVO: Solo hablar si ya se cargó la conversación
    ) {
      lastProcessedMessageId.current = lastMessage.id

      // No hablar si es un mensaje de idioma no soportado
      const isUnsupportedLanguageMessage = lastMessage.content.includes(
        "Lo siento, pero no estoy configurado para comunicarme en ese idioma",
      )

      if (!isUnsupportedLanguageMessage) {
        console.log("🎯 Detectando idioma para respuesta de Alfred:", lastMessage.content.substring(0, 50) + "...")
        const detectedLang = detectLanguage(lastMessage.content)
        console.log("✅ Idioma detectado para Alfred:", detectedLang)
        setCurrentLanguage(detectedLang)
        speak(lastMessage.content)
      } else {
        console.log("🔇 Mensaje de idioma no soportado - no se reproducirá con voz")
        setCurrentLanguage("es-ES")
      }
    }
  }, [messages, isSpeaking, isLoading, speak, isLoaded])

  // Limpiar referencia cuando se inicia nueva conversación
  useEffect(() => {
    if (messages.length === 0 && isLoaded) {
      lastProcessedMessageId.current = ""
      setCurrentLanguage("es-ES")
      setUserLanguage("es-ES")
      setIsProcessingUnsupported(false) // Limpiar estado de procesamiento
    }
  }, [messages.length, isLoaded])

  // Función para hacer scroll al final del contenedor de mensajes
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    }, 100)
  }

  // Hacer scroll al bottom cada vez que hay un nuevo mensaje
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 🚀 NUEVO: Mostrar loading mientras se carga la conversación
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center relative overflow-hidden">
        {/* CRT Screen Effect */}
        <div className="absolute inset-0 bg-gradient-radial from-green-900/10 via-transparent to-black/50"></div>

        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="h-full w-full bg-gradient-to-b from-transparent via-green-400/5 to-transparent bg-repeat-y animate-pulse"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px)",
              animation: "scanlines 0.1s linear infinite",
            }}
          ></div>
        </div>

        <div className="text-center relative z-10">
          <div className="text-6xl mb-4">🤖</div>
          <div className="text-xl mb-4">LOADING A.L.F.R.E.D...</div>
          <div className="flex space-x-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-slate-200 font-mono overflow-hidden relative">
      {/* CRT Screen Effect - Igual que en home */}
      <div className="absolute inset-0 bg-gradient-radial from-green-900/10 via-transparent to-black/50"></div>

      {/* Scanlines Effect - Igual que en home */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="h-full w-full bg-gradient-to-b from-transparent via-green-400/5 to-transparent bg-repeat-y animate-pulse"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px)",
            animation: "scanlines 0.1s linear infinite",
          }}
        ></div>
      </div>

      {/* Contenedor principal responsive */}
      <div className="relative z-10 h-screen flex flex-col xl:flex-row">
        {/* Panel izquierdo - Responsive */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="
          w-full xl:w-80 
          bg-black/80 border-b-2 xl:border-b-0 xl:border-r-2 border-slate-500/50 
          p-4 xl:p-6
          order-1 xl:order-1
          flex-shrink-0
        "
        >
          {/* Header responsive */}
          <div className="text-center mb-4 xl:mb-8">
            <motion.h1
              className="text-xl xl:text-2xl font-bold tracking-wider mb-2 text-white"
              animate={{ textShadow: ["0 0 5px #ffffff", "0 0 10px #ffffff", "0 0 5px #ffffff"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              A.L.F.R.E.D
            </motion.h1>
            <div className="text-xs opacity-70 text-white hidden xl:block">{t.alfredSubtitle1}</div>
            <div className="text-xs opacity-70 text-white hidden xl:block">{t.alfredSubtitle2}</div>
          </div>

          {/* Avatar responsive */}
          <div className="mb-4 xl:mb-10 flex justify-center xl:block">
            <div className="scale-75 xl:scale-100">
              <AlfredAudioVisualizer
                isActive={isActive || isLoading || isProcessingUnsupported}
                isSpeaking={isSpeaking}
              />
            </div>
          </div>

          {/* Status Panel responsive */}
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
                    <span className="text-xs text-amber-300 font-bold">
                      {getLanguageName(userLanguage).slice(0, 3)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white font-medium">MEMORY:</span>
                    <span className="text-xs text-cyan-300 font-bold">
                      {messages.length > 0 ? `${messages.length} MSGS` : "EMPTY"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white font-medium">AI:</span>
                    <span className="text-xs text-cyan-300 font-bold">
                      {getLanguageName(currentLanguage).slice(0, 3)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white font-medium">VOICE:</span>
                    <span className="text-xs text-white font-bold">{isSpeaking ? "SPEAK" : "READY"}</span>
                  </div>

                </div>
              </div>

              {/* Desktop: Layout de dos columnas como en la imagen */}
              <div className="hidden xl:block space-y-3">
                {/* SYSTEM_STATUS */}

                {/* USER_LANG */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white font-medium tracking-wider">USER_LANG:</span>
                  <span className="text-sm text-amber-300 font-bold tracking-wider">
                    {getLanguageName(userLanguage)}
                  </span>
                </div>

                {/* AI_LANG */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white font-medium tracking-wider">AI_LANG:</span>
                  <span className="text-sm text-cyan-300 font-bold tracking-wider">
                    {getLanguageName(currentLanguage)}
                  </span>
                </div>

                {/* VOICE_MODE */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white font-medium tracking-wider">VOICE_MODE:</span>
                  <span className="text-sm text-white font-bold tracking-wider">
                    {isSpeaking ? "SPEAKING" : "READY"}
                  </span>
                </div>

                {/* MEMORY */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white font-medium tracking-wider">MEMORY:</span>
                  <span className="text-sm text-cyan-300 font-bold tracking-wider">
                    {messages.length > 0 ? `${messages.length} MSGS` : "EMPTY"}
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
        </motion.div>

        {/* Panel principal - Responsive */}
        <div className="flex-1 flex flex-col order-2 xl:order-2 min-h-0">
          {/* Header del terminal responsive */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="bg-black/80 border-b-2 border-slate-500/50 p-2 xl:p-4 flex-shrink-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 xl:space-x-4">
                <div className="text-sm xl:text-xl font-bold text-white">DIALOGUE_TERMINAL</div>
                <motion.div
                  className="text-amber-300 text-xs opacity-70 hidden md:block"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  [REAL-TIME_COMMUNICATION_ACTIVE]
                </motion.div>
              </div>

              <div className="flex items-center space-x-2 xl:space-x-4 text-white text-xs">
                <div className="hidden sm:block">MSGS: {messages.length}</div>
                <div>STATUS: {isLoading || isProcessingUnsupported ? "PROC" : "READY"}</div>
                <div className="text-cyan-300 hidden xl:block">💾 PERSISTENT</div>
              </div>
            </div>
          </motion.div>

          {/* Área de mensajes responsive */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-3 xl:p-6 overflow-y-auto bg-black/60 pipboy-scrollbar min-h-0"
          >
            {/* Contenido de mensajes igual pero con padding responsive */}
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-10 xl:mt-20">
                  <div className="text-4xl xl:text-6xl mb-4">🤖</div>
                  <div className="text-xl xl:text-xl mb-4 text-white">
                    {t.systemInitialized || "SYSTEM_INITIALIZED"}
                  </div>
                  <div className="text-sm opacity-70 mb-4 xl:mb-8 text-white">
                    {t.alsoKnownAs || "A.L.F.R.E.D READY FOR COMMUNICATION"}
                  </div>
                  <div className="text-xs space-y-1 xl:space-y-2 max-w-sm xl:max-w-md mx-auto text-white px-4">
                    <div>{">"} LANGUAGES: ES | EN | FR | IT | PT</div>
                    <div className="hidden xl:block">{">"} VOICE_MODE: RECORD → STOP → TRANSMIT</div>
                    <div className="xl:hidden">{">"} VOICE: REC → STOP → SEND</div>
                    <div className="hidden xl:block">{">"} REAL_TIME_TRANSLATION: ENABLED</div>
                    <div className="text-cyan-300">{">"} CONVERSATION_PERSISTENCE: ACTIVE</div>
                    <div className="text-amber-300">
                      {">"} {t.tryExample || 'TRY: "Hello Alfred"'}
                    </div>
                  </div>
                </motion.div>
              ) : (
                messages.map((message) => (
                  <TerminalMessage
                    key={message.id}
                    message={message}
                    isUser={message.role === "user"}
                    userLang={userLanguage}
                    alfredLang={currentLanguage}
                  />
                ))
              )}
            </AnimatePresence>

            {/* Indicador de carga igual */}
            <AnimatePresence>
              {(isLoading || isProcessingUnsupported) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <div className="text-sm text-amber-300">
                    <div className="mb-1">
                      {">"} {t.processing || "ALFRED_PROCESSING..."}
                    </div>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-amber-300 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controles responsive */}
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-black/80 border-t-2 border-slate-500/50 p-2 xl:p-4 flex-shrink-0"
          >
            {/* Botones principales responsive */}
            <div className="flex justify-center items-center space-x-2 xl:space-x-3 mb-3 xl:mb-4 flex-wrap gap-2 xl:gap-3">
              {/* Botón principal de micrófono responsive */}
              <div className="w-28 xl:w-36">
                <PipBoyButton onClick={handleMicClick} active={isRecording || !!audioBlob} variant={micState.variant}>
                  <div className="flex items-center justify-center space-x-1 xl:space-x-2">
                    <micState.icon className="w-3 h-3 xl:w-4 xl:h-4" />
                    <span className="text-xs xl:text-sm">{micState.text}</span>
                  </div>
                </PipBoyButton>
              </div>

              {/* Botón MUTE responsive */}
              <div className="w-28 xl:w-36">
                <PipBoyButton onClick={stop} disabled={!isSpeaking} variant="danger">
                  <div className="flex items-center justify-center space-x-1 xl:space-x-2">
                    <VolumeX className="w-3 h-3 xl:w-4 xl:h-4" />
                    <span className="text-xs xl:text-sm">{t.mute || "MUTE"}</span>
                  </div>
                </PipBoyButton>
              </div>

              {/* Resto de botones con tamaños responsive similares */}
              <AnimatePresence>
                {audioBlob && !isRecording && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-28 xl:w-36"
                  >
                    <PipBoyButton
                      onClick={() => {
                        if (audioBlob) {
                          const audioUrl = URL.createObjectURL(audioBlob)
                          const audio = new Audio(audioUrl)
                          audio.play().catch(console.error)
                          audio.onended = () => {
                            URL.revokeObjectURL(audioUrl)
                          }
                        }
                      }}
                      variant="warning"
                    >
                      <div className="flex items-center justify-center space-x-1 xl:space-x-2">
                        <Volume2 className="w-3 h-3 xl:w-4 xl:h-4" />
                        <span className="text-xs xl:text-sm">PREVIEW</span>
                      </div>
                    </PipBoyButton>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón REPETIR responsive */}
              {!isRecording && !audioBlob && (
                <div className="w-28 xl:w-36">
                  <PipBoyButton
                    onClick={() => {
                      const lastMessage = messages[messages.length - 1]
                      if (lastMessage && lastMessage.role === "assistant") {
                        speak(lastMessage.content)
                      }
                    }}
                    disabled={!messages.length || messages[messages.length - 1]?.role !== "assistant"}
                    variant="warning"
                  >
                    <div className="flex items-center justify-center space-x-1 xl:space-x-2">
                      <Volume2 className="w-3 h-3 xl:w-4 xl:h-4" />
                      <span className="text-xs xl:text-sm">{t.repeat || "REPEAT"}</span>
                    </div>
                  </PipBoyButton>
                </div>
              )}

              {/* Botón RE_RECORD responsive */}
              <AnimatePresence>
                {audioBlob && !isRecording && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="w-28 xl:w-36"
                  >
                    <PipBoyButton
                      onClick={() => {
                        clearRecording()
                      }}
                      variant="warning"
                    >
                      <div className="flex items-center justify-center space-x-1 xl:space-x-2">
                        <Mic className="w-3 h-3 xl:w-4 xl:h-4" />
                        <span className="text-xs xl:text-sm">RE_REC</span>
                      </div>
                    </PipBoyButton>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón RESET responsive */}
              {!isRecording && !audioBlob && (
                <div className="w-28 xl:w-36">
                  <ResetConversationButton onReset={resetConversation} />
                </div>
              )}
            </div>

            {/* Indicadores de estado responsive */}
            <div className="h-12 xl:h-16 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isRecording && (
                  <motion.div
                    key="recording"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-sm xl:max-w-md p-2 xl:p-3 border border-red-400/50 bg-red-400/10 rounded"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        className="w-2 h-2 xl:w-3 xl:h-3 bg-red-400 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <span className="text-xs text-red-400 font-mono">
                        {t.recordingAudio || "RECORDING..."} (Tap to stop)
                      </span>
                    </div>
                  </motion.div>
                )}

                {audioBlob && !isRecording && (
                  <motion.div
                    key="captured"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-sm xl:max-w-md p-2 xl:p-3 border border-amber-300/50 bg-amber-300/10 rounded"
                  >
                    <div className="text-center">
                      <div className="text-xs text-amber-300 font-mono">
                        ✓ {t.audioCaptured || "AUDIO_CAPTURED"}: {Math.round(audioBlob.size / 1024)}KB
                      </div>
                      <div className="text-xs text-amber-300 mt-1 font-mono">PRESS_TRANSMIT_TO_SEND</div>
                    </div>
                  </motion.div>
                )}

                {!isRecording && !audioBlob && (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-sm xl:max-w-md p-2 xl:p-3 border border-slate-500/30 bg-slate-600/5 rounded"
                  >
                    <div className="text-center">
                      <div className="text-xs text-white font-mono opacity-70">🎤 VOICE_INTERFACE_READY</div>
                      <div className="text-xs text-white mt-1 font-mono opacity-50">💾 CONVERSATION_PERSISTENT</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer responsive */}
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-black/80 border-t-2 border-slate-500/50 p-2 xl:p-4 flex-shrink-0"
          >
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex space-x-2 xl:space-x-6 overflow-x-auto">
                <div className="whitespace-nowrap">{t.neuralEngine || "ENGINE"}: GROQ</div>
                <div className="whitespace-nowrap hidden sm:block">{t.linguisticModel || "MODEL"}: LLAMA_3.1</div>
                <div className="whitespace-nowrap hidden md:block">{t.audioProcessor || "AUDIO"}: WHISPER_V3</div>
                <div className="text-cyan-300 whitespace-nowrap hidden xl:block">STORAGE: LOCAL_PERSISTENT</div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <motion.div
                  className="w-1.5 h-1.5 xl:w-2 xl:h-2 bg-white rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <span className="hidden sm:block">QUANTUM_LINK_STABLE</span>
                <span className="sm:hidden">STABLE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Error overlay igual */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-900/20 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-black border-2 border-red-400 p-4 xl:p-6 max-w-sm xl:max-w-md w-full"
            >
              <div className="text-red-400 font-mono">
                <div className="text-base xl:text-xl mb-2">SYSTEM_ERROR</div>
                <div className="text-sm">{error}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos igual pero con media queries adicionales */}
      <style jsx global>{`
        @keyframes scanlines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }

        /* Responsive scrollbar */
        @media (max-width: 1024px) {
          .pipboy-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
        }

        @media (max-width: 640px) {
          .pipboy-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }

        /* Resto de estilos de scrollbar igual... */

        /* Scrollbar personalizado con estética de barras de sonido */
        .pipboy-scrollbar::-webkit-scrollbar {
          width: 14px;
          background: rgba(0, 0, 0, 0.9);
          border-left: 1px solid rgba(255, 255, 255, 0.3);
        }

        .pipboy-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.95);
          border-radius: 0;
          position: relative;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.1);
        }

        /* Efecto de barras segmentadas en el track */
        .pipboy-scrollbar::-webkit-scrollbar-track::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 8px,
            rgba(255, 255, 255, 0.1) 8px,
            rgba(255, 255, 255, 0.1) 10px
          );
          pointer-events: none;
        }

        .pipboy-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0.9) 20%,
            rgba(255, 255, 255, 0.7) 40%,
            rgba(255, 255, 255, 0.9) 60%,
            rgba(255, 255, 255, 0.8) 80%,
            #ffffff 100%
          );
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 0 8px rgba(255, 255, 255, 0.6),
            inset 0 0 4px rgba(255, 255, 255, 0.4),
            inset 2px 0 2px rgba(255, 255, 255, 0.3);
          position: relative;
          min-height: 20px;
        }

        /* Efecto de segmentos en el thumb similar a las barras de sonido */
        .pipboy-scrollbar::-webkit-scrollbar-thumb::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          background-image: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 3px,
            rgba(0, 0, 0, 0.2) 3px,
            rgba(0, 0, 0, 0.2) 4px,
            transparent 4px,
            transparent 7px
          );
          border-radius: 1px;
          pointer-events: none;
        }

        .pipboy-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            rgba(255, 255, 255, 1) 20%,
            rgba(255, 255, 255, 0.8) 40%,
            rgba(255, 255, 255, 1) 60%,
            rgba(255, 255, 255, 0.9) 80%,
            #ffffff 100%
          );
          box-shadow: 
            0 0 12px rgba(255, 255, 255, 0.8),
            inset 0 0 6px rgba(255, 255, 255, 0.6),
            inset 2px 0 3px rgba(255, 255, 255, 0.5);
          border-color: rgba(255, 255, 255, 0.8);
        }

        .pipboy-scrollbar::-webkit-scrollbar-thumb:active {
          background: #ffffff;
          box-shadow: 
            0 0 15px rgba(255, 255, 255, 1),
            inset 0 0 8px rgba(255, 255, 255, 0.8),
            inset 2px 0 4px rgba(255, 255, 255, 0.7);
          border-color: #ffffff;
        }

        /* Esquinas del scrollbar */
        .pipboy-scrollbar::-webkit-scrollbar-corner {
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* Animación pulsante similar a las barras de sonido */
        @keyframes sound-bar-pulse {
          0%, 100% { 
            box-shadow: 
              0 0 8px rgba(255, 255, 255, 0.6),
              inset 0 0 4px rgba(255, 255, 255, 0.4),
              inset 2px 0 2px rgba(255, 255, 255, 0.3);
            background: linear-gradient(
              180deg,
              #ffffff 0%,
              rgba(255, 255, 255, 0.9) 20%,
              rgba(255, 255, 255, 0.7) 40%,
              rgba(255, 255, 255, 0.9) 60%,
              rgba(255, 255, 255, 0.8) 80%,
              #ffffff 100%
            );
          }
          25% { 
            box-shadow: 
              0 0 12px rgba(255, 255, 255, 0.8),
              inset 0 0 6px rgba(255, 255, 255, 0.6),
              inset 2px 0 3px rgba(255, 255, 255, 0.5);
            background: linear-gradient(
              180deg,
              #ffffff 0%,
              rgba(255, 255, 255, 1) 20%,
              rgba(255, 255, 255, 0.8) 40%,
              rgba(255, 255, 255, 1) 60%,
              rgba(255, 255, 255, 0.9) 80%,
              #ffffff 100%
            );
          }
          50% { 
            box-shadow: 
              0 0 15px rgba(255, 255, 255, 1),
              inset 0 0 8px rgba(255, 255, 255, 0.8),
              inset 2px 0 4px rgba(255, 255, 255, 0.7);
            background: #ffffff;
          }
          75% { 
            box-shadow: 
              0 0 12px rgba(255, 255, 255, 0.8),
              inset 0 0 6px rgba(255, 255, 255, 0.6),
              inset 2px 0 3px rgba(255, 255, 255, 0.5);
            background: linear-gradient(
              180deg,
              #ffffff 0%,
              rgba(255, 255, 255, 1) 20%,
              rgba(255, 255, 255, 0.8) 40%,
              rgba(255, 255, 255, 1) 60%,
              rgba(255, 255, 255, 0.9) 80%,
              #ffffff 100%
            );
          }
        }

        .pipboy-scrollbar::-webkit-scrollbar-thumb {
          animation: sound-bar-pulse 2s ease-in-out infinite;
        }

        /* Efecto adicional cuando hay actividad de scroll */
        .pipboy-scrollbar:hover::-webkit-scrollbar-thumb {
          animation: sound-bar-pulse 0.8s ease-in-out infinite;
        }

        /* Para Firefox - usando el color blanco */
        .pipboy-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.8) rgba(0, 0, 0, 0.9);
        }

        /* Efecto de resplandor en el contenedor cuando se hace scroll */
        .pipboy-scrollbar:hover {
          box-shadow: inset 2px 0 4px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
