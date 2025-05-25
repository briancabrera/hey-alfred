// Función mejorada para detectar el idioma del texto
export function detectLanguage(text: string): string {
  const cleanText = text.toLowerCase().trim()

  // Reducir el umbral mínimo para permitir detección en textos cortos
  if (cleanText.length < 3) {
    return "es-ES"
  }

  // Patrones más específicos y precisos para cada idioma
  const patterns = {
    // Italiano - patrones mejorados y más específicos
    "it-IT": {
      // Palabras muy específicas del italiano
      words:
        /\b(il|la|lo|gli|le|un|una|di|del|della|dello|degli|delle|in|con|per|che|è|sono|era|erano|ciao|grazie|prego|sì|no|come|cosa|quando|dove|perché|chi|io|tu|lui|lei|noi|voi|loro|mio|mia|tuo|tua|suo|sua|nostro|nostra|vostro|vostra|questo|questa|quello|quella|molto|più|meno|bene|male|anche|ancora|già|sempre|mai|oggi|ieri|domani)\b/g,
      // Frases muy específicas del italiano
      phrases:
        /\b(come stai|come va|come vai|per favore|per piacere|mi puoi|puoi dirmi|va bene|tutto bene|buongiorno|buonasera|buonanotte|come ti chiami|mi chiamo|piacere di conoscerti|arrivederci|a presto|grazie mille|prego|scusa|scusami)\b/g,
      // Caracteres específicos del italiano
      chars: /[àèéìíîòóù]/g,
      // Terminaciones típicas italianas
      endings: /\b\w+(zione|mente|aggio|ezza|ità|oso|osa|ino|ina|etto|etta)\b/g,
    },

    // Portugués - patrones mejorados para diferenciarlo del italiano
    "pt-BR": {
      // Palabras muy específicas del portugués
      words:
        /\b(o|a|os|as|um|uma|de|do|da|dos|das|em|com|para|que|é|são|está|estão|estava|estavam|foi|foram|ser|estar|ter|tem|têm|tinha|tinham|olá|oi|obrigado|obrigada|por favor|sim|não|como|o que|quando|onde|por que|quem|eu|você|vocês|ele|ela|eles|elas|nós|meu|minha|meus|minhas|seu|sua|seus|suas|nosso|nossa|nossos|nossas|muito|mais|menos|bem|mal|também|já|ainda|sempre|nunca|hoje|ontem|amanhã)\b/g,
      // Frases muy específicas del portugués
      phrases:
        /\b(como está|como vai você|tudo bem|tudo bom|por favor|você pode|pode me|está certo|está bem|bom dia|boa tarde|boa noite|qual é o seu nome|meu nome é|prazer em conhecer|até logo|até mais|muito obrigado|de nada|desculpa|desculpe)\b/g,
      // Caracteres específicos del portugués (incluyendo ã y õ que no tiene el italiano)
      chars: /[ãâáàçéêíóôõú]/g,
      // Terminaciones típicas portuguesas
      endings: /\b\w+(ção|mente|agem|eza|dade|oso|osa|inho|inha|ito|ita)\b/g,
    },

    // Español - patrones mejorados
    "es-ES": {
      words:
        /\b(el|la|los|las|un|una|de|del|en|con|por|para|que|es|son|está|están|era|eran|fue|fueron|ser|estar|tener|tiene|tienen|tenía|tenían|hola|gracias|por favor|sí|no|cómo|qué|cuándo|dónde|por qué|quién|yo|tú|él|ella|nosotros|nosotras|vosotros|vosotras|ellos|ellas|mi|tu|su|nuestro|nuestra|vuestro|vuestra|este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|muy|más|menos|bien|mal|también|ya|todavía|siempre|nunca|hoy|ayer|mañana)\b/g,
      phrases:
        /\b(cómo estás|cómo está|qué tal|muchas gracias|de nada|por favor|me puedes|puedes decirme|está bien|todo bien|buenos días|buenas tardes|buenas noches|cómo te llamas|me llamo|mucho gusto|hasta luego|hasta pronto|perdón|disculpa)\b/g,
      chars: /[ñáéíóúü]/g,
      endings: /\b\w+(ción|mente|aje|eza|dad|oso|osa|ito|ita|illo|illa)\b/g,
    },

    // Inglés - patrones muy específicos
    "en-US": {
      words:
        /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|is|are|was|were|be|been|have|has|had|do|does|did|will|would|could|should|can|may|might|must|shall|hello|hi|hey|thanks|thank|please|yes|no|how|what|when|where|why|who|i|you|he|she|it|we|they|me|him|her|us|them|my|your|his|her|its|our|their|this|that|these|those|very|more|most|good|bad|well|better|best|also|already|still|always|never|today|yesterday|tomorrow)\b/g,
      phrases:
        /\b(how are you|how do you do|thank you|thanks a lot|you're welcome|please help|can you|could you|would you|tell me|let me|i am|you are|he is|she is|it is|we are|they are|there is|there are|good morning|good afternoon|good evening|what's your name|my name is|nice to meet you|see you later|goodbye|excuse me|i'm sorry)\b/g,
      contractions:
        /\b(don't|won't|can't|shouldn't|wouldn't|couldn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|i'm|you're|he's|she's|it's|we're|they're|i'll|you'll|he'll|she'll|it'll|we'll|they'll|i'd|you'd|he'd|she'd|it'd|we'd|they'd)\b/g,
      endings: /\b\w+(tion|ment|ness|ity|ing|ed|er|est|ly)\b/g,
    },

    // Francés - patrones mejorados
    "fr-FR": {
      words:
        /\b(le|la|les|un|une|de|du|des|en|avec|pour|que|qui|est|sont|était|étaient|fut|furent|être|avoir|a|ont|avait|avaient|eut|eurent|bonjour|salut|merci|s'il vous plaît|s'il te plaît|oui|non|comment|quoi|quand|où|pourquoi|qui|je|tu|il|elle|nous|vous|ils|elles|mon|ma|mes|ton|ta|tes|son|sa|ses|notre|nos|votre|vos|leur|leurs|ce|cette|ces|très|plus|moins|bien|mal|aussi|déjà|encore|toujours|jamais|aujourd'hui|hier|demain)\b/g,
      phrases:
        /\b(comment allez-vous|comment ça va|ça va bien|s'il vous plaît|s'il te plaît|qu'est-ce que|est-ce que|il y a|c'est|ce sont|bonjour|bonsoir|comment vous appelez-vous|je m'appelle|enchanté|au revoir|à bientôt|merci beaucoup|de rien|excusez-moi|pardon)\b/g,
      chars: /[àâäéèêëïîôöùûüÿç]/g,
      endings: /\b\w+(tion|ment|eur|euse|eux|euses|ique|able|ible)\b/g,
    },
  }

  let maxScore = 0
  let detectedLang = "es-ES"
  const scores = {}

  // Evaluar cada idioma con sistema de puntuación mejorado
  for (const [lang, langPatterns] of Object.entries(patterns)) {
    let score = 0

    // Puntuación por palabras comunes (peso alto)
    const wordMatches = cleanText.match(langPatterns.words)
    if (wordMatches) {
      score += wordMatches.length * 4
    }

    // Puntuación por frases específicas (peso muy alto)
    if (langPatterns.phrases) {
      const phraseMatches = cleanText.match(langPatterns.phrases)
      if (phraseMatches) {
        score += phraseMatches.length * 15 // Aumentado el peso
      }
    }

    // Puntuación por contracciones en inglés (peso muy alto)
    if (langPatterns.contractions) {
      const contractionMatches = cleanText.match(langPatterns.contractions)
      if (contractionMatches) {
        score += contractionMatches.length * 12
      }
    }

    // Puntuación por caracteres especiales (peso medio-alto)
    if (langPatterns.chars) {
      const charMatches = cleanText.match(langPatterns.chars)
      if (charMatches) {
        score += charMatches.length * 3
      }
    }

    // Puntuación por terminaciones típicas (peso medio)
    if (langPatterns.endings) {
      const endingMatches = cleanText.match(langPatterns.endings)
      if (endingMatches) {
        score += endingMatches.length * 2
      }
    }

    // Para textos cortos, dar más peso a las coincidencias
    if (cleanText.length < 20) {
      score *= 1.5
    }

    // Normalizar score por longitud del texto (pero con menos impacto)
    const normalizedScore = score / Math.max(Math.sqrt(cleanText.length), 1)
    scores[lang] = { raw: score, normalized: normalizedScore }

    if (normalizedScore > maxScore) {
      maxScore = normalizedScore
      detectedLang = lang
    }
  }

  // Debug logging para entender mejor la detección
  console.log("Texto:", cleanText)
  console.log("Scores:", scores)
  console.log("Idioma detectado:", detectedLang)

  return detectedLang
}

// Lista de idiomas soportados
export const SUPPORTED_LANGUAGES = ["es-ES", "en-US", "fr-FR", "it-IT", "pt-BR"]

// Función para verificar si un idioma está soportado
export function isLanguageSupported(language: string): boolean {
  return SUPPORTED_LANGUAGES.includes(language)
}

// Función para detectar idiomas no soportados (mejorada)
export function detectUnsupportedLanguage(text: string): string | null {
  const cleanText = text.toLowerCase().trim()

  // Patrones para detectar idiomas no soportados
  const unsupportedPatterns = {
    // Alemán - patrones más específicos
    german: {
      words:
        /\b(der|die|das|ein|eine|und|oder|aber|ich|du|er|sie|es|wir|ihr|sie|mein|dein|sein|hallo|danke|bitte|ja|nein|wie|was|wann|wo|warum|wer|können|haben|sein|werden|müssen|sollen|wollen|dürfen|mögen|guten|tag|morgen|abend)\b/g,
      chars: /[äöüß]/g,
      phrases: /\b(guten tag|guten morgen|guten abend|wie geht es|auf wiedersehen|es tut mir leid)\b/g,
    },

    // Japonés
    japanese: {
      chars: /[あ-んア-ン一-龯]/g,
      words: /\b(です|である|ます|だ|の|を|に|は|が|と|で|から|まで|こんにちは|ありがとう|すみません)\b/g,
    },

    // Chino
    chinese: {
      chars: /[一-龯]/g,
      words: /\b(的|是|在|有|我|你|他|她|它|们|这|那|什么|怎么|为什么|哪里|什么时候)\b/g,
    },

    // Ruso
    russian: {
      chars: /[а-яё]/g,
      words:
        /\b(и|в|не|на|я|быть|тот|он|оно|она|они|а|то|все|она|так|его|но|да|ты|к|у|же|вы|за|бы|по|только|ее|мне|было|вот|от|меня|еще|нет|о|из|ему|теперь|когда|даже|ну|вдруг|ли|если|уже|или|ни|быть|иметь|мочь|сказать|знать|стать|есть|хотеть|видеть|идти|сидеть|понимать|делать|брать|год|рука|дело|жизнь|день)\b/g,
    },

    // Árabe
    arabic: {
      chars: /[ا-ي]/g,
      words:
        /\b(في|من|إلى|على|هذا|هذه|ذلك|تلك|التي|الذي|كان|كانت|يكون|تكون|هو|هي|أن|أو|لا|نعم|ما|متى|أين|كيف|لماذا|من)\b/g,
    },

    // Coreano
    korean: {
      chars: /[가-힣]/g,
      words:
        /\b(이|그|저|의|를|을|에|에서|로|으로|와|과|도|만|까지|부터|안녕하세요|감사합니다|죄송합니다|네|아니요)\b/g,
    },

    // Hindi
    hindi: {
      chars: /[अ-ह]/g,
      words: /\b(और|में|से|को|का|के|की|है|हैं|था|थे|होना|करना|यह|वह|मैं|तुम|आप|हम|वे|क्या|कब|कहाँ|कैसे|क्यों|कौन)\b/g,
    },
  }

  // Verificar patrones de idiomas no soportados
  for (const [lang, patterns] of Object.entries(unsupportedPatterns)) {
    let score = 0

    if (patterns.chars) {
      const charMatches = cleanText.match(patterns.chars)
      if (charMatches) score += charMatches.length * 3
    }

    if (patterns.words) {
      const wordMatches = cleanText.match(patterns.words)
      if (wordMatches) score += wordMatches.length * 5
    }

    if (patterns.phrases) {
      const phraseMatches = cleanText.match(patterns.phrases)
      if (phraseMatches) score += phraseMatches.length * 10
    }

    // Si el score es significativo, considerarlo como idioma no soportado
    if (score > 3) {
      return lang
    }
  }

  return null
}

// Función para obtener configuraciones de voz específicas por idioma
export function getVoiceSettings(language: string) {
  const settings = {
    "es-ES": { rate: 0.9, pitch: 1.0 },
    "en-US": { rate: 0.95, pitch: 1.1 },
    "fr-FR": { rate: 0.85, pitch: 1.05 },
    "it-IT": { rate: 0.9, pitch: 1.1 },
    "pt-BR": { rate: 0.9, pitch: 1.0 },
  }

  return settings[language] || settings["es-ES"]
}

export function getLanguageName(langCode: string): string {
  const languages: Record<string, string> = {
    "es-ES": "Español",
    "en-US": "English",
    "fr-FR": "Français",
    "it-IT": "Italiano",
    "pt-BR": "Português",
  }
  return languages[langCode] || "Español"
}
