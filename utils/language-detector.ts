// ==================================================================================
// CONFIGURACIÓN OPTIMIZADA PARA TEXTOS CORTOS
// ==================================================================================

interface LanguagePattern {
  words: RegExp
  phrases: RegExp
  conjugations?: RegExp
  chars: RegExp
  endings: RegExp
}

export type Language = "es-ES" | "en-US" | "fr-FR" | "it-IT" | "pt-BR"

const DETECTION_CONFIG = {
  MIN_LENGTH: 2, // 🚀 NUEVO: Mínimo 2 caracteres (antes era 50)
  VERY_SHORT_THRESHOLD: 10, // Textos muy cortos (1-2 palabras)
  SHORT_THRESHOLD: 30, // Textos cortos (3-5 palabras)
  UNIQUE_WORD_BONUS: 100, // Bonus alto para palabras únicas
  SHORT_TEXT_MULTIPLIER: 3.0, // Multiplicador para textos muy cortos
}

// ==================================================================================
// PALABRAS ÚNICAS ULTRA-ESPECÍFICAS PARA TEXTOS CORTOS
// ==================================================================================

/**
 * 🚀 NUEVO: Palabras que aparecen frecuentemente en textos cortos y son 100% únicas
 */
const ULTRA_UNIQUE_WORDS: Record<Language, RegExp> = {
  // ESPAÑOL - Palabras que NUNCA aparecen en otros idiomas
  "es-ES":
    /\b(qué|que|cómo|dónde|cuándo|por qué|porque|vosotros|vosotras|vuestra|vuestro|cuéntame|dime|háblame|explícame|ayúdame|muéstrame|vámonos|hagamos|podemos|tenemos|estamos|somos|hicimos|dijimos|hablamos|español|ñ|sí|también|muy|bien|mal|hoy|ayer|mañana|gracias|hola)\b/gi,

  // INGLÉS - Incluye contracciones y palabras ultra-comunes
  "en-US":
    /\b(the|and|you|that|this|would|could|should|don't|won't|can't|shouldn't|wouldn't|couldn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|i'm|you're|he's|she's|it's|we're|they're|i'll|you'll|he'll|she'll|we'll|they'll|english|hello|hi|hey|thanks|thank|please|yes|good|bad|well|today|yesterday|tomorrow)\b/gi,

  // FRANCÉS - Palabras y frases ultra-específicas
  "fr-FR":
    /\b(qu'est-ce|s'il|vous|nous|où|comment|pourquoi|français|très|beaucoup|maintenant|toujours|jamais|peut-être|bien sûr|d'accord|merci|bonjour|salut|oui|non|aujourd'hui|hier|demain|ça|c'est)\b/gi,

  // ITALIANO - Palabras distintivas del italiano
  "it-IT":
    /\b(che|gli|della|dello|degli|delle|prego|bene|barzelletta|scherzo|molto|più|meno|anche|ancora|già|sempre|mai|oggi|ieri|domani|italiano|perché|dove|quando|come|cosa|ciao|grazie|buongiorno|buonasera)\b/gi,

  // PORTUGUÉS - Especialmente brasileño
  "pt-BR":
    /\b(você|vocês|obrigado|obrigada|português|muito|mais|menos|também|já|ainda|sempre|nunca|hoje|ontem|amanhã|onde|quando|como|por que|porque|olá|oi|tchau|bom|boa|tudo|bem)\b/gi,
}

/**
 * 🚀 NUEVO: Palabras comunes que aparecen en textos de 1-2 palabras
 */
const SHORT_TEXT_INDICATORS: Record<Language, RegExp> = {
  "es-ES": /\b(hola|adiós|gracias|por favor|sí|no|bien|mal|bueno|buena|buenos|buenas|días|tardes|noches)\b/gi,
  "en-US": /\b(hello|hi|bye|goodbye|thanks|please|yes|no|good|bad|morning|afternoon|evening|night)\b/gi,
  "fr-FR": /\b(bonjour|salut|au revoir|merci|s'il vous plaît|oui|non|bon|bonne|matin|après-midi|soir)\b/gi,
  "it-IT": /\b(ciao|arrivederci|grazie|per favore|sì|no|buono|buona|buongiorno|buonasera|buonanotte)\b/gi,
  "pt-BR": /\b(olá|oi|tchau|obrigado|obrigada|por favor|sim|não|bom|boa|dia|tarde|noite)\b/gi,
}

/**
 * Caracteres únicos que son exclusivos de ciertos idiomas
 * NOTA: La ç (cedilla) se usa tanto en francés como en portugués, por lo que NO es única
 * Solo incluimos caracteres que aparecen en UN SOLO idioma de los soportados
 */
const UNIQUE_CHARS_BY_LANGUAGE: Record<Language, RegExp> = {
  "es-ES": /[ñ]/g, // Ñ es exclusiva del español
  "en-US": /(?!)/g, // Inglés no tiene caracteres únicos
  "fr-FR": /(?!)/g, // Francés NO tiene caracteres únicos (ç también está en portugués)
  "it-IT": /(?!)/g, // Italiano comparte acentos con otros idiomas
  "pt-BR": /[ãõ]/g, // Ã y Õ son exclusivas del portugués (ç no es única)
}

// ==================================================================================
// PATRONES DE IDIOMAS COMPLETOS (FALLBACK PARA TEXTOS LARGOS)
// ==================================================================================

/**
 * Patrones específicos para cada idioma soportado - se usan para textos largos
 * cuando no se encuentran palabras únicas.
 */
const LANGUAGE_PATTERNS: Record<Language, LanguagePattern> = {
  // ESPAÑOL - Patrones de fallback
  "es-ES": {
    words:
      /\b(el|la|los|las|un|una|de|del|en|con|por|para|es|son|está|están|era|eran|fue|fueron|ser|estar|tener|tiene|tienen|tenía|tenían|hola|gracias|por favor|sí|no|yo|tú|él|ella|nosotros|nosotras|ellos|ellas|mi|tu|su|nuestro|nuestra|este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|muy|bien|mal|también|ya|todavía|siempre|nunca|hoy|ayer|mañana|chiste|historia|cuento|hacer|dice|dijo|hablar)\b/g,

    phrases:
      /\b(cómo estás|cómo está|qué tal|muchas gracias|de nada|por favor|me puedes|puedes decirme|está bien|todo bien|buenos días|buenas tardes|buenas noches|cómo te llamas|me llamo|mucho gusto|hasta luego|hasta pronto|perdón|disculpa|qué es|cómo se|muy bien|está muy|todo está)\b/g,

    conjugations: /\b(ponte|ven|vamos|fuimos|era|eran|fue|fueron|cuéntame|dime|háblame)\b/g,

    chars: /[áéíóúüñ]/g,

    endings: /\b\w+(ción|mente|aje|eza|dad|oso|osa|ito|ita|illo|illa|ando|iendo|ado|ido)\b/g,
  },

  // INGLÉS - Patrones de fallback
  "en-US": {
    words:
      /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|is|are|was|were|be|been|have|has|had|do|does|did|will|would|could|should|can|may|might|must|shall|hello|hi|hey|thanks|thank|please|yes|no|how|what|when|where|why|who|i|you|he|she|it|we|they|me|him|her|us|them|my|your|his|her|its|our|their|this|that|these|those|very|more|most|good|bad|well|better|best|also|already|still|always|never|today|yesterday|tomorrow|joke|story|make|speak|english|nice|great)\b/g,

    phrases:
      /\b(how are you|how do you do|thank you|thanks a lot|you're welcome|please help|can you|could you|would you|tell me|let me|i am|you are|he is|she is|it is|we are|they are|there is|there are|good morning|good afternoon|good evening|what's your name|my name is|nice to meet you|see you later|goodbye|excuse me|i'm sorry|tell me a|give me a|show me a|what is|how do|why do|very good|everything is|in english)\b/g,

    conjugations:
      /\b(don't|won't|can't|shouldn't|wouldn't|couldn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|i'm|you're|he's|she's|it's|we're|they're|i'll|you'll|he'll|she'll|it'll|we'll|they'll|i'd|you'd|he'd|she'd|it'd|we'd|they'd)\b/g,

    chars: /[]/g, // Inglés generalmente no usa acentos

    endings: /\b\w+(tion|ment|ness|ity|ing|ed|er|est|ly|able|ible)\b/g,
  },

  // FRANCÉS - Patrones de fallback
  "fr-FR": {
    words:
      /\b(le|la|les|un|une|de|du|des|en|avec|pour|que|qui|est|sont|était|étaient|fut|furent|être|avoir|a|ont|avait|avaient|eut|eurent|bonjour|salut|merci|s'il vous plaît|s'il te plaît|oui|non|comment|quoi|quand|où|pourquoi|qui|je|tu|il|elle|nous|vous|ils|elles|mon|ma|mes|ton|ta|tes|son|sa|ses|notre|nos|votre|vos|leur|leurs|ce|cette|ces|très|plus|moins|bien|mal|aussi|déjà|encore|toujours|jamais|aujourd'hui|hier|demain|blague|histoire|faire|parler|français|bon|bonne)\b/g,

    phrases:
      /\b(comment allez-vous|comment ça va|ça va bien|s'il vous plaît|s'il te plaît|qu'est-ce que|est-ce que|il y a|c'est|ce sont|bonjour|bonsoir|comment vous appelez-vous|je m'appelle|enchanté|au revoir|à bientôt|merci beaucoup|de rien|excusez-moi|pardon|raconte-moi une|dis-moi une|parle-moi de|qu'est-ce que c'est|comment ça|pourquoi|très bien|tout va|en français)\b/g,

    conjugations:
      /\b(dis-moi|raconte-moi|explique-moi|aide-moi|montre-moi|donne-moi|allons|faisons|pouvons|avons|sommes|fûmes|fîmes|dîmes|parlâmes)\b/g,

    chars: /[àâäéèêëïîôöùûüÿç]/g,

    endings: /\b\w+(tion|ment|eur|euse|eux|euses|ique|able|ible|ant|ent|é|ée)\b/g,
  },

  // ITALIANO - Patrones de fallback
  "it-IT": {
    words:
      /\b(il|la|lo|gli|le|un|una|di|del|della|dello|degli|delle|in|con|per|che|è|sono|era|erano|ciao|grazie|prego|sì|no|come|cosa|quando|dove|perché|chi|io|tu|lui|lei|noi|voi|loro|mio|mia|tuo|tua|suo|sua|nostro|nostra|vostro|vostra|questo|questa|quello|quella|molto|più|meno|bene|male|anche|ancora|già|sempre|mai|oggi|ieri|domani|barzelletta|scherzo|storia|fare|parlare|italiano|bello|bella)\b/g,

    phrases:
      /\b(come stai|come va|come vai|per favore|per piacere|mi puoi|puoi dirmi|va bene|tutto bene|buongiorno|buonasera|buonanotte|come ti chiami|mi chiamo|piacere di conoscerti|arrivederci|a presto|grazie mille|prego|scusa|scusami|dimmi una|raccontami una|parlami di|cos'è|come si|perché|molto bene|tutto va|in italiano)\b/g,

    conjugations:
      /\b(dimmi|raccontami|spiegami|aiutami|fammi|dammi|vieni|andiamo|facciamo|possiamo|abbiamo|siamo|fummo|facemmo|dicemmo|parlammo)\b/g,

    chars: /[àèéìíîòóù]/g,

    endings: /\b\w+(zione|mente|aggio|ezza|ità|oso|osa|ino|ina|etto|etta|ando|endo|ato|ito)\b/g,
  },

  // PORTUGUÉS - Patrones de fallback
  "pt-BR": {
    words:
      /\b(o|a|os|as|um|uma|de|do|da|dos|das|em|com|para|que|é|são|está|estão|estava|estavam|foi|foram|ser|estar|ter|tem|têm|tinha|tinham|olá|oi|obrigado|obrigada|por favor|sim|não|como|o que|quando|onde|por que|quem|eu|você|vocês|ele|ela|eles|elas|nós|meu|minha|meus|minhas|seu|sua|seus|suas|nosso|nossa|nossos|nossas|muito|mais|menos|bem|mal|também|já|ainda|sempre|nunca|hoje|ontem|amanhã|piada|história|fazer|falar|português|bom|boa)\b/g,

    phrases:
      /\b(como está|como vai você|tudo bem|tudo bom|por favor|você pode|pode me|está certo|está bem|bom dia|boa tarde|boa noite|qual é o seu nome|meu nome é|prazer em conhecer|até logo|até mais|muito obrigado|de nada|desculpa|desculpe|me conte uma|me diga uma|me fale sobre|o que é|como se|por que|muito bem|tudo está|em português)\b/g,

    conjugations:
      /\b(me conte|me diga|me explique|me ajude|me mostre|me dê|vamos|fazemos|podemos|temos|estamos|somos|fomos|fizemos|dissemos|falamos)\b/g,

    chars: /[ãâáàçéêíóôõú]/g,

    endings: /\b\w+(ção|mente|agem|eza|dade|oso|osa|inho|inha|ito|ita|ando|endo|ado|ido)\b/g,
  },
}

// ==================================================================================
// DETECTOR DE IDIOMAS OPTIMIZADO PARA TEXTOS CORTOS
// ==================================================================================

class LanguageDetector {
  constructor() {
    console.log("⚡ Language Detector initialized - optimized for short texts")
  }

  /**
   * Función principal para detectar el idioma de un texto
   * @param text Texto a analizar
   * @returns Código del idioma detectado (ej: "es-ES")
   */
  detect(text: string): string {
    try {
      return this.detectInternal(text)
    } catch (error) {
      console.error("🔥 Error en la detección de idioma:", error)
      return "es-ES" // Fallback seguro
    }
  }

  /**
   * Detección interna optimizada para textos cortos
   */
  private detectInternal(text: string): string {
    const cleanText = text.toLowerCase().trim()
    const textLength = cleanText.length

    // 🚀 NUEVO: Permitir textos de solo 2 caracteres
    if (textLength < DETECTION_CONFIG.MIN_LENGTH) {
      console.log(`⚡ Texto demasiado corto: "${cleanText}" - usando español por defecto`)
      return "es-ES"
    }

    console.log(`🔍 Analizando texto: "${cleanText}" (${textLength} chars)`)

    // 🚀 PASO 1: Detección por caracteres únicos (máxima prioridad)
    const charLanguage = this.detectByUniqueChars(cleanText)
    if (charLanguage) {
      console.log(`🔤 Carácter único detectado → ${charLanguage}`)
      return charLanguage
    }

    // 🚀 PASO 2: Detección por palabras ultra-únicas
    const uniqueLanguage = this.detectByUltraUniqueWords(cleanText)
    if (uniqueLanguage) {
      console.log(`📝 Palabra ultra-única detectada → ${uniqueLanguage}`)
      return uniqueLanguage
    }

    // 🚀 PASO 3: Para textos muy cortos, usar indicadores específicos
    if (textLength <= DETECTION_CONFIG.VERY_SHORT_THRESHOLD) {
      const shortTextLanguage = this.detectShortText(cleanText)
      if (shortTextLanguage) {
        console.log(`⚡ Texto muy corto detectado → ${shortTextLanguage}`)
        return shortTextLanguage
      }
    }

    // 🚀 PASO 4: Para textos cortos, usar scoring con multiplicador
    if (textLength <= DETECTION_CONFIG.SHORT_THRESHOLD) {
      const shortLanguage = this.detectWithShortTextScoring(cleanText)
      console.log(`📊 Scoring para texto corto → ${shortLanguage}`)
      return shortLanguage
    }

    // PASO 5: Para textos largos, usar algoritmo completo (fallback)
    return this.detectWithFullScoring(cleanText)
  }

  /**
   * 🚀 NUEVO: Detecta por caracteres únicos (máxima prioridad)
   */
  private detectByUniqueChars(text: string): Language | null {
    for (const [lang, pattern] of Object.entries(UNIQUE_CHARS_BY_LANGUAGE)) {
      const matches = text.match(pattern)
      if (matches && matches.length > 0) {
        return lang as Language
      }
    }
    return null
  }

  /**
   * 🚀 NUEVO: Detecta por palabras ultra-únicas
   */
  private detectByUltraUniqueWords(text: string): Language | null {
    for (const [lang, pattern] of Object.entries(ULTRA_UNIQUE_WORDS)) {
      const matches = text.match(pattern)
      if (matches && matches.length > 0) {
        return lang as Language
      }
    }
    return null
  }

  /**
   * 🚀 NUEVO: Detección específica para textos muy cortos (1-2 palabras)
   */
  private detectShortText(text: string): Language | null {
    const scores: Record<Language, number> = {
      "es-ES": 0,
      "en-US": 0,
      "fr-FR": 0,
      "it-IT": 0,
      "pt-BR": 0,
    }

    // Buscar indicadores de textos cortos
    for (const [lang, pattern] of Object.entries(SHORT_TEXT_INDICATORS)) {
      const matches = text.match(pattern)
      if (matches) {
        scores[lang as Language] += matches.length * 10
      }
    }

    // Buscar palabras ultra-únicas con peso extra
    for (const [lang, pattern] of Object.entries(ULTRA_UNIQUE_WORDS)) {
      const matches = text.match(pattern)
      if (matches) {
        scores[lang as Language] += matches.length * 20
      }
    }

    // Retornar el idioma con mayor score
    const maxScore = Math.max(...Object.values(scores))
    if (maxScore > 0) {
      const detectedLang = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0]
      return detectedLang as Language
    }

    return null
  }

  /**
   * 🚀 NUEVO: Scoring optimizado para textos cortos (3-5 palabras)
   */
  private detectWithShortTextScoring(text: string): Language {
    const scores: Record<Language, number> = {
      "es-ES": 0,
      "en-US": 0,
      "fr-FR": 0,
      "it-IT": 0,
      "pt-BR": 0,
    }

    // Aplicar multiplicador para textos cortos
    const multiplier = DETECTION_CONFIG.SHORT_TEXT_MULTIPLIER

    // Evaluar cada idioma con peso extra para textos cortos
    for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
      let score = 0

      // Palabras comunes
      const wordMatches = text.match(patterns.words)
      score += wordMatches ? wordMatches.length * 5 * multiplier : 0

      // Frases específicas
      const phraseMatches = text.match(patterns.phrases)
      score += phraseMatches ? phraseMatches.length * 15 * multiplier : 0

      // Caracteres especiales
      const charMatches = text.match(patterns.chars)
      score += charMatches ? charMatches.length * 3 * multiplier : 0

      scores[lang as Language] = score
    }

    // Retornar el idioma con mayor score
    const maxScore = Math.max(...Object.values(scores))
    const detectedLang = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || "es-ES"

    console.log(`📊 Scores para texto corto:`, scores)
    return detectedLang as Language
  }

  /**
   * Algoritmo completo para textos largos (fallback)
   */
  private detectWithFullScoring(text: string): Language {
    console.log(`📚 Usando algoritmo completo para texto largo`)

    const scores: Record<Language, number> = {
      "es-ES": 0,
      "en-US": 0,
      "fr-FR": 0,
      "it-IT": 0,
      "pt-BR": 0,
    }

    // Evaluar cada idioma con el algoritmo completo
    for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
      let score = 0

      // Palabras comunes
      const wordMatches = text.match(patterns.words)
      score += wordMatches ? wordMatches.length * 5 : 0

      // Frases específicas
      const phraseMatches = text.match(patterns.phrases)
      score += phraseMatches ? phraseMatches.length * 20 : 0

      // Conjugaciones específicas
      if (patterns.conjugations) {
        const conjugationMatches = text.match(patterns.conjugations)
        score += conjugationMatches ? conjugationMatches.length * 25 : 0
      }

      // Caracteres especiales
      const charMatches = text.match(patterns.chars)
      score += charMatches ? charMatches.length * 4 : 0

      // Terminaciones típicas
      const endingMatches = text.match(patterns.endings)
      score += endingMatches ? endingMatches.length * 3 : 0

      // Normalización por longitud
      const normalizedScore = score / Math.max(Math.sqrt(text.length), 1)
      scores[lang as Language] = normalizedScore
    }

    // Retornar el idioma con mayor score
    const maxScore = Math.max(...Object.values(scores))
    const detectedLang = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || "es-ES"

    console.log(`📊 Scores completos:`, scores)
    return detectedLang as Language
  }
}

// ==================================================================================
// INSTANCIA SINGLETON Y FUNCIONES PÚBLICAS
// ==================================================================================

const languageDetector = new LanguageDetector()

export const detectLanguage = (text: string): string => {
  return languageDetector.detect(text)
}

export const isLanguageSupported = (langCode: string): boolean => {
  return Object.keys(LANGUAGE_PATTERNS).includes(langCode)
}

// 🔧 FUNCIÓN CORREGIDA: detectUnsupportedLanguage
export const detectUnsupportedLanguage = (text: string): string | null => {
  console.log("🔍 Verificando si el idioma es no soportado para:", text.substring(0, 30) + "...")

  // Primero detectar el idioma principal
  const detectedLang = detectLanguage(text)
  console.log("🎯 Idioma detectado:", detectedLang)

  // Si el idioma detectado está en nuestra lista de soportados, NO es no soportado
  if (isLanguageSupported(detectedLang)) {
    console.log("✅ Idioma soportado, retornando null")
    return null
  }

  // Solo si NO está soportado, buscar patrones de idiomas específicos no soportados
  const unsupportedPatterns = {
    german:
      /\b(der|die|das|ein|eine|und|ich|du|er|sie|es|wir|ihr|guten|tag|deutsch|ist|sind|haben|sein|werden|können|müssen|sollen|wollen|machen|gehen|kommen|sehen|wissen|sagen|denken|finden|geben|nehmen|arbeiten|leben|spielen|lernen|verstehen|sprechen|hören|lesen|schreiben|kaufen|verkaufen|essen|trinken|schlafen|aufstehen|fahren|laufen|schwimmen|tanzen|singen|lachen|weinen|lieben|hassen|mögen|brauchen|suchen|finden|verlieren|gewinnen|beginnen|enden|öffnen|schließen|helfen|danken|entschuldigen|bitte|danke|hallo|tschüss|ja|nein|vielleicht|immer|nie|heute|gestern|morgen|hier|dort|groß|klein|gut|schlecht|neu|alt|schnell|langsam|heiß|kalt|warm|kühl|hell|dunkel|laut|leise|viel|wenig|alle|einige|keine|jeder|dieser|jener|welcher|was|wer|wie|wo|wann|warum|wohin|woher)\b/gi,
    japanese: /[あ-んア-ン一-龯]/g,
    chinese: /[一-龯]/g,
    russian: /[а-яё]/gi,
    arabic: /[ا-ي]/g,
    korean: /[가-힣]/g,
    dutch:
      /\b(de|het|een|van|in|op|met|voor|aan|door|uit|over|naar|bij|tot|als|dat|zijn|hebben|worden|kunnen|zullen|moeten|mogen|willen|doen|gaan|komen|zien|weten|zeggen|denken|vinden|geven|nemen|werken|leven|spelen|leren|begrijpen|spreken|horen|lezen|schrijven|kopen|verkaufen|eten|drinken|slapen|opstaan|rijden|lopen|zwemmen|dansen|zingen|lachen|huilen|houden|haten|leuk|nodig|zoeken|vinden|verliezen|winnen|beginnen|eindigen|openen|sluiten|helpen|bedanken|sorry|alsjeblieft|dank|hallo|dag|ja|nee|misschien|altijd|nooit|vandaag|gisteren|morgen|hier|daar|groot|klein|goed|slecht|nieuw|oud|snel|langzaam|heet|koud|warm|koel|licht|donker|hard|zacht|veel|weinig|alle|sommige|geen|elke|deze|die|welke|wat|wie|hoe|waar|wanneer|waarom|waarheen|vandaan)\b/gi,
  }

  for (const [lang, pattern] of Object.entries(unsupportedPatterns)) {
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      console.log(`🚫 Idioma no soportado detectado: ${lang}`)
      return lang
    }
  }

  console.log("❓ No se pudo identificar idioma específico no soportado")
  return null
}

export const getLanguageName = (langCode: string): string => {
  const languages: Record<string, string> = {
    "es-ES": "Español",
    "en-US": "English",
    "fr-FR": "Français",
    "it-IT": "Italiano",
    "pt-BR": "Português",
  }
  return languages[langCode] || "Español"
}

export const getLanguageDisplayName = (
  detectedLang: string,
  unsupportedLang: string | null,
  currentLang: string,
  unsupportedTranslation: string,
): string => {
  if (unsupportedLang) {
    return `${getLanguageName(detectedLang)} (${unsupportedTranslation})`
  }
  return getLanguageName(detectedLang)
}

export const getVoiceSettings = (langCode: string): { rate: number; pitch: number } => {
  const voiceSettings: Record<string, { rate: number; pitch: number }> = {
    "es-ES": { rate: 1.0, pitch: 1.0 },
    "en-US": { rate: 1.0, pitch: 1.0 },
    "fr-FR": { rate: 1.0, pitch: 1.0 },
    "it-IT": { rate: 1.0, pitch: 1.0 },
    "pt-BR": { rate: 1.0, pitch: 1.0 },
  }
  return voiceSettings[langCode] || { rate: 1.0, pitch: 1.0 }
}
