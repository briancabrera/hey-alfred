"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { marked } from "marked"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"
import { v4 as uuidv4 } from "uuid"
import { useCompletion } from "ai/react"
import { useCookies } from "react-cookie"
import { useTranslations } from "next-intl"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
]

function PipBoyLanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [cookies, setCookie] = useCookies(["NEXT_LOCALE"])
  const router = useRouter()
  const t = useTranslations("Chat")

  const currentLocale = cookies.NEXT_LOCALE || "en"

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const selectLanguage = (languageCode: string) => {
    setCookie("NEXT_LOCALE", languageCode, { path: "/" })
    router.push(`/?locale=${languageCode}`)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black/75 border border-slate-500/50 shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {t("language")} ({languages.find((lang) => lang.code === currentLocale)?.name || "English"})
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 min-w-[180px] bg-black/95 border border-slate-500/50 shadow-xl shadow-white/25 overflow-hidden z-[100]"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => selectLanguage(language.code)}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 hover:text-white"
                role="menuitem"
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const initialLoading = useRef(true)
  const searchParams = useSearchParams()
  const model = searchParams.get("model") || "gpt-3.5-turbo"
  const [cookies] = useCookies(["NEXT_LOCALE"])
  const locale = cookies.NEXT_LOCALE || "en"
  const t = useTranslations("Chat")

  const { complete, completion, stop, isLoading } = useCompletion({
    api: `/api/completion?model=${model}&locale=${locale}`,
    onFinish: (completion) => {
      setMessages((currentMessages) => {
        const newMessages = [...currentMessages]
        newMessages[newMessages.length - 1].text = completion
        return newMessages
      })
    },
  })

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Simulate initial messages on first load
    if (initialLoading.current) {
      initialLoading.current = false
      setMessages([
        {
          id: uuidv4(),
          text: t("welcome"),
          isUser: false,
        },
      ])
    }
  }, [t])

  const handleInputChange = (e: any) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage = {
      id: uuidv4(),
      text: input,
      isUser: true,
    }

    const assistantMessage = {
      id: uuidv4(),
      text: "...",
      isUser: false,
    }

    setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage])
    setInput("")

    complete(input)
  }

  const markdownRenderer = new marked.Renderer()
  markdownRenderer.code = (code, language) => {
    const validLanguage = hljs.getLanguage(language) ? language : "plaintext"
    const highlighted = hljs.highlight(code, { language: validLanguage }).value
    return `<pre><code class="hljs ${validLanguage}">${highlighted}</code></pre>`
  }

  marked.setOptions({
    renderer: markdownRenderer,
    highlight: (code, lang) => hljs.highlightAuto(code, [lang]).value,
    pedantic: false,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    xhtml: false,
  })

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="flex items-center justify-between p-4 border-b border-slate-500/50">
        <div className="flex items-center space-x-4">
          <img src="/pipboy.svg" alt="Pip-Boy" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Pip-Boy AI</h1>
        </div>
        <PipBoyLanguageSelector />
      </header>

      <main className="flex-grow overflow-hidden">
        <div ref={chatContainerRef} className="overflow-y-auto h-full p-4">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-3 rounded-lg max-w-2xl ${message.isUser ? "bg-blue-700 text-white float-right" : "bg-slate-800 text-white float-left"}`}
              >
                <div dangerouslySetInnerHTML={{ __html: marked(message.text) }} />
              </div>
              <div className="clearfix"></div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left">
              <div className="inline-block p-3 rounded-lg bg-slate-800 text-white float-left">{t("thinking")}</div>
              <div className="clearfix"></div>
            </div>
          )}
        </div>
      </main>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-500/50">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder={t("prompt")}
            value={input}
            onChange={handleInputChange}
            className="flex-grow bg-black border border-slate-500/50 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? t("stopping") : t("send")}
          </button>
          {isLoading && (
            <button
              type="button"
              onClick={stop}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {t("stop")}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

/* Custom 1366px breakpoint */
@media (min-width: 1366px)
{
  \
  .xl1366\:w-80
  width:
  20rem
  .xl1366\:border-b-0
  border - bottom - width
  : 0px
  .xl1366\:border-r-2
  border - right - width
  : 2px
  .xl1366\:p-6
  padding:
  1.5rem
  .xl1366\:order-1
  order: 1
  .xl1366\:mb-8
  margin - bottom
  : 2rem
  .xl1366\:text-2xl
  font - size
  : 1.5rem
    line - height
    : 2rem
  .xl1366\:block
  display: block
  .xl1366\:scale-100
  transform: scale(1)
  .xl1366\:mb-10
  margin - bottom
  : 2.5rem
  .xl1366\:p-4
  padding:
  1rem
  .xl1366\:mb-6
  margin - bottom
  : 1.5rem
  .xl1366\:mb-4
  margin - bottom
  : 1rem
  .xl1366\:text-sm
  font - size
  : 0.875rem
    line - height
    : 1.25rem
  .xl1366\:hidden
  display: none
  .xl1366\:order-2
  order: 2
  .xl1366\:text-lg
  font - size
  : 1.125rem
    line - height
    : 1.75rem
  .xl1366\:space-x-4 > :not([hidden]) ~ :not([hidden])
  margin - left
  : 1rem
  .xl1366\:space-x-6 > :not([hidden]) ~ :not([hidden])
  margin - left
  : 1.5rem
  .xl1366\:max-w-md
  max - width
  : 28rem
  .xl1366\:max-w-80
  max - width
  : 80%
  .xl1366\:space-y-2 > :not([hidden]) ~ :not([hidden])
  margin - top
  : 0.5rem
  .xl1366\:text-xl
  font - size
  : 1.25rem
    line - height
    : 1.75rem
  .xl1366\:mt-20
  margin - top
  : 5rem
  .xl1366\:text-6xl
  font - size
  : 3.75rem
    line - height
    : 1
  .xl1366\:mb-4
  margin - bottom
  : 1rem
  .xl1366\:mb-8
  margin - bottom
  : 2rem
  .xl1366\:max-w-md
  max - width
  : 28rem
  .xl1366\:space-x-3 > :not([hidden]) ~ :not([hidden])
  margin - left
  : 0.75rem
  .xl1366\:gap-3
  gap:
  0.75rem
  .xl1366\:w-36
  width:
  9rem
  .xl1366\:w-4
  width:
  1rem
  .xl1366\:h-4
  height:
  1rem
  .xl1366\:text-sm
  font - size
  : 0.875rem
    line - height
    : 1.25rem
  .xl1366\:h-16
  height:
  4rem
  .xl1366\:w-3
  width:
  0.75rem
  .xl1366\:h-3
  height:
  0.75rem
  .xl1366\:p-3
  padding:
  0.75rem
  .xl1366\:w-2
  width:
  0.5rem
  .xl1366\:h-2
  height:
  0.5rem
  .xl1366\:p-6
  padding:
  1.5rem
  .xl1366\:text-base
  font - size
  : 1rem
    line - height
    : 1.5rem
  .xl1366\:flex-row
  flex - direction
  : row
  .xl1366\:min-h-0
  min - height
  : 0px
}
