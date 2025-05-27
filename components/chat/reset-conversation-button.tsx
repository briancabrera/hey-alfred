"use client"

import { useState } from "react"
import { RotateCcw, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { PipBoyButton } from "./pip-boy-button"

interface ResetConversationButtonProps {
  onReset: () => void
}

export function ResetConversationButton({ onReset }: ResetConversationButtonProps) {
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
