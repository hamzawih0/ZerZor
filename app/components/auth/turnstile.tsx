"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onExpire?: () => void
  resetSignal?: number
  className?: string
}

export function Turnstile({
  siteKey,
  onVerify,
  onExpire,
  resetSignal,
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string>(null)

  useEffect(() => {
    if (!siteKey) return

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return

      if (widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current)
        return
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "auto",
        callback: (token: string) => onVerify(token),
        "error-callback": () => onVerify(""),
        "expired-callback": () => {
          onVerify("")
          onExpire?.()
        },
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-turnstile="true"]')

    if (window.turnstile) {
      renderWidget()
    } else if (existingScript) {
      const handleExistingScriptLoad = () => renderWidget()

      if (existingScript.dataset.loaded === "true") {
        renderWidget()
      } else {
        existingScript.addEventListener("load", handleExistingScriptLoad)
      }

      return () => {
        existingScript.removeEventListener("load", handleExistingScriptLoad)
      }
    } else {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      script.async = true
      script.defer = true
      script.dataset.turnstile = "true"
      const handleScriptLoad = () => {
        script.dataset.loaded = "true"
        renderWidget()
      }
      script.addEventListener("load", handleScriptLoad)
      document.head.appendChild(script)

      return () => {
        script.removeEventListener("load", handleScriptLoad)
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, onExpire, onVerify])

  useEffect(() => {
    if (resetSignal === undefined) return
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
    onVerify("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal])

  return (
    <div
      ref={containerRef}
      className={cn("flex justify-center", className)}
    />
  )
}

