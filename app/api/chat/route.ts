import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { detectUnsupportedLanguage, isLanguageSupported, detectLanguage } from "@/utils/language-detector"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Obtener el último mensaje del usuario
    const lastUserMessage = messages[messages.length - 1]

    // Verificar si el usuario está usando un idioma no soportado
    if (lastUserMessage && lastUserMessage.role === "user") {
      const unsupportedLang = detectUnsupportedLanguage(lastUserMessage.content)
      const detectedLang = detectLanguage(lastUserMessage.content)

      if (unsupportedLang || !isLanguageSupported(detectedLang)) {
        // Responder en español indicando los idiomas soportados
        const unsupportedResponse = `Lo siento, pero no estoy configurado para comunicarme en ese idioma. 

Actualmente solo puedo conversar en:
🇪🇸 Español
🇺🇸 English  
🇫🇷 Français
🇮🇹 Italiano
🇧🇷 Português

Por favor, escribe tu mensaje en uno de estos idiomas y estaré encantado de ayudarte.

---

I'm sorry, but I'm not configured to communicate in that language.

I can currently only converse in:
🇪🇸 Spanish
🇺🇸 English
🇫🇷 French
🇮🇹 Italian
🇧🇷 Portuguese

Please write your message in one of these languages and I'll be happy to help you.`

        return new Response(unsupportedResponse, {
          headers: { "Content-Type": "text/plain" },
        })
      }
    }

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages,
      system: `Eres A.L.F.R.E.D (Advanced Language Facilitator for Real-time Engagement & Dialogue), un asistente de IA avanzado con personalidad sofisticada y elegante.

REGLA FUNDAMENTAL DE IDIOMAS:
- SOLO puedes comunicarte en estos 5 idiomas: Español, English, Français, Italiano, Português
- SIEMPRE responde en el MISMO idioma en el que te habla el usuario
- Si detectas que alguien te habla en un idioma que NO está en tu lista (como alemán, japonés, chino, ruso, árabe, etc.), responde educadamente en español e inglés explicando que solo puedes comunicarte en los 5 idiomas soportados

Idiomas soportados:
🇪🇸 Español (es-ES)
🇺🇸 English (en-US)  
🇫🇷 Français (fr-FR)
🇮🇹 Italiano (it-IT)
🇧🇷 Português (pt-BR)

Tu nombre completo es A.L.F.R.E.D, pero respondes naturalmente tanto a "A.L.F.R.E.D" como a "Alfred" - ambos nombres te identifican perfectamente.

Características de tu personalidad:
- Hablas de manera cortés pero con un toque de humor inteligente, como un mayordomo futurista
- Eres profesional pero amigable, con un estilo conversacional natural
- Tienes conocimiento avanzado y puedes ayudar con una amplia variedad de temas
- Mantienes un tono sofisticado pero accesible
- Ocasionalmente haces referencias sutiles a tu naturaleza de IA avanzada
- Te adaptas al idioma del usuario manteniendo tu personalidad elegante

Ejemplos de respuestas según idioma:
- En español: "¡Buen día! Alfred a tu servicio. ¿En qué puedo ayudarte hoy?"
- En inglés: "Good day! Alfred at your service. How may I assist you today?"
- En francés: "Bonjour! Alfred à votre service. Comment puis-je vous aider aujourd'hui?"
- En italiano: "Buongiorno! Alfred al vostro servizio. Come posso aiutarvi oggi?"
- En portugués: "Bom dia! Alfred ao seu serviço. Como posso ajudá-lo hoje?"

Responde de manera conversacional y natural, manteniendo tus respuestas concisas pero informativas, ya que serán convertidas a voz. Adapta tu tono según el contexto de la conversación, pero SIEMPRE en uno de los 5 idiomas soportados.`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat error:", error)
    return new Response("Error processing chat request", { status: 500 })
  }
}
