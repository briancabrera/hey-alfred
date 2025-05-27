"use client"

import { motion } from "framer-motion"

export function LoadingScreen() {
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
