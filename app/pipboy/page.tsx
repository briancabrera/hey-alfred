"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Zap, VolumeX, Globe, ChevronDown, Volume2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useChat } from "ai/react"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/utils/translations"
// Importar las funciones actualizadas:

import {
  detectLanguage,
  detectUnsupportedLanguage,
  getLanguageDisplayName,
  getLanguageName,
  isLanguageSupported,
} from "@/utils/language-detector"

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
          flex items-center space-x-1 px-2 py-1 border border-green-400/50 bg-black/70 font-mono text-xs
          transition-all duration-300 hover:shadow-md
          ${
            isOpen
              ? "border-yellow-400 text-yellow-400 bg-yellow-400/10 shadow-yellow-400/50"
              : "text-green-400 hover:border-green-400 hover:bg-green-400/10 hover:shadow-green-400/50"
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
            className="absolute top-full right-0 mt-2 min-w-[180px] bg-black/95 border border-green-400/50 shadow-xl shadow-green-400/25 overflow-hidden z-50"
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
                        ? "bg-green-400/20 text-green-300 border-l-2 border-green-400"
                        : "text-green-400 hover:bg-yellow-400/10 hover:text-yellow-300 hover:border-l-2 hover:border-yellow-400"
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
                      className="ml-auto text-green-400 text-xs"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer compacto */}
            <motion.div
              className="border-t border-green-400/30 px-3 py-1 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-xs text-green-400 text-center font-mono tracking-wider">🌐 LANG_SELECT</div>
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
    baseHeight: 20 + Math.random() * 40, // Altura base entre 20-60
    maxHeight: 60 + Math.random() * 80, // Altura máxima entre 60-140
    delay: Math.random() * 0.5, // Delay aleatorio hasta 0.5s
    speed: 0.3 + Math.random() * 0.4, // Velocidad entre 0.3-0.7s
  }))

  return (
    <div className="relative w-48 h-32 mx-auto flex items-center justify-center">
      {/* Contenedor de barras */}
      <div className="flex items-end space-x-1 h-24">
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            className="bg-green-400 rounded-t-sm"
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
                      boxShadow: ["0 0 3px #00ff00", "0 0 8px #00ff00", "0 0 3px #00ff00"],
                    }
                  : {
                      height: `${bar.baseHeight * 0.2}px`,
                      boxShadow: "0 0 2px #00ff00",
                    }
            }
            transition={{
              duration: bar.speed,
              repeat: isSpeaking || isActive ? Number.POSITIVE_INFINITY : 0,
              delay: bar.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Texto A.L.F.R.E.D - ABAJO de las barras */}
      <motion.div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center"
        animate={{
          textShadow: ["0 0 5px #00ff00", "0 0 10px #00ff00", "0 0 5px #00ff00"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <div className="text-green-400 font-mono text-sm tracking-wider font-bold">A.L.F.R.E.D</div>
      </motion.div>
    </div>
  )
}

// Actualizar el componente TerminalMessage para mostrar el tag correcto:

const TerminalMessage = ({ message, isUser }: { message: any; isUser: boolean }) => {
  const { t, currentLanguage } = useLanguage()

  // Detectar idioma y si es no soportado
  const detectedLang = detectLanguage(message.content)
  const unsupportedLang = detectUnsupportedLanguage(message.content)
  const displayName = getLanguageDisplayName(
    detectedLang,
    unsupportedLang,
    currentLanguage.split("-")[0],
    t.unsupported,
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`mb-4 font-mono text-sm ${isUser ? "text-right" : "text-left"}`}
    >
      <div className={`inline-block max-w-[80%] ${isUser ? "text-green-300" : "text-green-400"}`}>
        <div className="text-xs opacity-70 mb-1">
          {isUser ? "{'>'} USER_INPUT" : "{'>'} ALFRED_RESPONSE"}
          <span className={`ml-2 ${unsupportedLang ? "text-red-400" : "text-yellow-400"}`}>[{displayName}]</span>
        </div>
        <div className={`p-3 border ${isUser ? "border-green-300/30" : "border-green-400/50"} bg-black/50`}>
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
    default: "border-green-400 text-green-400 hover:bg-green-400/10",
    danger: "border-red-400 text-red-400 hover:bg-red-400/10",
    warning: "border-yellow-400 text-yellow-400 hover:bg-yellow-400/10",
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-3 py-2 border-2 bg-black/50 font-mono text-sm transition-all duration-300
        ${colors[variant]}
        ${active ? "bg-green-400/20" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  )
}

export default function PipBoyInterface() {
  const [isActive, setIsActive] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("es-ES")
  const [userLanguage, setUserLanguage] = useState("es-ES")
  const lastProcessedMessageId = useRef<string>("")
  const [isProcessingUnsupported, setIsProcessingUnsupported] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { messages, append, isLoading, setMessages } = useChat()
  const { isRecording, audioBlob, error, startRecording, forceStop, clearRecording } = useAudioRecorder()
  const { speak, stop, isSpeaking } = useTextToSpeech()
  const { t, updateLanguageFromDetection } = useLanguage()

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

      setUserLanguage(detectedLang)
      // ELIMINAR: updateLanguageFromDetection(detectedLang)
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
      !isLoading
    ) {
      lastProcessedMessageId.current = lastMessage.id

      // No hablar si es un mensaje de idioma no soportado
      const isUnsupportedLanguageMessage = lastMessage.content.includes(
        "Lo siento, pero no estoy configurado para comunicarme en ese idioma",
      )

      if (!isUnsupportedLanguageMessage) {
        const detectedLang = detectLanguage(lastMessage.content)
        setCurrentLanguage(detectedLang)
        speak(lastMessage.content)
      } else {
        console.log("🔇 Mensaje de idioma no soportado - no se reproducirá con voz")
        setCurrentLanguage("es-ES")
      }
    }
  }, [messages, isSpeaking, isLoading, speak])

  // Limpiar referencia cuando se inicia nueva conversación
  useEffect(() => {
    if (messages.length === 0) {
      lastProcessedMessageId.current = ""
      setCurrentLanguage("es-ES")
      setUserLanguage("es-ES")
      setIsProcessingUnsupported(false) // Limpiar estado de procesamiento
    }
  }, [messages.length])

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

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Fondo con efecto de líneas de escaneo */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            #00ff00 2px,
            #00ff00 4px
          )`,
          }}
        />
      </div>

      {/* Contenedor principal estilo Pip-Boy */}
      <div className="relative z-10 h-screen flex">
        {/* Panel izquierdo - Avatar y controles */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-black/80 border-r-2 border-green-400/50 p-6"
        >
          {/* Header con selector de idioma */}
          <div className="text-center mb-8">
            {/* Header sin selector de idioma */}
            <motion.h1
              className="text-2xl font-bold tracking-wider mb-2"
              animate={{ textShadow: ["0 0 10px #00ff00", "0 0 20px #00ff00", "0 0 10px #00ff00"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              A.L.F.R.E.D
            </motion.h1>
            <div className="text-xs opacity-70">{t.alfredSubtitle1}</div>
            <div className="text-xs opacity-70">{t.alfredSubtitle2}</div>
          </div>

          {/* Avatar */}
          <div className="mb-10">
            <AlfredAudioVisualizer 
              isActive={isActive || isLoading || isProcessingUnsupported} 
              isSpeaking={isSpeaking} 
            />
          </div>

          {/* Status Panel */}
          <Card className="bg-black/50 border-green-400/50 p-4 mb-6">
            <div className="space-y-3">
              {/* Header del Status Panel con selector de idioma */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-green-400/30">
                <span className="text-sm font-bold text-green-400 tracking-wider">SYSTEM_STATUS</span>
                <PipBoyLanguageSelector />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-green-300 font-medium">SYSTEM_STATUS:</span>
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-xs text-green-400 font-bold">{t.systemActive || "ONLINE"}</span>
                </motion.div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-green-300 font-medium">USER_LANG:</span>
                <span className="text-xs text-yellow-400 font-bold">{getLanguageName(userLanguage)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-green-300 font-medium">AI_LANG:</span>
                <span className="text-xs text-cyan-400 font-bold">{getLanguageName(currentLanguage)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-green-300 font-medium">VOICE_MODE:</span>
                <span className="text-xs text-green-400 font-bold">{isSpeaking ? "SPEAKING" : "READY"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-green-300 font-medium">INTERFACE:</span>
                <span className="text-xs text-purple-400 font-bold">PIP-BOY_V3.0</span>
              </div>
            </div>
          </Card>

          {/* Controles */}

          {/* Indicador de grabación */}

          {/* Audio capturado */}
        </motion.div>

        {/* Panel principal - Terminal de conversación */}
        <div className="flex-1 flex flex-col">
          {/* Header del terminal */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="bg-black/80 border-b-2 border-green-400/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-lg font-bold">DIALOGUE_TERMINAL</div>
                <motion.div
                  className="text-xs opacity-70"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  [REAL-TIME_COMMUNICATION_ACTIVE]
                </motion.div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-xs">MSGS: {messages.length}</div>
                <div className="text-xs">STATUS: {isLoading || isProcessingUnsupported ? "PROCESSING" : "READY"}</div>
              </div>
            </div>
          </motion.div>

          {/* Área de mensajes */}
          <div ref={messagesContainerRef} className="flex-1 p-6 overflow-y-auto bg-black/60 pipboy-scrollbar">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-20">
                  <div className="text-6xl mb-4">🤖</div>
                  <div className="text-xl mb-4">{t.systemInitialized || "SYSTEM_INITIALIZED"}</div>
                  <div className="text-sm opacity-70 mb-8">
                    {t.alsoKnownAs || "A.L.F.R.E.D READY FOR COMMUNICATION"}
                  </div>
                  <div className="text-xs space-y-2 max-w-md mx-auto">
                    <div>{">"} SUPPORTED_LANGUAGES: ES | EN | FR | IT | PT</div>
                    <div>{">"} VOICE_MODE: RECORD → STOP → TRANSMIT</div>
                    <div>{">"} REAL_TIME_TRANSLATION: ENABLED</div>
                    <div className="text-yellow-400">
                      {">"} {t.tryExample || 'TRY: "Hello Alfred, how are you?"'}
                    </div>
                  </div>
                </motion.div>
              ) : (
                messages.map((message) => (
                  <TerminalMessage key={message.id} message={message} isUser={message.role === "user"} />
                ))
              )}
            </AnimatePresence>

            {/* Indicador de carga */}
            <AnimatePresence>
              {(isLoading || isProcessingUnsupported) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <div className="text-sm text-yellow-400">
                    <div className="mb-1">
                      {">"} {t.processing || "ALFRED_PROCESSING..."}
                    </div>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-yellow-400 rounded-full"
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

          {/* Controles de interacción - Nueva ubicación */}
          <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-black/80 border-t-2 border-green-400/50 p-4">
            {/* Área de botones principales - Layout adaptativo pero consistente */}
            <div className="flex justify-center items-center space-x-3 mb-4">
              {/* Botón principal de micrófono - Ancho fijo */}
              <div className="w-36">
                <PipBoyButton onClick={handleMicClick} active={isRecording || !!audioBlob} variant={micState.variant}>
                  <div className="flex items-center justify-center space-x-2">
                    <micState.icon className="w-4 h-4" />
                    <span className="text-sm">{micState.text}</span>
                  </div>
                </PipBoyButton>
              </div>

              {/* Botón MUTE - Ancho fijo */}
              <div className="w-36">
                <PipBoyButton onClick={stop} disabled={!isSpeaking} variant="danger">
                  <div className="flex items-center justify-center space-x-2">
                    <VolumeX className="w-4 h-4" />
                    <span className="text-sm">{t.mute || "MUTE_VOICE"}</span>
                  </div>
                </PipBoyButton>
              </div>

              {/* Botón REPETIR - Visible en estado inicial cuando hay respuestas de Alfred */}
              {!isRecording && !audioBlob && (
                <div className="w-36">
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
                    <div className="flex items-center justify-center space-x-2">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm">{t.repeat || "REPEAT"}</span>
                    </div>
                  </PipBoyButton>
                </div>
              )}

              {/* Botón CANCELAR Y VOLVER A GRABAR - Solo visible en paso 3 */}
              <AnimatePresence>
                {audioBlob && !isRecording && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="w-36"
                  >
                    <PipBoyButton
                      onClick={() => {
                        clearRecording()
                      }}
                      variant="warning"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Mic className="w-4 h-4" />
                        <span className="text-sm">RE_RECORD</span>
                      </div>
                    </PipBoyButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Área de indicadores de estado - Altura fija */}
            <div className="h-16 flex items-center justify-center">
              {/* Indicador de grabación */}
              <AnimatePresence mode="wait">
                {isRecording && (
                  <motion.div
                    key="recording"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-md p-3 border border-red-400/50 bg-red-400/10 rounded"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        className="w-3 h-3 bg-red-400 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <span className="text-xs text-red-400 font-mono">
                        {t.recordingAudio || "GRABANDO AUDIO..."} (Presiona para detener)
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Audio capturado */}
                {audioBlob && !isRecording && (
                  <motion.div
                    key="captured"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-md p-3 border border-yellow-400/50 bg-yellow-400/10 rounded"
                  >
                    <div className="text-center">
                      <div className="text-xs text-yellow-400 font-mono">
                        ✓ {t.audioCaptured || "AUDIO_CAPTURADO"}: {Math.round(audioBlob.size / 1024)}KB
                      </div>
                      <div className="text-xs text-yellow-400 mt-1 font-mono">PRESS_TRANSMIT_TO_SEND</div>
                    </div>
                  </motion.div>
                )}

                {/* Estado por defecto - espacio reservado */}
                {!isRecording && !audioBlob && (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-md p-3 border border-green-400/30 bg-green-400/5 rounded"
                  >
                    <div className="text-center">
                      <div className="text-xs text-green-400 font-mono opacity-70">🎤 VOICE_INTERFACE_READY</div>
                      <div className="text-xs text-green-400 mt-1 font-mono opacity-50">PRESS_RECORD_TO_START</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer con información */}
          <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-black/80 border-t-2 border-green-400/50 p-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex space-x-6">
                <div>{t.neuralEngine || "NEURAL_ENGINE"}: GROQ_LPU</div>
                <div>{t.linguisticModel || "MODEL"}: LLAMA_3.1_8B</div>
                <div>{t.audioProcessor || "AUDIO"}: WHISPER_V3</div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <span>QUANTUM_LINK_STABLE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Error overlay */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-900/20 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-black border-2 border-red-400 p-6 max-w-md"
            >
              <div className="text-red-400 font-mono">
                <div className="text-lg mb-2">SYSTEM_ERROR</div>
                <div className="text-sm">{error}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos personalizados para scrollbar estilo barras de sonido */}
      <style jsx global>{`
        /* Scrollbar personalizado con estética de barras de sonido */
        .pipboy-scrollbar::-webkit-scrollbar {
          width: 14px;
          background: rgba(0, 0, 0, 0.9);
          border-left: 1px solid rgba(74, 222, 128, 0.3);
        }

        .pipboy-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.95);
          border-radius: 0;
          position: relative;
          border-left: 1px solid rgba(74, 222, 128, 0.2);
          box-shadow: inset 0 0 3px rgba(74, 222, 128, 0.1);
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
            rgba(74, 222, 128, 0.1) 8px,
            rgba(74, 222, 128, 0.1) 10px
          );
          pointer-events: none;
        }

        .pipboy-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            #4ade80 0%,
            rgba(74, 222, 128, 0.9) 20%,
            rgba(74, 222, 128, 0.7) 40%,
            rgba(74, 222, 128, 0.9) 60%,
            rgba(74, 222, 128, 0.8) 80%,
            #4ade80 100%
          );
          border-radius: 2px;
          border: 1px solid rgba(74, 222, 128, 0.6);
          box-shadow: 
            0 0 8px rgba(74, 222, 128, 0.6),
            inset 0 0 4px rgba(74, 222, 128, 0.4),
            inset 2px 0 2px rgba(74, 222, 128, 0.3);
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
            rgba(255, 255, 255, 0.2) 3px,
            rgba(255, 255, 255, 0.2) 4px,
            transparent 4px,
            transparent 7px
          );
          border-radius: 1px;
          pointer-events: none;
        }

        .pipboy-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            #4ade80 0%,
            rgba(74, 222, 128, 1) 20%,
            rgba(74, 222, 128, 0.8) 40%,
            rgba(74, 222, 128, 1) 60%,
            rgba(74, 222, 128, 0.9) 80%,
            #4ade80 100%
          );
          box-shadow: 
            0 0 12px rgba(74, 222, 128, 0.8),
            inset 0 0 6px rgba(74, 222, 128, 0.6),
            inset 2px 0 3px rgba(74, 222, 128, 0.5);
          border-color: rgba(74, 222, 128, 0.8);
        }

        .pipboy-scrollbar::-webkit-scrollbar-thumb:active {
          background: #4ade80;
          box-shadow: 
            0 0 15px rgba(74, 222, 128, 1),
            inset 0 0 8px rgba(74, 222, 128, 0.8),
            inset 2px 0 4px rgba(74, 222, 128, 0.7);
          border-color: #4ade80;
        }

        /* Esquinas del scrollbar */
        .pipboy-scrollbar::-webkit-scrollbar-corner {
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid rgba(74, 222, 128, 0.3);
        }

        /* Animación pulsante similar a las barras de sonido */
        @keyframes sound-bar-pulse {
          0%, 100% { 
            box-shadow: 
              0 0 8px rgba(74, 222, 128, 0.6),
              inset 0 0 4px rgba(74, 222, 128, 0.4),
              inset 2px 0 2px rgba(74, 222, 128, 0.3);
            background: linear-gradient(
              180deg,
              #4ade80 0%,
              rgba(74, 222, 128, 0.9) 20%,
              rgba(74, 222, 128, 0.7) 40%,
              rgba(74, 222, 128, 0.9) 60%,
              rgba(74, 222, 128, 0.8) 80%,
              #4ade80 100%
            );
          }
          25% { 
            box-shadow: 
              0 0 12px rgba(74, 222, 128, 0.8),
              inset 0 0 6px rgba(74, 222, 128, 0.6),
              inset 2px 0 3px rgba(74, 222, 128, 0.5);
            background: linear-gradient(
              180deg,
              #4ade80 0%,
              rgba(74, 222, 128, 1) 20%,
              rgba(74, 222, 128, 0.8) 40%,
              rgba(74, 222, 128, 1) 60%,
              rgba(74, 222, 128, 0.9) 80%,
              #4ade80 100%
            );
          }
          50% { 
            box-shadow: 
              0 0 15px rgba(74, 222, 128, 1),
              inset 0 0 8px rgba(74, 222, 128, 0.8),
              inset 2px 0 4px rgba(74, 222, 128, 0.7);
            background: #4ade80;
          }
          75% { 
            box-shadow: 
              0 0 12px rgba(74, 222, 128, 0.8),
              inset 0 0 6px rgba(74, 222, 128, 0.6),
              inset 2px 0 3px rgba(74, 222, 128, 0.5);
            background: linear-gradient(
              180deg,
              #4ade80 0%,
              rgba(74, 222, 128, 1) 20%,
              rgba(74, 222, 128, 0.8) 40%,
              rgba(74, 222, 128, 1) 60%,
              rgba(74, 222, 128, 0.9) 80%,
              #4ade80 100%
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

        /* Para Firefox - usando el color #4ade80 */
        .pipboy-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(74, 222, 128, 0.8) rgba(0, 0, 0, 0.9);
        }

        /* Efecto de resplandor en el contenedor cuando se hace scroll */
        .pipboy-scrollbar:hover {
          box-shadow: inset 2px 0 4px rgba(74, 222, 128, 0.2);
        }
      `}</style>\
    </div>
