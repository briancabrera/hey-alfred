"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

const VoiceChatPage = () => {
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<string>("alloy")
  const [stability, setStability] = useState<number>(0.5)
  const [similarityBoost, setSimilarityBoost] = useState<number>(0.5)
  const [useElevenLabs, setUseElevenLabs] = useState<boolean>(false)

  const { toast } = useToast()

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const context = new AudioContext()
        setAudioContext(context)
        const recorder = new MediaRecorder(stream)

        recorder.ondataavailable = (e) => {
          setAudioData(e.data)
        }

        recorder.onstop = () => {
          console.log("Recording stopped")
        }

        setMediaRecorder(recorder)
        setDebugInfo("Mic access granted.")
      } catch (error: any) {
        setDebugInfo(`Error accessing microphone: ${error.message}`)
      }
    }

    initializeAudio()

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      }
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  useEffect(() => {
    if (audioData) {
      const audioElement = audioRef.current
      if (audioElement) {
        const audioUrl = URL.createObjectURL(audioData)
        audioElement.src = audioUrl
        audioElement.onloadedmetadata = () => {
          URL.revokeObjectURL(audioUrl)
        }
      }
      setAudioData(null) // Reset audioData after using it
    }
  }, [audioData])

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      try {
        mediaRecorder.start()
        setIsRecording(true)
        setDebugInfo("Recording started...")
      } catch (error: any) {
        setDebugInfo(`Error starting recording: ${error.message}`)
      }
    } else {
      setDebugInfo("MediaRecorder not initialized or already recording.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      try {
        mediaRecorder.stop()
        setIsRecording(false)
        setDebugInfo("Recording stopped.")
      } catch (error: any) {
        setDebugInfo(`Error stopping recording: ${error.message}`)
      }
    } else {
      setDebugInfo("No recording in progress.")
    }
  }

  const sendMessage = async () => {
    if (inputText.trim() !== "") {
      setMessages([...messages, `You: ${inputText}`])
      setInputText("")
      // Simulate a response (replace with actual API call later)
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, `Bot: Echo - ${inputText}`])
      }, 500)
    }
  }

  const sendVoiceMessage = async () => {
    if (!audioData) {
      setDebugInfo("No audio data available to send.")
      return
    }

    setMessages([...messages, "You: (Voice Message)"])

    try {
      const formData = new FormData()
      formData.append("audio", audioData, "voice-message.webm")
      formData.append("model", "whisper-1")

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Transcription error:", errorData)
        setDebugInfo(`Transcription failed: ${response.statusText}`)
        toast({
          title: "Error transcribing audio",
          description: `Transcription failed: ${response.statusText}`,
          variant: "destructive",
        })
        return
      }

      const data = await response.json()
      const transcription = data.text

      setMessages((prevMessages) => [...prevMessages, `You (Voice): ${transcription}`])

      // ElevenLabs TTS
      if (useElevenLabs) {
        const elevenLabsResponse = await fetch("/api/elevenlabs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: transcription,
            voice: selectedVoice,
            stability: stability,
            similarityBoost: similarityBoost,
          }),
        })

        if (!elevenLabsResponse.ok) {
          const errorData = await elevenLabsResponse.json()
          console.error("ElevenLabs error:", errorData)
          setDebugInfo(`ElevenLabs failed: ${elevenLabsResponse.statusText}`)
          toast({
            title: "Error with ElevenLabs TTS",
            description: `ElevenLabs failed: ${elevenLabsResponse.statusText}`,
            variant: "destructive",
          })
          return
        }

        const audioBlob = await elevenLabsResponse.blob()
        const elevenLabsAudioUrl = URL.createObjectURL(audioBlob)

        setMessages((prevMessages) => [...prevMessages, `Bot (Voice): ${transcription}`])

        const audio = new Audio(elevenLabsAudioUrl)
        audio.play()

        audio.onended = () => {
          URL.revokeObjectURL(elevenLabsAudioUrl)
        }
      } else {
        // Simulate a response (replace with actual API call later)
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, `Bot: Echo - ${transcription}`])
        }, 500)
      }
    } catch (error: any) {
      console.error("Error sending voice message:", error)
      setDebugInfo(`Error sending voice message: ${error.message}`)
      toast({
        title: "Error sending voice message",
        description: `Error sending voice message: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Chat</h1>

      {/* Chat Messages */}
      <Card className="mb-4">
        <CardContent className="p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              {message}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Debug Info */}
      {debugInfo && (
        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="text-gray-500 font-mono text-xs">{debugInfo}</div>
          </CardContent>
        </Card>
      )}

      {/* Sugerencias para errores de voz */}
      {debugInfo && (debugInfo.includes("No se detectó voz") || debugInfo.includes("Solo ruido detectado")) && (
        <Card className="mb-4 sm:mb-6 bg-orange-900/20 border-2 border-orange-400/50 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="text-orange-400 font-mono text-xs sm:text-sm">
              <div className="flex items-center mb-2">
                <span className="mr-2">🎤</span>
                <span className="font-bold">CONSEJOS PARA MEJOR GRABACIÓN:</span>
              </div>
              <div className="space-y-1 text-xs ml-6">
                <div>{">"} Habla más cerca del micrófono</div>
                <div>{">"} Usa palabras completas y claras</div>
                <div>{">"} Reduce el ruido de fondo</div>
                <div>{">"} Presiona TRANSMITIR de nuevo para reintentar</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Area */}
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>

      {/* Voice Chat Controls */}
      <div className="mb-4">
        <Button onClick={isRecording ? stopRecording : startRecording} disabled={!mediaRecorder}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        <Button onClick={sendVoiceMessage} disabled={!audioData} className="ml-2">
          Transmitir
        </Button>
        <audio ref={audioRef} controls className="mt-2" />
      </div>

      {/* ElevenLabs Configuration */}
      <Separator className="mb-4" />
      <div className="mb-4 flex items-center space-x-2">
        <Switch id="elevenlabs" checked={useElevenLabs} onCheckedChange={setUseElevenLabs} />
        <Label htmlFor="elevenlabs">Use ElevenLabs TTS</Label>
      </div>

      {useElevenLabs && (
        <>
          <div className="mb-4">
            <Label htmlFor="voice">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alloy">Alloy</SelectItem>
                <SelectItem value="echo">Echo</SelectItem>
                <SelectItem value="fable">Fable</SelectItem>
                <SelectItem value="onyx">Onyx</SelectItem>
                <SelectItem value="nova">Nova</SelectItem>
                <SelectItem value="shimmer">Shimmer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="stability">Stability</Label>
            <Slider
              id="stability"
              defaultValue={[stability * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setStability(value[0] / 100)}
            />
            <p className="text-sm text-muted-foreground">Determines the stability of the voice.</p>
          </div>

          <div className="mb-4">
            <Label htmlFor="similarity-boost">Similarity Boost</Label>
            <Slider
              id="similarity-boost"
              defaultValue={[similarityBoost * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setSimilarityBoost(value[0] / 100)}
            />
            <p className="text-sm text-muted-foreground">Boost the similarity to the original speaker.</p>
          </div>
        </>
      )}
    </div>
  )
}

export default VoiceChatPage
