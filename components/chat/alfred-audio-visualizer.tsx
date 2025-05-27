"use client"

import { motion } from "framer-motion"

interface AlfredAudioVisualizerProps {
  isActive: boolean
  isSpeaking: boolean
}

export function AlfredAudioVisualizer({ isActive, isSpeaking }: AlfredAudioVisualizerProps) {
  // Generar 12 barras con diferentes alturas y delays
  const bars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    baseHeight: 15 + Math.random() * 25, // Altura base entre 15-40
    maxHeight: 40 + Math.random() * 50, // Altura máxima entre 40-90
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

      {/* Texto A.L.F.R.E.D */}
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
