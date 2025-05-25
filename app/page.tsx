"use client"

import { Mic, MessageCircle, Zap, Monitor } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function HomePage() {
  const { t, currentLanguage } = useLanguage()

  // Debug simplificado
  console.log("🏠 HomePage render - language:", currentLanguage, "startSession:", t.startSession)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Language Selector Flotante */}
      <LanguageSelector />

      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header - Sin selector de idiomas */}
        <div className="text-center pt-4 sm:pt-8 pb-8 sm:pb-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 font-mono tracking-wider">
              A.L.F.R.E.D
            </h1>
            <div className="text-sm sm:text-base md:text-lg text-cyan-300 font-mono tracking-widest mb-2">
              {t.alfredSubtitle1}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-cyan-300 font-mono tracking-widest mb-4">
              {t.alfredSubtitle2}
            </div>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full shadow-lg shadow-cyan-400/50"></div>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 font-mono px-4">
            {">"} {t.conversationalAI} {"<"}
          </p>
          <p className="text-xs sm:text-sm text-yellow-400 font-mono mt-2 px-4">
            {">"} {t.languagesSupported} {"<"}
          </p>
        </div>

        {/* Interface Selection */}
        <div className="flex flex-col lg:flex-row justify-center gap-6 mb-8 sm:mb-12 px-4">
          {/* Standard Interface */}
          <Card className="bg-black/50 border-2 border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25 backdrop-blur-sm w-full max-w-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center justify-center text-cyan-300 font-mono text-lg sm:text-xl">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                  <span className="text-sm sm:text-base">+</span>
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
              </CardTitle>
              <div className="text-center">
                <h3 className="text-cyan-300 font-mono text-base sm:text-lg font-bold">STANDARD INTERFACE</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="text-gray-300 mb-6 font-mono leading-relaxed text-center text-sm sm:text-base space-y-1">
                <p>{">"} Modern & Clean Design</p>
                <p>
                  {">"} {t.vocalTextCommunication}
                </p>
                <p>
                  {">"} {t.neuralTranscription}
                </p>
                <p>
                  {">"} {t.realtimeSynthesis}
                </p>
              </div>
              <Link href="/voice-chat">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-mono font-bold py-3 text-sm sm:text-lg border-0 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/50 transition-all duration-300">
                  LAUNCH STANDARD
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pip-Boy Interface */}
          <Card className="bg-black/50 border-2 border-green-400/50 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/25 backdrop-blur-sm w-full max-w-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center justify-center text-green-300 font-mono text-lg sm:text-xl">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  <span className="text-sm sm:text-base">+</span>
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                </div>
              </CardTitle>
              <div className="text-center">
                <h3 className="text-green-300 font-mono text-base sm:text-lg font-bold">PIP-BOY INTERFACE</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="text-gray-300 mb-6 font-mono leading-relaxed text-center text-sm sm:text-base space-y-1">
                <p>{">"} Retrofuturistic Terminal</p>
                <p>{">"} Animated Avatar System</p>
                <p>{">"} Cyberpunk Aesthetics</p>
                <p>{">"} Fallout-Inspired Design</p>
              </div>
              <div className="text-center mb-4">
                <div className="text-xs text-green-400 font-mono animate-pulse">🤖 EXPERIMENTAL INTERFACE 🤖</div>
              </div>
              <Link href="/pipboy">
                <Button className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-400 hover:to-yellow-400 text-black font-mono font-bold py-3 text-sm sm:text-lg border-0 shadow-lg shadow-green-400/25 hover:shadow-green-400/50 transition-all duration-300">
                  LAUNCH PIP-BOY
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Tech Specs */}
        <Card className="bg-black/50 border-2 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25 backdrop-blur-sm mx-4 mb-4 sm:mb-6 lg:mb-8">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-yellow-400" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 font-mono tracking-wider text-center">
                {t.technicalSpecs}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="border-2 border-cyan-400/50 rounded-lg p-4 sm:p-6 bg-black/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300">
                <div className="text-cyan-400 font-mono text-sm sm:text-base md:text-lg font-bold mb-3 tracking-wider">
                  {t.neuralEngine}
                </div>
                <div className="text-gray-300 font-mono text-xs sm:text-sm">{">"} Groq LPU Architecture</div>
                <div className="text-cyan-300 font-mono text-xs mt-2 opacity-70">
                  {">"} {t.ultraFastInference}
                </div>
              </div>
              <div className="border-2 border-purple-400/50 rounded-lg p-4 sm:p-6 bg-black/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/25 transition-all duration-300">
                <div className="text-purple-400 font-mono text-sm sm:text-base md:text-lg font-bold mb-3 tracking-wider">
                  {t.linguisticModel}
                </div>
                <div className="text-gray-300 font-mono text-xs sm:text-sm">{">"} Llama 3.1 8B Instant</div>
                <div className="text-purple-300 font-mono text-xs mt-2 opacity-70">
                  {">"} {t.advancedReasoning}
                </div>
              </div>
              <div className="border-2 border-pink-400/50 rounded-lg p-4 sm:p-6 bg-black/40 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-400/25 transition-all duration-300 md:col-span-1 col-span-1">
                <div className="text-pink-400 font-mono text-sm sm:text-base md:text-lg font-bold mb-3 tracking-wider">
                  {t.audioProcessor}
                </div>
                <div className="text-gray-300 font-mono text-xs sm:text-sm">{">"} Whisper Large V3</div>
                <div className="text-pink-300 font-mono text-xs mt-2 opacity-70">
                  {">"} {t.languagesSupport}
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-xs sm:text-sm">{t.systemOperational}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <span className="text-blue-400 font-mono text-xs sm:text-sm">{t.aiActive}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <span className="text-yellow-400 font-mono text-xs sm:text-sm">{t.interfaceReady}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  )
}
