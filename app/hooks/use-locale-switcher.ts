"use client"

import { useCallback } from "react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { i18n, type Locale } from "@/i18n/config"

export function useLocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return

      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`

      const segments = pathname.split("/")
      if (i18n.locales.includes(segments[1] as Locale)) {
        segments[1] = newLocale
      } else {
        segments.splice(1, 0, newLocale)
      }

      router.push(segments.join("/"))
      router.refresh()
    },
    [locale, pathname, router]
  )

  return {
    locale,
    switchLocale,
    locales: i18n.locales,
  }
}


