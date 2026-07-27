"use client"

import { FormEvent, useEffect, useState } from "react"
import { LockKeyhole } from "lucide-react"

const SESSION_KEY = "beton-light-studio-access"

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [granted, setGranted] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    setGranted(sessionStorage.getItem(SESSION_KEY) === "granted")
    setReady(true)
  }, [])

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== "customer") {
      setError(true)
      setPassword("")
      return
    }
    sessionStorage.setItem(SESSION_KEY, "granted")
    setGranted(true)
  }

  if (!ready) return <div className="min-h-screen bg-[#101112]" />
  if (granted) return children

  return (
    <main className="grid min-h-screen place-items-center bg-[#101112] px-6 text-brand-white">
      <form onSubmit={unlock} className="w-full max-w-[420px] border border-white/15 bg-[#181a1d] p-10 shadow-2xl">
        <div className="mb-8 flex size-12 items-center justify-center bg-brand-cobalt">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Private presentation tool</p>
        <h1 className="text-3xl font-semibold leading-tight">Beton Light Studio</h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-400">
          Enter the customer access key to open the real-time room preview.
        </p>
        <label htmlFor="studio-password" className="mt-8 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-300">
          Access key
        </label>
        <input
          id="studio-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError(false)
          }}
          className="mt-3 h-12 w-full border border-white/20 bg-[#101112] px-4 text-base outline-none transition-colors focus:border-brand-orange"
          aria-invalid={error}
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-[#ff9b91]">That access key is not valid.</p>}
        <button type="submit" className="mt-5 h-12 w-full bg-brand-orange text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:bg-[#d96d10]">
          Enter studio
        </button>
      </form>
    </main>
  )
}
