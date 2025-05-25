import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as Blob

  if (!file) {
    return NextResponse.json({ error: "File blob is required." }, { status: 400 })
  }

  try {
    const buffer = await file.arrayBuffer()

    const response = await fetch("https://api.groq.com/speech/v1/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        file: Array.from(new Uint8Array(buffer)),
        model: "whisper-v3",
        language: "es",
        response_format: "json",
      }),
    })

    if (!response.ok) {
      console.error("Transcription failed:", response.status, response.statusText)
      try {
        const errorBody = await response.json()
        console.error("Error details:", errorBody)
        return NextResponse.json({ error: "Transcription failed", details: errorBody }, { status: response.status })
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError)
        return NextResponse.json(
          { error: "Transcription failed", details: response.statusText },
          { status: response.status },
        )
      }
    }

    const result = await response.json()
    console.log("✅ Transcription successful:", result.text?.substring(0, 100) + "...")

    // Validar si realmente hay contenido de voz
    if (!result.text || result.text.trim().length < 3) {
      console.log("🔇 No speech detected in transcription result")
      return NextResponse.json(
        {
          error: "NO_SPEECH_DETECTED",
          message: "No se detectó voz clara en la grabación",
          suggestions: [
            "Habla más cerca del micrófono",
            "Habla más fuerte y claro",
            "Reduce el ruido de fondo",
            "Asegúrate de que el micrófono funcione correctamente",
          ],
          originalText: result.text || "",
        },
        { status: 400 },
      )
    }

    // Validar si el texto es solo ruido o caracteres sin sentido
    const cleanText = result.text.trim().toLowerCase()
    const isOnlyNoise =
      /^[.,\s\-_*#@!?]+$/.test(cleanText) || cleanText.length < 2 || /^(uh|um|ah|eh|mm|hmm|hm)[\s.,]*$/i.test(cleanText)

    if (isOnlyNoise) {
      console.log("🔇 Only noise or filler words detected:", cleanText)
      return NextResponse.json(
        {
          error: "NO_CLEAR_SPEECH",
          message: "Solo se detectó ruido o sonidos sin palabras claras",
          suggestions: [
            "Intenta hablar con palabras completas",
            "Evita sonidos como 'um', 'ah', etc.",
            "Habla de forma más clara y pausada",
          ],
          originalText: result.text,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ text: result.text })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Transcription failed", details: String(error) }, { status: 500 })
  }
}
