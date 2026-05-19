"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

interface LoginPageClientProps {
  locale: string
}

interface TurnstileConfig {
  enabled: boolean
  siteKey: string
}

export function LoginPageClient({ locale }: LoginPageClientProps) {
  const router = useRouter()
  const { status } = useSession()
  const [turnstile, setTurnstile] = useState<TurnstileConfig>({
    enabled: false,
    siteKey: "",
  })

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(`/${locale}`)
    }
  }, [status, router, locale])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/public/turnstile", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json() as TurnstileConfig
        if (active) setTurnstile(data)
      } catch {
        // keep safe defaults when config cannot be loaded
      }
    })()

    return () => {
      active = false
    }
  }, [])

  if (status === "loading") {
    return <div className="h-40" />
  }

  if (status === "authenticated") {
    return null
  }

  return <LoginForm turnstile={turnstile} />
}

