import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🎤 Transcription request received")

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      console.error("❌ No audio file provided in request")
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log(`📁 Audio file received: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`)

    // Check if GROQ_API_KEY is available
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY environment variable is not set")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Convert File to FormData for Groq API
    const groqFormData = new FormData()
    groqFormData.append("file", audioFile)
    groqFormData.append("model", "whisper-large-v3")
    groqFormData.append("response_format", "json")

    console.log("🚀 Sending request to Groq API...")

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: groqFormData,
    })

    console.log(`📡 Groq API response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Groq API error: ${response.status} ${response.statusText}`)
      console.error(`❌ Groq API error details: ${errorText}`)

      return NextResponse.json(
        {
          error: `Groq API error: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("✅ Transcription successful:", result.text?.substring(0, 100) + "...")

    return NextResponse.json({ text: result.text })
  } catch (error) {
    console.error("💥 Transcription error:", error)
    return NextResponse.json(
      {
        error: "Failed to transcribe audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
