"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { getLanguageName } from "@/utils/language-detector"

interface TerminalMessageProps {
  message: any
  isUser: boolean
  userLang: string
  alfredLang: string
}

export function TerminalMessage({ message, isUser, userLang, alfredLang }: TerminalMessageProps) {
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
