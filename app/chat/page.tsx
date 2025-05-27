"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

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
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("Index")

  const changeLocale = (newLocale: string) => {
    const path = window.location.pathname
    router.push(path, { locale: newLocale })
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {t("language")} ({locale})
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
          className="absolute top-full right-0 mt-2 min-w-[180px] bg-black/95 border border-slate-500/50 shadow-xl shadow-white/25 overflow-hidden z-[9999]"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLocale(lang.code)}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 hover:text-white"
                role="menuitem"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Chat() {
  const searchParams = useSearchParams()
  const initialInput = searchParams.get("q") || ""
  const t = useTranslations("Index")

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [location, setLocation] = useState("")

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, error, stop, setMessages } = useChat({
    api: "/api/chat",
    initialInput: initialInput,
  })

  useEffect(() => {
    if (initialInput) {
      setMessages([
        {
          role: "user",
          content: initialInput,
        },
      ])
    }
  }, [initialInput, setMessages])

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="p-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <PipBoyLanguageSelector />
        </div>
      </header>

      <main className="flex-grow p-4 container mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            {t("name")}
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-bold mb-2">
            {t("age")}
          </label>
          <input
            type="number"
            id="age"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-bold mb-2">
            {t("location")}
          </label>
          <input
            type="text"
            id="location"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.content} className="p-3 rounded-lg">
              {message.role === "user" ? (
                <div className="text-right">
                  <p className="inline-block bg-blue-700 text-white p-3 rounded-lg">{message.content}</p>
                </div>
              ) : (
                <div className="text-left">
                  <p className="inline-block bg-gray-800 text-white p-3 rounded-lg">{message.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="container mx-auto">
          <div className="flex items-center">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
              placeholder={t("prompt")}
              value={input}
              onChange={handleInputChange}
            />
            {isLoading ? (
              <button
                className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={stop}
              >
                {t("stop")}
              </button>
            ) : (
              <button
                className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {t("send")}
              </button>
            )}
          </div>
          {error && (
            <div className="text-red-500 mt-2">
              {t("error")}: {error}
            </div>
          )}
        </form>
      </footer>
    </div>
  )
}
