"use client"

import { useTranslations } from "next-intl"
import { AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { BrandHeader } from "@/components/ui/brand-header"
import { FloatingLanguageSwitcher } from "@/components/layout/floating-language-switcher"

interface SharedErrorPageProps {
  titleKey: string
  subtitleKey: string
  errorKey: string
  descriptionKey: string
  ctaTextKey: string
}

export function SharedErrorPage({
  titleKey,
  subtitleKey,
  errorKey,
  descriptionKey,
  ctaTextKey,
}: SharedErrorPageProps) {
  const tShared = useTranslations("emails.shared")

  const resolvedTitle = tShared(titleKey)
  const resolvedSubtitle = tShared(subtitleKey)
  const resolvedError = tShared(errorKey)
  const resolvedDescription = tShared(descriptionKey)
  const resolvedCtaText = tShared(ctaTextKey)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center">
      <div className="container mx-auto p-4 max-w-4xl">
        <BrandHeader
          title={resolvedTitle}
          subtitle={resolvedSubtitle}
          ctaText={resolvedCtaText}
        />
        <div className="text-center mt-6">
          <Card className="max-w-md mx-auto p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold">{resolvedError}</h2>
            <p className="text-gray-500">
              {resolvedDescription}
            </p>
          </Card>
        </div>
      </div>

      <FloatingLanguageSwitcher />
    </div>
  )
}

