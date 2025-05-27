"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Zap, VolumeX, Volume2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { PipBoyButton } from "./pip-boy-button"
import { ResetConversationButton } from "./reset-conversation-button"

interface ControlButtonsProps {
  isRecording: boolean
  audioBlob: Blob | null
  isSpeaking: boolean
  messages: any[]
  onMicClick: () => void
  onMute: () => void
  onPreviewAudio: () => void
  onRepeatLastMessage: () => void
  onClearRecording: () => void
  onResetConversation: () => void
}

export function ControlButtons({
  isRecording,
  audioBlob,
  isSpeaking,
  messages,
  onMicClick,
  onMute,
  onPreviewAudio,
  onRepeatLastMessage,
  onClearRecording,
  onResetConversation,
}: ControlButtonsProps) {
  const { t } = useLanguage()

  const getMicButtonState = () => {
    if (audioBlob && !isRecording) return { icon: Zap, text: t.transmit || "TRANSMIT", variant: "default" as const }
    if (isRecording) return { icon: MicOff, text: t.stopRecording || "STOP_REC", variant: "danger" as const }
    return { icon: Mic, text: t.record || "RECORD", variant: "default" as const }
  }

  const micState = getMicButtonState()

  return (
    <div className="flex justify-center items-center space-x-2 xl:space-x-3 mb-3 xl:mb-4 flex-wrap gap-2 xl:gap-3">
      {/* Botón principal de micrófono */}
      <div className="w-28 xl:w-36">
        <PipBoyButton onClick={onMicClick} active={isRecording || !!audioBlob} variant={micState.variant}>
          <div className="flex items-center justify-center space-x-1 xl:space-x-2">
            <micState.icon className="w-3 h-3 xl:w-4 xl:h-4" />
            <span className="text-xs xl:text-sm">{micState.text}</span>
          </div>
        </PipBoyButton>
      </div>

      {/* Botón MUTE */}
      <div className="w-28 xl:w-36">
        <PipBoyButton onClick={onMute} disabled={!isSpeaking} variant="danger">
          <div className="flex items-center justify-center space-x-1 xl:space-x-2">
            <VolumeX className="w-3 h-3 xl:w-4 xl:h-4" />
            <span className="text-xs xl:text-sm">{t.mute || "MUTE"}</span>
          </div>
        </PipBoyButton>
      </div>

      {/* Botón PREVIEW */}
      <AnimatePresence>
        {audioBlob && !isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-28 xl:w-36"
          >
            <PipBoyButton onClick={onPreviewAudio} variant="warning">
              <div className="flex items-center justify-center space-x-1 xl:space-x-2">
                <Volume2 className="w-3 h-3 xl:w-4 xl:h-4" />
                <span className="text-xs xl:text-sm">PREVIEW</span>
              </div>
            </PipBoyButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón REPETIR */}
      {!isRecording && !audioBlob && (
        <div className="w-28 xl:w-36">
          <PipBoyButton
            onClick={onRepeatLastMessage}
            disabled={!messages.length || messages[messages.length - 1]?.role !== "assistant"}
            variant="warning"
          >
            <div className="flex items-center justify-center space-x-1 xl:space-x-2">
              <Volume2 className="w-3 h-3 xl:w-4 xl:h-4" />
              <span className="text-xs xl:text-sm">{t.repeat || "REPEAT"}</span>
            </div>
          </PipBoyButton>
        </div>
      )}

      {/* Botón RE_RECORD */}
      <AnimatePresence>
        {audioBlob && !isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-28 xl:w-36"
          >
            <PipBoyButton onClick={onClearRecording} variant="warning">
              <div className="flex items-center justify-center space-x-1 xl:space-x-2">
                <Mic className="w-3 h-3 xl:w-4 xl:h-4" />
                <span className="text-xs xl:text-sm">RE_REC</span>
              </div>
            </PipBoyButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón RESET */}
      {!isRecording && !audioBlob && (
        <div className="w-28 xl:w-36">
          <ResetConversationButton onReset={onResetConversation} />
        </div>
      )}
    </div>
  )
}
