"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Volume2, VolumeX, AlertCircle, Send, Keyboard, Mic, Globe, X } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { useLanguage } from "@/contexts/language-context"
import {
  detectLanguage,
  detectUnsupportedLanguage,
  isLanguageSupported,
  getLanguageName,
} from "@/utils/language-detector"

export default function VoiceChatPage() {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice")
  const [textInput, setTextInput] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState<string>("es-ES")
  const [userLanguage, setUserLanguage] = useState<string>("es-ES")
  const [debugInfo, setDebugInfo] = useState<string>("")
  const lastProcessedMessageId = useRef<string>("")

  const { messages, append, isLoading, input, handleInputChange, handleSubmit } = useChat()
  const { isRecording, audioBlob, error, startRecording, forceStop, clearRecording } = useAudioRecorder()
  const { speak, repeatSpeak, stop, isSpeaking, clearLastSpoken } = useTextToSpeech()
  const { t, updateLanguageFromDetection } = useLanguage()

  // Debug para verificar que el idioma está cambiando
  console.log("Current UI language:", t)
  console.log("Current translations:", t.startSession)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      forceStop()
      stop()
    }
  }, [forceStop, stop])

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append("audio", blob, "recording.webm")

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Transcription failed")
      }

      const { text } = await response.json()

      if (text && text.trim()) {
        // Detectar idioma y mostrar debug info
        const detectedUserLang = detectLanguage(text)
        setDebugInfo(`Texto: "${text}" → Detectado: ${detectedUserLang}`)

        // Verificar si es un idioma no soportado
        const unsupportedLang = detectUnsupportedLanguage(text)

        if (unsupportedLang || !isLanguageSupported(detectedUserLang)) {
          console.warn("Idioma no soportado detectado:", unsupportedLang || detectedUserLang)
        }

        setUserLanguage(detectedUserLang)
        updateLanguageFromDetection(detectedUserLang)
        await append({ role: "user", content: text })
        clearRecording()
      } else {
        throw new Error("No se detectó audio válido")
      }
    } catch (error) {
      console.error("Transcription error:", error)
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleUnifiedAction = () => {
    if (isTranscribing) {
      return
    }

    if (isRecording) {
      // PASO 2: Detener grabación
      forceStop()
    } else if (audioBlob) {
      // PASO 3: Transmitir audio
      transcribeAudio(audioBlob)
    } else {
      // PASO 1: Iniciar grabación
      clearRecording()
      startRecording()
    }
  }

  // Nueva función para cancelar la grabación en el paso 3
  const handleCancelRecording = () => {
    clearRecording()
  }

  // Manejar envío de texto
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim() && !isLoading) {
      // Detectar idioma y mostrar debug info
      const detectedUserLang = detectLanguage(textInput)
      setDebugInfo(`Texto: "${textInput}" → Detectado: ${detectedUserLang}`)

      // Verificar si es un idioma no soportado
      const unsupportedLang = detectUnsupportedLanguage(textInput)

      if (unsupportedLang || !isLanguageSupported(detectedUserLang)) {
        console.warn("Idioma no soportado detectado:", unsupportedLang || detectedUserLang)
      }

      setUserLanguage(detectedUserLang)
      updateLanguageFromDetection(detectedUserLang)
      await append({ role: "user", content: textInput.trim() })
      setTextInput("")
    }
  }

  // Determinar el estado visual del botón de voz
  const getVoiceButtonState = () => {
    if (isTranscribing) {
      return {
        icon: "📤",
        text: t.transmitting,
        color: "from-blue-500 to-blue-600",
        disabled: true,
        step: "Procesando",
      }
    } else if (audioBlob && !isRecording) {
      return {
        icon: "📤",
        text: t.transmit,
        color: "from-green-500 to-emerald-500",
        disabled: false,
        step: t.step3,
      }
    } else if (isRecording) {
      return {
        icon: "⏹️",
        text: t.stopRecording,
        color: "from-red-500 to-red-600",
        disabled: false,
        step: t.step2,
      }
    } else {
      return {
        icon: "🎤",
        text: t.record,
        color: "from-cyan-500 to-purple-500",
        disabled: false,
        step: t.step1,
      }
    }
  }

  const voiceButtonState = getVoiceButtonState()

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

      // Detectar idioma de la respuesta de Alfred
      const detectedLang = detectLanguage(lastMessage.content)
      setCurrentLanguage(detectedLang)

      speak(lastMessage.content)
    }
  }, [messages, isSpeaking, isLoading, speak])

  // Limpiar referencia cuando se inicia nueva conversación
  useEffect(() => {
    if (messages.length === 0) {
      lastProcessedMessageId.current = ""
      clearLastSpoken()
      setCurrentLanguage("es-ES")
      setUserLanguage("es-ES")
      setDebugInfo("")
    }
  }, [messages.length, clearLastSpoken])

  // Función para manejar la repetición manual
  const handleRepeat = () => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "assistant") {
      repeatSpeak(lastMessage.content)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Language Selector Flotante */}
      <LanguageSelector />

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.1) 0%, transparent 50%)
          `,
            animation: "pulse 4s ease-in-out infinite alternate",
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <Card className="mb-4 sm:mb-6 bg-black/70 border-2 border-cyan-400/50 backdrop-blur-sm">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              A.L.F.R.E.D
            </CardTitle>
            <div className="text-cyan-300 font-mono text-xs sm:text-sm tracking-widest mb-2">{t.alfredSubtitle1}</div>
            <div className="text-cyan-300 font-mono text-xs sm:text-sm tracking-widest mb-2">{t.alfredSubtitle2}</div>
            <div className="text-gray-400 font-mono text-xs mb-4 italic">
              {">"} {t.alsoKnownAs} {"<"}
            </div>

            {/* Controls - Responsive Layout Simplificado */}
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-center sm:space-x-6">
              {/* System Status */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-xs sm:text-sm">{t.systemActive}</span>
              </div>

              {/* Language Indicators - Stack on mobile */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 bg-black/50 rounded-lg p-2 border border-gray-600/30">
                  <Globe className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-300 font-mono text-xs">
                    {t.userLanguage}: {getLanguageName(userLanguage)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-black/50 rounded-lg p-2 border border-gray-600/30">
                  <Globe className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-300 font-mono text-xs">
                    {t.alfredLanguage}: {getLanguageName(currentLanguage)}
                  </span>
                </div>
              </div>

              {/* Mode Toggle - Centrado mejorado */}
              <div className="flex justify-center w-full sm:w-auto">
                <div className="flex items-center space-x-1 bg-black/50 rounded-lg p-1 border border-gray-600/30">
                  <Button
                    onClick={() => setInputMode("voice")}
                    variant="ghost"
                    size="sm"
                    className={`font-mono text-xs px-3 py-2 ${
                      inputMode === "voice"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50"
                        : "text-gray-400 hover:text-cyan-300"
                    }`}
                  >
                    <Mic className="w-3 h-3 mr-1" />
                    {t.voice}
                  </Button>
                  <Button
                    onClick={() => setInputMode("text")}
                    variant="ghost"
                    size="sm"
                    className={`font-mono text-xs px-3 py-2 ${
                      inputMode === "text"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-400/50"
                        : "text-gray-400 hover:text-purple-300"
                    }`}
                  >
                    <Keyboard className="w-3 h-3 mr-1" />
                    {t.text}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Debug Info */}
        {debugInfo && (
          <Card className="mb-4 sm:mb-6 bg-yellow-900/20 border-2 border-yellow-400/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center text-yellow-400 font-mono text-xs sm:text-sm">
                <span>🔍 DEBUG: {debugInfo}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-4 sm:mb-6 bg-red-900/20 border-2 border-red-400/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center text-red-400 font-mono text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>ERROR: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Messages - Responsive Height */}
        <Card className="mb-4 sm:mb-6 bg-black/70 border-2 border-purple-400/30 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="h-64 sm:h-80 md:h-96 overflow-y-auto space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-cyan-300 mt-4 sm:mt-8 font-mono">
                  <div className="text-xl sm:text-2xl mb-4">🤖</div>
                  <p className="text-base sm:text-lg mb-2">
                    {">"} {t.systemInitialized}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">
                    {">"} {t.alsoKnownAs}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 px-4">
                    {">"} {t.supportedLanguages}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1 px-4">
                    <p>
                      {">"} {t.voiceModeInstructions}
                    </p>
                    <p>
                      {">"} {t.textModeInstructions}
                    </p>
                    <p className="text-yellow-400">
                      {">"} {t.tryExample}
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-mono border-2 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-100"
                          : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 text-purple-100"
                      }`}
                    >
                      <div className="text-xs opacity-70 mb-1 flex items-center justify-between">
                        <span>{message.role === "user" ? "USUARIO" : "ALFRED"}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 text-xs">
                            {getLanguageName(detectLanguage(message.content))}
                          </span>
                          {message.role === "assistant" && isSpeaking && (
                            <span className="text-green-400 animate-pulse">🔊</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 text-yellow-100 max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-mono">
                    <div className="text-xs opacity-70 mb-1">ALFRED</div>
                    <p className="text-xs sm:text-sm">
                      {">"} {t.processing}
                    </p>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Unified Input Controls */}
        <Card className="bg-black/70 border-2 border-cyan-400/30 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              {/* Status Display */}
              <div className="text-center font-mono">
                {inputMode === "voice" && isRecording && (
                  <div className="text-red-400 font-bold text-sm sm:text-lg animate-pulse mb-2">{t.recordingAudio}</div>
                )}
                {inputMode === "voice" && audioBlob && !isRecording && !isTranscribing && (
                  <div className="text-green-400 font-bold text-sm sm:text-lg mb-2">
                    {t.audioCaptured} ({Math.round(audioBlob.size / 1024)}KB) - Presiona para transmitir
                  </div>
                )}
                {inputMode === "voice" && isTranscribing && (
                  <div className="text-blue-400 font-bold text-sm sm:text-lg mb-2">{t.decodingSignal}</div>
                )}
                {isSpeaking && (
                  <div className="text-purple-400 font-bold text-sm sm:text-lg mb-2 animate-pulse">
                    {t.alfredSpeaking} {getLanguageName(currentLanguage)}...
                  </div>
                )}
                {inputMode === "text" && !isSpeaking && (
                  <div className="text-gray-400 font-bold text-sm sm:text-lg mb-2">{t.textModeActive}</div>
                )}
                {inputMode === "voice" && !isRecording && !audioBlob && !isTranscribing && !isSpeaking && (
                  <div className="text-gray-400 font-bold text-sm sm:text-lg mb-2">{t.voiceModeActive}</div>
                )}
              </div>

              {/* Input Area */}
              {inputMode === "voice" ? (
                /* Voice Input */
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="relative">
                    <button
                      onClick={handleUnifiedAction}
                      disabled={voiceButtonState.disabled}
                      className={`
                        w-16 h-16 sm:w-20 sm:h-20 rounded-full font-bold text-base sm:text-lg transition-all duration-300 
                        bg-gradient-to-r ${voiceButtonState.color} 
                        hover:scale-105 active:scale-95
                        shadow-lg border-0 cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center
                        ${isRecording ? "animate-pulse" : ""}
                        ${audioBlob && !isRecording ? "shadow-green-400/50" : ""}
                        ${isRecording ? "shadow-red-400/50" : "shadow-cyan-400/50"}
                      `}
                      style={{
                        fontSize: "1.2rem",
                        zIndex: 1000,
                        position: "relative",
                      }}
                    >
                      {voiceButtonState.icon}
                    </button>
                    {isRecording && (
                      <div className="absolute -inset-2 border-2 border-red-400 rounded-full animate-ping"></div>
                    )}
                    {audioBlob && !isRecording && !isTranscribing && (
                      <div className="absolute -inset-2 border-2 border-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-bold font-mono text-white mb-1">
                      {voiceButtonState.text}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">{voiceButtonState.step}</div>
                  </div>

                  {/* Botón de cancelar - solo visible en el paso 3 */}
                  {audioBlob && !isRecording && !isTranscribing && (
                    <Button
                      onClick={handleCancelRecording}
                      variant="outline"
                      size="sm"
                      className="
      bg-black/50 backdrop-blur-sm border-2 border-orange-400/50 
      text-orange-300 hover:bg-orange-400/10 hover:border-orange-400 hover:text-orange-100
      font-mono transition-all duration-300 text-xs sm:text-sm
      shadow-lg shadow-orange-400/20 hover:shadow-orange-400/40
      px-4 py-2
    "
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      {t.cancelAndRecord}
                    </Button>
                  )}
                </div>
              ) : (
                /* Text Input */
                <form onSubmit={handleTextSubmit} className="w-full max-w-md">
                  <div className="flex space-x-2">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t.typeMessage}
                      disabled={isLoading}
                      className="flex-1 bg-black/50 border-purple-400/50 text-white placeholder-gray-400 font-mono focus:border-purple-400 focus:ring-purple-400/20 text-sm"
                    />
                    <Button
                      type="submit"
                      disabled={!textInput.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-mono"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </form>
              )}

              {/* Speech Controls */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleRepeat}
                  disabled={isSpeaking || !messages.length || messages[messages.length - 1]?.role !== "assistant"}
                  variant="outline"
                  className="
      bg-black/50 backdrop-blur-sm border-2 border-cyan-400/50 
      text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 hover:text-cyan-100
      disabled:border-gray-600/30 disabled:text-gray-500 disabled:hover:bg-transparent
      font-mono text-xs sm:text-sm transition-all duration-300 
      shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40
      disabled:shadow-none px-4 py-2
    "
                >
                  <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {t.repeat}
                </Button>

                <Button
                  onClick={stop}
                  disabled={!isSpeaking}
                  variant="outline"
                  className="
      bg-black/50 backdrop-blur-sm border-2 border-red-400/50 
      text-red-300 hover:bg-red-400/10 hover:border-red-400 hover:text-red-100
      disabled:border-gray-600/30 disabled:text-gray-500 disabled:hover:bg-transparent
      font-mono text-xs sm:text-sm transition-all duration-300 
      shadow-lg shadow-red-400/20 hover:shadow-red-400/40
      disabled:shadow-none px-4 py-2
    "
                >
                  <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {t.mute}
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-center text-xs sm:text-sm text-gray-400 max-w-md font-mono leading-relaxed border border-gray-600/30 rounded-lg p-3 sm:p-4 bg-black/30">
                <div className="text-cyan-400 font-bold mb-2">
                  {">"} {t.multilingualInterface}
                </div>
                <div className="text-xs text-yellow-400 mb-2">
                  🇪🇸 Español • 🇺🇸 English • 🇫🇷 Français • 🇮🇹 Italiano • 🇧🇷 Português
                </div>
                {inputMode === "voice" ? (
                  <>
                    <p className="mb-1">{t.voiceModeInstructions}</p>
                    <p className="text-xs text-gray-500">{t.alfredWillRespond}</p>
                    <p className="text-xs text-orange-400 mt-1">{t.canCancel}</p>
                  </>
                ) : (
                  <>
                    <p className="mb-1">{t.textModeInstructions}</p>
                    <p className="text-xs text-gray-500">{t.alfredWillDetect}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
