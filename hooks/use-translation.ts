"use client"

// Este hook ahora es solo un alias del contexto para mantener compatibilidad
import { useLanguage } from "@/contexts/language-context"

export function useTranslation() {
  return useLanguage()
}
