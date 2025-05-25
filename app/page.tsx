"use client"

import { Monitor, Zap, Cpu, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function HomePage() {
  const { t, currentLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono">
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

      {/* Language Selector - Estilo Pip-Boy */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6">
        {/* Terminal Header */}
        <div className="border-2 border-green-400 bg-black/80 p-6 mb-6 relative">
          <div className="absolute top-2 left-2 flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>

          <div className="text-center pt-8">
            <div className="text-green-400 text-xs mb-2 tracking-widest">ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</div>
            <div className="text-green-400 text-xs mb-4">ENTER PASSWORD NOW</div>

            <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-4 tracking-wider glow-text">A.L.F.R.E.D</h1>

            <div className="text-green-300 text-sm tracking-widest mb-2">{t.alfredSubtitle1}</div>
            <div className="text-green-300 text-sm tracking-widest mb-4">{t.alfredSubtitle2}</div>

            <div className="text-green-400 text-xs">
              {">"} {t.conversationalAI} {"<"}
            </div>
            <div className="text-amber-400 text-xs mt-1">
              {">"} {t.languagesSupported} {"<"}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border border-green-400 bg-black/60 p-4">
            <div className="text-green-400 text-xs mb-2">SYSTEM STATUS</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs">{t.systemOperational}</span>
            </div>
          </div>

          <div className="border border-green-400 bg-black/60 p-4">
            <div className="text-green-400 text-xs mb-2">AI CORE</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              <span className="text-green-300 text-xs">{t.aiActive}</span>
            </div>
          </div>

          <div className="border border-green-400 bg-black/60 p-4">
            <div className="text-green-400 text-xs mb-2">INTERFACE</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
              <span className="text-green-300 text-xs">{t.interfaceReady}</span>
            </div>
          </div>
        </div>

        {/* Main Interface Access */}
        <div className="mb-6">
          <div className="border-2 border-green-400 bg-black/80 hover:bg-green-900/20 transition-all duration-300">
            <div className="border-b border-green-400 p-4 bg-green-400/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-6 h-6 text-green-400" />
                  <MessageCircle className="w-6 h-6 text-green-400" />
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-green-400 text-sm font-bold">{t.mainInterface}</div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-green-400 text-2xl font-bold mb-6 tracking-wider text-center">
                {t.alfredTerminalInterface}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
                <div className="space-y-2">
                  <div className="text-green-300">
                    {">"} {t.retrofuturisticDesign}
                  </div>
                  <div className="text-green-300">
                    {">"} {t.realtimeVoiceComm}
                  </div>
                  <div className="text-green-300">
                    {">"} {t.advancedNeuralTranscription}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-green-300">
                    {">"} {t.animatedAvatarSystem}
                  </div>
                  <div className="text-green-300">
                    {">"} {t.multilingualSupport5Lang}
                  </div>
                  <div className="text-green-300">
                    {">"} {t.pipboyAesthetics}
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-amber-400 text-sm animate-pulse mb-2">🤖 {t.advancedAiInterface} 🤖</div>
                <div className="text-green-400 text-xs">
                  {">"} {t.voiceTextCommEnabled} {"<"}
                </div>
              </div>

              <Link href="/chat">
                <Button className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-4 text-lg border-2 border-green-400 transition-all duration-300 retro-button">
                  {t.initializeAlfredInterface}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="border-2 border-green-400 bg-black/80 mb-6">
          <div className="border-b border-green-400 p-3 bg-green-400/10">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-bold tracking-wider">{t.technicalSpecs}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-green-400 p-4 bg-black/40">
                <div className="text-green-400 text-sm font-bold mb-3 tracking-wider">{t.neuralEngine}</div>
                <div className="text-green-300 text-xs mb-1">{">"} Groq LPU Architecture</div>
                <div className="text-green-300 text-xs opacity-70">
                  {">"} {t.ultraFastInference}
                </div>
              </div>

              <div className="border border-green-400 p-4 bg-black/40">
                <div className="text-green-400 text-sm font-bold mb-3 tracking-wider">{t.linguisticModel}</div>
                <div className="text-green-300 text-xs mb-1">{">"} Llama 3.1 8B Instant</div>
                <div className="text-green-300 text-xs opacity-70">
                  {">"} {t.advancedReasoning}
                </div>
              </div>

              <div className="border border-green-400 p-4 bg-black/40">
                <div className="text-green-400 text-sm font-bold mb-3 tracking-wider">{t.audioProcessor}</div>
                <div className="text-green-300 text-xs mb-1">{">"} Whisper Large V3</div>
                <div className="text-green-300 text-xs opacity-70">
                  {">"} {t.languagesSupport}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="border border-green-400 bg-black/60 p-4 text-center">
          <div className="text-green-400 text-xs">
            ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL - COPYRIGHT 2287 ROBCO INDUSTRIES
          </div>
          <div className="text-green-300 text-xs mt-1">
            {">"} PRESS [INITIALIZE] TO ACCESS A.L.F.R.E.D INTERFACE {"<"}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        .glow-text {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
