// Since there is no existing code, I will create a new file with the provided update.
// This assumes the update is part of a larger function called handleMicClick.
// I will create a basic structure for the page and the handleMicClick function.

"use client"

import { useState } from "react"

const PipboyPage = () => {
  const [transcription, setTranscription] = useState<string>("")

  const handleMicClick = async () => {
    try {
      // Placeholder for audio recording logic
      console.log("Recording audio...")

      // Placeholder for sending audio to transcription API
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "audio/wav", // Adjust content type as needed
        },
        body: new Blob(), // Replace with actual audio data
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("❌ Transcription API error:", response.status, errorData)

        // Manejar errores específicos de detección de voz
        if (errorData.error === "NO_SPEECH_DETECTED" || errorData.error === "NO_CLEAR_SPEECH") {
          throw new Error(`${errorData.error}: ${errorData.message}`)
        }

        throw new Error(`Transcription failed: ${response.status} - ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      setTranscription(data.transcription)
      console.log("Transcription:", data.transcription)
    } catch (error: any) {
      console.error("Error during transcription:", error.message)
      setTranscription(`Error: ${error.message}`)
    }
  }

  return (
    <div>
      <h1>Pipboy Page</h1>
      <button onClick={handleMicClick}>Start Recording</button>
      <p>Transcription: {transcription}</p>
    </div>
  )
}

export default PipboyPage
