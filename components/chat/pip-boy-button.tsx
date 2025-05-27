"use client"

import type React from "react"
import { motion } from "framer-motion"

interface PipBoyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  variant?: "default" | "danger" | "warning"
}

export function PipBoyButton({
  children,
  onClick,
  active = false,
  disabled = false,
  variant = "default",
}: PipBoyButtonProps) {
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
