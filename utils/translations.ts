export type Language = "es" | "en" | "fr" | "it" | "pt"

export interface Translations {
  // Header
  systemActive: string
  userLanguage: string
  alfredLanguage: string
  voice: string
  text: string

  // Alfred title and subtitle
  alfredSubtitle1: string
  alfredSubtitle2: string

  // Main interface
  recording: string
  stopRecording: string
  transmit: string
  record: string
  transmitting: string
  processing: string
  step1: string
  step2: string
  step3: string

  // Status messages
  recordingAudio: string
  audioCaptured: string
  decodingSignal: string
  alfredSpeaking: string
  voiceModeActive: string
  textModeActive: string

  // Buttons and actions
  repeat: string
  mute: string
  cancel: string
  cancelAndRecord: string

  // System messages
  systemInitialized: string
  alsoKnownAs: string
  supportedLanguages: string
  voiceMode: string
  textMode: string
  tryExample: string

  // Placeholders
  typeMessage: string

  // Home page
  conversationalAI: string
  languagesSupported: string
  unifiedInterface: string
  vocalTextCommunication: string
  neuralTranscription: string
  realtimeSynthesis: string
  intelligentChat: string
  startSession: string
  technicalSpecs: string
  neuralEngine: string
  ultraFastInference: string
  linguisticModel: string
  advancedReasoning: string
  audioProcessor: string
  languagesSupport: string
  systemOperational: string
  aiActive: string
  interfaceReady: string

  // Instructions
  multilingualInterface: string
  voiceModeInstructions: string
  textModeInstructions: string
  alfredWillRespond: string
  alfredWillDetect: string
  canCancel: string
}

export const translations: Record<Language, Translations> = {
  es: {
    // Header
    systemActive: "SISTEMA ACTIVO",
    userLanguage: "Usuario",
    alfredLanguage: "Alfred",
    voice: "VOZ",
    text: "TEXTO",

    // Alfred title and subtitle
    alfredSubtitle1: "ADVANCED LANGUAGE FACILITATOR",
    alfredSubtitle2: "FOR REAL-TIME ENGAGEMENT & DIALOGUE",

    // Main interface
    recording: "🔴 GRABANDO AUDIO... (Presiona para detener)",
    stopRecording: "DETENER",
    transmit: "TRANSMITIR",
    record: "GRABAR",
    transmitting: "TRANSMITIENDO...",
    processing: "PROCESANDO SOLICITUD...",
    step1: "Paso 1",
    step2: "Paso 2",
    step3: "Paso 3",

    // Status messages
    recordingAudio: "🔴 GRABANDO AUDIO... (Presiona para detener)",
    audioCaptured: "✅ AUDIO CAPTURADO",
    decodingSignal: "🔄 DECODIFICANDO SEÑAL NEURAL...",
    alfredSpeaking: "🔊 ALFRED HABLANDO EN",
    voiceModeActive: "🎤 MODO VOZ ACTIVO",
    textModeActive: "⌨️ MODO TEXTO ACTIVO",

    // Buttons and actions
    repeat: "REPETIR",
    mute: "SILENCIAR",
    cancel: "CANCELAR",
    cancelAndRecord: "CANCELAR Y VOLVER A GRABAR",

    // System messages
    systemInitialized: "A.L.F.R.E.D INICIALIZADO",
    alsoKnownAs: '"Alfred" para los amigos',
    supportedLanguages: "Idiomas soportados: 🇪🇸 Español • 🇺🇸 English • 🇫🇷 Français • 🇮🇹 Italiano • 🇧🇷 Português",
    voiceMode: "MODO VOZ: Graba → Detén → Transmite",
    textMode: "MODO TEXTO: Escribe y presiona Enter",
    tryExample: 'Prueba: "come vai, alfred?" (italiano)',

    // Placeholders
    typeMessage: "Escribe tu mensaje a Alfred...",

    // Home page
    conversationalAI: "SISTEMA DE IA CONVERSACIONAL ACTIVADO",
    languagesSupported: "5 IDIOMAS SOPORTADOS: 🇪🇸 🇺🇸 🇫🇷 🇮🇹 🇧🇷",
    unifiedInterface: "INTERFAZ UNIFICADA",
    vocalTextCommunication: "Comunicación vocal y textual integrada",
    neuralTranscription: "Transcripción neural avanzada",
    realtimeSynthesis: "Síntesis de voz en tiempo real",
    intelligentChat: "Chat inteligente multiidioma",
    startSession: "INICIAR SESIÓN CON A.L.F.R.E.D",
    technicalSpecs: "ESPECIFICACIONES TÉCNICAS",
    neuralEngine: "MOTOR NEURAL",
    ultraFastInference: "Inferencia ultra-rápida",
    linguisticModel: "MODELO LINGÜÍSTICO",
    advancedReasoning: "Razonamiento avanzado",
    audioProcessor: "PROCESADOR AUDIO",
    languagesSupport: "Soporte 5 idiomas",
    systemOperational: "SISTEMA OPERATIVO",
    aiActive: "IA ACTIVA",
    interfaceReady: "INTERFAZ READY",

    // Instructions
    multilingualInterface: "INTERFAZ MULTIIDIOMA:",
    voiceModeInstructions: "🎤 MODO VOZ: Graba → Detén → Transmite",
    textModeInstructions: "⌨️ MODO TEXTO: Escribe y presiona Enter",
    alfredWillRespond: "Alfred responderá en tu idioma con acento nativo",
    alfredWillDetect: "Alfred detectará tu idioma y responderá apropiadamente",
    canCancel: "💡 Puedes cancelar en el paso 3 para volver a grabar",
  },

  en: {
    // Header
    systemActive: "SYSTEM ACTIVE",
    userLanguage: "User",
    alfredLanguage: "Alfred",
    voice: "VOICE",
    text: "TEXT",

    // Alfred title and subtitle
    alfredSubtitle1: "ADVANCED LANGUAGE FACILITATOR",
    alfredSubtitle2: "FOR REAL-TIME ENGAGEMENT & DIALOGUE",

    // Main interface
    recording: "🔴 RECORDING AUDIO... (Press to stop)",
    stopRecording: "STOP",
    transmit: "TRANSMIT",
    record: "RECORD",
    transmitting: "TRANSMITTING...",
    processing: "PROCESSING REQUEST...",
    step1: "Step 1",
    step2: "Step 2",
    step3: "Step 3",

    // Status messages
    recordingAudio: "🔴 RECORDING AUDIO... (Press to stop)",
    audioCaptured: "✅ AUDIO CAPTURED",
    decodingSignal: "🔄 DECODING NEURAL SIGNAL...",
    alfredSpeaking: "🔊 ALFRED SPEAKING IN",
    voiceModeActive: "🎤 VOICE MODE ACTIVE",
    textModeActive: "⌨️ TEXT MODE ACTIVE",

    // Buttons and actions
    repeat: "REPEAT",
    mute: "MUTE",
    cancel: "CANCEL",
    cancelAndRecord: "CANCEL AND RECORD AGAIN",

    // System messages
    systemInitialized: "A.L.F.R.E.D INITIALIZED",
    alsoKnownAs: '"Alfred" to friends',
    supportedLanguages: "Supported languages: 🇪🇸 Español • 🇺🇸 English • 🇫🇷 Français • 🇮🇹 Italiano • 🇧🇷 Português",
    voiceMode: "VOICE MODE: Record → Stop → Transmit",
    textMode: "TEXT MODE: Type and press Enter",
    tryExample: 'Try: "come vai, alfred?" (Italian)',

    // Placeholders
    typeMessage: "Type your message to Alfred...",

    // Home page
    conversationalAI: "CONVERSATIONAL AI SYSTEM ACTIVATED",
    languagesSupported: "5 LANGUAGES SUPPORTED: 🇪🇸 🇺🇸 🇫🇷 🇮🇹 🇧🇷",
    unifiedInterface: "UNIFIED INTERFACE",
    vocalTextCommunication: "Integrated vocal and text communication",
    neuralTranscription: "Advanced neural transcription",
    realtimeSynthesis: "Real-time voice synthesis",
    intelligentChat: "Intelligent multilingual chat",
    startSession: "START SESSION WITH A.L.F.R.E.D",
    technicalSpecs: "TECHNICAL SPECIFICATIONS",
    neuralEngine: "NEURAL ENGINE",
    ultraFastInference: "Ultra-fast inference",
    linguisticModel: "LINGUISTIC MODEL",
    advancedReasoning: "Advanced reasoning",
    audioProcessor: "AUDIO PROCESSOR",
    languagesSupport: "5 languages support",
    systemOperational: "SYSTEM OPERATIONAL",
    aiActive: "AI ACTIVE",
    interfaceReady: "INTERFACE READY",

    // Instructions
    multilingualInterface: "MULTILINGUAL INTERFACE:",
    voiceModeInstructions: "🎤 VOICE MODE: Record → Stop → Transmit",
    textModeInstructions: "⌨️ TEXT MODE: Type and press Enter",
    alfredWillRespond: "Alfred will respond in your language with native accent",
    alfredWillDetect: "Alfred will detect your language and respond appropriately",
    canCancel: "💡 You can cancel in step 3 to record again",
  },

  fr: {
    // Header
    systemActive: "SYSTÈME ACTIF",
    userLanguage: "Utilisateur",
    alfredLanguage: "Alfred",
    voice: "VOIX",
    text: "TEXTE",

    // Alfred title and subtitle
    alfredSubtitle1: "ADVANCED LANGUAGE FACILITATOR",
    alfredSubtitle2: "FOR REAL-TIME ENGAGEMENT & DIALOGUE",

    // Main interface
    recording: "🔴 ENREGISTREMENT AUDIO... (Appuyez pour arrêter)",
    stopRecording: "ARRÊTER",
    transmit: "TRANSMETTRE",
    record: "ENREGISTRER",
    transmitting: "TRANSMISSION...",
    processing: "TRAITEMENT DE LA DEMANDE...",
    step1: "Étape 1",
    step2: "Étape 2",
    step3: "Étape 3",

    // Status messages
    recordingAudio: "🔴 ENREGISTREMENT AUDIO... (Appuyez pour arrêter)",
    audioCaptured: "✅ AUDIO CAPTURÉ",
    decodingSignal: "🔄 DÉCODAGE DU SIGNAL NEURAL...",
    alfredSpeaking: "🔊 ALFRED PARLE EN",
    voiceModeActive: "🎤 MODE VOIX ACTIF",
    textModeActive: "⌨️ MODE TEXTE ACTIF",

    // Buttons and actions
    repeat: "RÉPÉTER",
    mute: "MUET",
    cancel: "ANNULER",
    cancelAndRecord: "ANNULER ET RÉENREGISTRER",

    // System messages
    systemInitialized: "A.L.F.R.E.D INITIALISÉ",
    alsoKnownAs: '"Alfred" pour les amis',
    supportedLanguages: "Langues supportées: 🇪🇸 Español • 🇺🇸 English • 🇫🇷 Français • 🇮🇹 Italiano • 🇧🇷 Português",
    voiceMode: "MODE VOIX: Enregistrer → Arrêter → Transmettre",
    textMode: "MODE TEXTE: Tapez et appuyez sur Entrée",
    tryExample: 'Essayez: "come vai, alfred?" (italien)',

    // Placeholders
    typeMessage: "Tapez votre message à Alfred...",

    // Home page
    conversationalAI: "SYSTÈME D'IA CONVERSATIONNELLE ACTIVÉ",
    languagesSupported: "5 LANGUES SUPPORTÉES: 🇪🇸 🇺🇸 🇫🇷 🇮🇹 🇧🇷",
    unifiedInterface: "INTERFACE UNIFIÉE",
    vocalTextCommunication: "Communication vocale et textuelle intégrée",
    neuralTranscription: "Transcription neurale avancée",
    realtimeSynthesis: "Synthèse vocale en temps réel",
    intelligentChat: "Chat intelligent multilingue",
    startSession: "DÉMARRER SESSION AVEC A.L.F.R.E.D",
    technicalSpecs: "SPÉCIFICATIONS TECHNIQUES",
    neuralEngine: "MOTEUR NEURAL",
    ultraFastInference: "Inférence ultra-rapide",
    linguisticModel: "MODÈLE LINGUISTIQUE",
    advancedReasoning: "Raisonnement avancé",
    audioProcessor: "PROCESSEUR AUDIO",
    languagesSupport: "Support 5 langues",
    systemOperational: "SYSTÈME OPÉRATIONNEL",
    aiActive: "IA ACTIVE",
    interfaceReady: "INTERFACE PRÊTE",

    // Instructions
    multilingualInterface: "INTERFACE MULTILINGUE:",
    voiceModeInstructions: "🎤 MODE VOIX: Enregistrer → Arrêter → Transmettre",
    textModeInstructions: "⌨️ MODE TEXTE: Tapez et appuyez sur Entrée",
    alfredWillRespond: "Alfred répondra dans votre langue avec l'accent natif",
    alfredWillDetect: "Alfred détectera votre langue et répondra de manière appropriée",
    canCancel: "💡 Vous pouvez annuler à l'étape 3 pour réenregistrer",
  },

  it: {
    // Header
    systemActive: "SISTEMA ATTIVO",
    userLanguage: "Utente",
    alfredLanguage: "Alfred",
    voice: "VOCE",
    text: "TESTO",

    // Alfred title and subtitle
    alfredSubtitle1: "ADVANCED LANGUAGE FACILITATOR",
    alfredSubtitle2: "FOR REAL-TIME ENGAGEMENT & DIALOGUE",

    // Main interface
    recording: "🔴 REGISTRAZIONE AUDIO... (Premi per fermare)",
    stopRecording: "FERMA",
    transmit: "TRASMETTI",
    record: "REGISTRA",
    transmitting: "TRASMISSIONE...",
    processing: "ELABORAZIONE RICHIESTA...",
    step1: "Passo 1",
    step2: "Passo 2",
    step3: "Passo 3",

    // Status messages
    recordingAudio: "🔴 REGISTRAZIONE AUDIO... (Premi per fermare)",
    audioCaptured: "✅ AUDIO CATTURATO",
    decodingSignal: "🔄 DECODIFICA SEGNALE NEURALE...",
    alfredSpeaking: "🔊 ALFRED PARLA IN",
    voiceModeActive: "🎤 MODALITÀ VOCE ATTIVA",
    textModeActive: "⌨️ MODALITÀ TESTO ATTIVA",

    // Buttons and actions
    repeat: "RIPETI",
    mute: "MUTO",
    cancel: "ANNULLA",
    cancelAndRecord: "ANNULLA E REGISTRA DI NUOVO",

    // System messages
    systemInitialized: "A.L.F.R.E.D INIZIALIZZATO",
    alsoKnownAs: '"Alfred" per gli amici',
    supportedLanguages: "Lingue supportate: 🇪🇸 Español • 🇺🇸 English • 🇫🇷 Français • 🇮🇹 Italiano • 🇧🇷 Português",
    voiceMode: "MODALITÀ VOCE: Registra → Ferma → Trasmetti",
    textMode: "MODALITÀ TESTO: Scrivi e premi Invio",
    tryExample: 'Prova: "come vai, alfred?" (italiano)',

    // Placeholders
    typeMessage: "Scrivi il tuo messaggio ad Alfred...",

    // Home page
    conversationalAI: "SISTEMA IA CONVERSAZIONALE ATTIVATO",
    languagesSupported: "5 LINGUE SUPPORTATE: 🇪🇸 🇺🇸 🇫🇷 🇮🇹 🇧🇷",
    unifiedInterface: "INTERFACCIA UNIFICATA",
    vocalTextCommunication: "Comunicazione vocale e testuale integrata",
    neuralTranscription: "Trascrizione neurale avanzata",
    realtimeSynthesis: "Sintesi vocale in tempo reale",
    intelligentChat: "Chat intelligente multilingue",
    startSession: "INIZIA SESSIONE CON A.L.F.R.E.D",
    technicalSpecs: "SPECIFICHE TECNICHE",
    neuralEngine: "MOTORE NEURALE",
    ultraFastInference: "Inferenza ultra-veloce",
    linguisticModel: "MODELLO LINGUISTICO",
    advancedReasoning: "Ragionamento avanzato",
    audioProcessor: "PROCESSORE AUDIO",
    languagesSupport: "Supporto 5 lingue",
    systemOperational: "SISTEMA OPERATIVO",
    aiActive: "IA ATTIVA",
    interfaceReady: "INTERFACCIA PRONTA",

    // Instructions
    multilingualInterface: "INTERFACCIA MULTILINGUE:",
    voiceModeInstructions: "🎤 MODALITÀ VOCE: Registra → Ferma → Trasmetti",
    textModeInstructions: "⌨️ MODALITÀ TESTO: Scrivi e premi Invio",
    alfredWillRespond: "Alfred risponderà nella tua lingua con accento nativo",
    alfredWillDetect: "Alfred rileverà la tua lingua e risponderà appropriatamente",
    canCancel: "💡 Puoi annullare al passo 3 per registrare di nuovo",
  },

  pt: {
    // Header
    systemActive: "SISTEMA ATIVO",
    userLanguage: "Usuário",
    alfredLanguage: "Alfred",
    voice: "VOZ",
    text: "TEXTO",

    // Alfred title and subtitle
    alfredSubtitle1: "ADVANCED LANGUAGE FACILITATOR",
    alfredSubtitle2: "FOR REAL-TIME ENGAGEMENT & DIALOGUE",

    // Main interface
    recording: "🔴 GRAVANDO ÁUDIO... (Pressione para parar)",
    stopRecording: "PARAR",
    transmit: "TRANSMITIR",
    record: "GRAVAR",
    transmitting: "TRANSMITINDO...",
    processing: "PROCESSANDO SOLICITAÇÃO...",
    step1: "Passo 1",
    step2: "Passo 2",
    step3: "Passo 3",

    // Status messages
    recordingAudio: "🔴 GRAVANDO ÁUDIO... (Pressione para parar)",
    audioCaptured: "✅ ÁUDIO CAPTURADO",
    decodingSignal: "🔄 DECODIFICANDO SINAL NEURAL...",
    alfredSpeaking: "🔊 ALFRED FALANDO EM",
    voiceModeActive: "🎤 MODO VOZ ATIVO",
    textModeActive: "⌨️ MODO TEXTO ATIVO",

    // Buttons and actions
    repeat: "REPETIR",
    mute: "SILENCIAR",
    cancel: "CANCELAR",
    cancelAndRecord: "CANCELAR E GRAVAR NOVAMENTE",

    // System messages
    systemInitialized: "A.L.F.R.E.D INICIALIZADO",
    alsoKnownAs: '"Alfred" para os amigos',
    supportedLanguages: "Idiomas suportados: 🇪🇸 Español • 🇺🇸 English • 🇫🇷 Français • 🇮🇹 Italiano • 🇧🇷 Português",
    voiceMode: "MODO VOZ: Grave → Pare → Transmita",
    textMode: "MODO TEXTO: Digite e pressione Enter",
    tryExample: 'Tente: "come vai, alfred?" (italiano)',

    // Placeholders
    typeMessage: "Digite sua mensagem para Alfred...",

    // Home page
    conversationalAI: "SISTEMA DE IA CONVERSACIONAL ATIVADO",
    languagesSupported: "5 IDIOMAS SUPORTADOS: 🇪🇸 🇺🇸 🇫🇷 🇮🇹 🇧🇷",
    unifiedInterface: "INTERFACE UNIFICADA",
    vocalTextCommunication: "Comunicação vocal e textual integrada",
    neuralTranscription: "Transcrição neural avançada",
    realtimeSynthesis: "Síntese de voz em tempo real",
    intelligentChat: "Chat inteligente multilíngue",
    startSession: "INICIAR SESSÃO COM A.L.F.R.E.D",
    technicalSpecs: "ESPECIFICAÇÕES TÉCNICAS",
    neuralEngine: "MOTOR NEURAL",
    ultraFastInference: "Inferência ultra-rápida",
    linguisticModel: "MODELO LINGUÍSTICO",
    advancedReasoning: "Raciocínio avançado",
    audioProcessor: "PROCESSADOR DE ÁUDIO",
    languagesSupport: "Suporte a 5 idiomas",
    systemOperational: "SISTEMA OPERACIONAL",
    aiActive: "IA ATIVA",
    interfaceReady: "INTERFACE PRONTA",

    // Instructions
    multilingualInterface: "INTERFACE MULTILÍNGUE:",
    voiceModeInstructions: "🎤 MODO VOZ: Grave → Pare → Transmita",
    textModeInstructions: "⌨️ MODO TEXTO: Digite e pressione Enter",
    alfredWillRespond: "Alfred responderá no seu idioma com sotaque nativo",
    alfredWillDetect: "Alfred detectará seu idioma e responderá apropriadamente",
    canCancel: "💡 Você pode cancelar no passo 3 para gravar novamente",
  },
}

export function getLanguageFromCode(langCode: string): Language {
  const langMap: Record<string, Language> = {
    "es-ES": "es",
    "en-US": "en",
    "fr-FR": "fr",
    "it-IT": "it",
    "pt-BR": "pt",
  }
  return langMap[langCode] || "es"
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
