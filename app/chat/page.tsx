"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "ai/react"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { useLanguage } from "@/contexts/language-context"
import { useConversationPersistence } from "@/hooks/use-conversation-persistence"
import { useLanguageDetection } from "@/hooks/use-language-detection"

import { detectLanguage } from "@/utils/language-detector"
import { LoadingScreen } from "@/components/chat/loading-screen"
import { AlfredAudioVisualizer } from "@/components/chat/alfred-audio-visualizer"
import { StatusPanel } from "@/components/chat/status-panel"
import { TerminalMessage } from "@/components/chat/terminal-message"
import { ControlButtons } from "@/components/chat/control-buttons"

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
  const { t } = useLanguage()

  // Hooks personalizados
  const { isLoaded, saveToLocalStorage, clearLocalStorage, initializeStorage } = useConversationPersistence()

  const { detectMessageLanguage, createUnsupportedLanguageMessage } = useLanguageDetection()

  // Inicializar conversación al cargar
  useEffect(() => {
    console.log("🚀 Inicializando interfaz de Alfred...")
    const savedData = initializeStorage()

    if (savedData) {
      console.log("✅ Conversación anterior restaurada")
      setMessages(savedData.messages)
      setUserLanguage(savedData.userLanguage)
      setCurrentLanguage(savedData.alfredLanguage)
      lastProcessedMessageId.current = savedData.lastProcessedId
    } else {
      console.log("🆕 Nueva sesión iniciada")
    }
  }, [initializeStorage, setMessages])

  // Guardar conversación cuando cambian los datos
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      saveToLocalStorage({
        messages,
        userLanguage,
        alfredLanguage: currentLanguage,
        lastProcessedId: lastProcessedMessageId.current,
      })
    }
  }, [messages, userLanguage, currentLanguage, isLoaded, saveToLocalStorage])

  // Función para resetear conversación
  const resetConversation = () => {
    console.log("🔄 Reseteando conversación completa...")

    if (isSpeaking) {
      stop()
    }

    setMessages([])
    setCurrentLanguage("es-ES")
    setUserLanguage("es-ES")
    setIsProcessingUnsupported(false)
    lastProcessedMessageId.current = ""
    clearLocalStorage()

    console.log("✅ Conversación reseteada completamente")
  }

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      console.log("🔇 Componente principal desmontándose - limpieza final")
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Función para manejar append con detección de idioma
  const handleAppendWithLanguageCheck = async (message: { role: "user" | "assistant"; content: string }) => {
    if (message.role === "user") {
      const { detectedLanguage, unsupportedLanguage, isSupported } = detectMessageLanguage(message.content)

      if (unsupportedLanguage || !isSupported) {
        console.log(`🚫 Frontend: Idioma no soportado detectado: ${unsupportedLanguage || detectedLanguage}`)

        const userMessage = {
          id: `user-${Date.now()}`,
          role: "user" as const,
          content: message.content,
          createdAt: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setUserLanguage(detectedLanguage)
        setIsProcessingUnsupported(true)

        const processingTime = 1500 + Math.random() * 1000

        setTimeout(() => {
          const unsupportedResponse = createUnsupportedLanguageMessage(unsupportedLanguage || detectedLanguage)
          setMessages((prev) => [...prev, unsupportedResponse])
          setCurrentLanguage("es-ES")
          setIsProcessingUnsupported(false)
        }, processingTime)

        return
      }

      console.log("✅ Idioma soportado detectado:", detectedLanguage)
      setUserLanguage(detectedLanguage)
    }

    try {
      await append(message)
    } catch (error: any) {
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

  // Manejar click del micrófono
  const handleMicClick = async () => {
    if (isRecording) {
      forceStop()
    } else if (audioBlob) {
      try {
        console.log("🎤 Starting transcription process...")

        const formData = new FormData()
        formData.append("audio", audioBlob, "recording.webm")

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(`Transcription failed: ${response.status} - ${errorData.error || response.statusText}`)
        }

        const result = await response.json()

        if (result.text && result.text.trim()) {
          await handleAppendWithLanguageCheck({ role: "user", content: result.text })
          clearRecording()
        } else {
          throw new Error("No valid text was transcribed from the audio")
        }
      } catch (error) {
        console.error("💥 Transcription error:", error)
        clearRecording()
      }
    } else {
      if (isSpeaking) {
        stop()
      }
      startRecording()
    }
  }

  // Manejar preview de audio
  const handlePreviewAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play().catch(console.error)
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }

  // Manejar repetir último mensaje
  const handleRepeatLastMessage = () => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "assistant") {
      speak(lastMessage.content)
    }
  }

  // Auto-speak assistant responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (
      lastMessage &&
      lastMessage.role === "assistant" &&
      lastMessage.id !== lastProcessedMessageId.current &&
      !isSpeaking &&
      !isLoading &&
      isLoaded
    ) {
      lastProcessedMessageId.current = lastMessage.id

      const isUnsupportedLanguageMessage = lastMessage.content.includes(
        "Lo siento, pero no estoy configurado para comunicarme en ese idioma",
      )

      if (!isUnsupportedLanguageMessage) {
        const detectedLang = detectLanguage(lastMessage.content)
        setCurrentLanguage(detectedLang)
        speak(lastMessage.content)
      } else {
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
      setIsProcessingUnsupported(false)
    }
  }, [messages.length, isLoaded])

  // Scroll automático
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!isLoaded) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-black text-slate-200 font-mono overflow-hidden relative">
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

      {/* Contenedor principal responsive */}
      <div className="relative z-10 h-screen flex flex-col xl:flex-row">
        {/* Panel izquierdo */}
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
          {/* Header */}
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

          {/* Avatar */}
          <div className="mb-4 xl:mb-10 flex justify-center xl:block">
            <div className="scale-75 xl:scale-100">
              <AlfredAudioVisualizer
                isActive={isActive || isLoading || isProcessingUnsupported}
                isSpeaking={isSpeaking}
              />
            </div>
          </div>

          {/* Status Panel */}
          <StatusPanel
            userLanguage={userLanguage}
            currentLanguage={currentLanguage}
            messagesCount={messages.length}
            isSpeaking={isSpeaking}
          />
        </motion.div>

        {/* Panel principal */}
        <div className="flex-1 flex flex-col order-2 xl:order-2 min-h-0">
          {/* Header del terminal */}
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

          {/* Área de mensajes */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-3 xl:p-6 overflow-y-auto bg-black/60 pipboy-scrollbar min-h-0"
          >
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

            {/* Indicador de carga */}
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

          {/* Controles */}
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-black/80 border-t-2 border-slate-500/50 p-2 xl:p-4 flex-shrink-0"
          >
            <ControlButtons
              isRecording={isRecording}
              audioBlob={audioBlob}
              isSpeaking={isSpeaking}
              messages={messages}
              onMicClick={handleMicClick}
              onMute={stop}
              onPreviewAudio={handlePreviewAudio}
              onRepeatLastMessage={handleRepeatLastMessage}
              onClearRecording={clearRecording}
              onResetConversation={resetConversation}
            />

            {/* Indicadores de estado */}
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

          {/* Footer */}
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

      {/* Error overlay */}
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

      {/* Estilos CSS */}
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

        .pipboy-scrollbar::-webkit-scrollbar-corner {
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        @keyframes soun0,0,0.95);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

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

        .pipboy-scrollbar:hover::-webkit-scrollbar-thumb {
          animation: sound-bar-pulse 0.8s ease-in-out infinite;
        }

        .pipboy-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.8) rgba(0, 0, 0, 0.9);
        }

        .pipboy-scrollbar:hover {
          box-shadow: inset 2px 0 4px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
