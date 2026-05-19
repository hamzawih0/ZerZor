"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ExternalLink, Mail } from "lucide-react"

interface BrandHeaderProps {
  title?: string
  subtitle?: string
  ctaText?: string
}

export function BrandHeader({
  title,
  subtitle,
  ctaText,
}: BrandHeaderProps) {
  const t = useTranslations("emails.shared.brand")

  const displayTitle = title || t("title")
  const displaySubtitle = subtitle || t("subtitle")
  const displayCtaText = ctaText || t("cta")
  return (
    <div className="text-center space-y-4 lg:pb-4">
      <div className="flex justify-center pt-2">
        <Link
          href="https://zormail.app"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src="/zormail-logo.png"
              alt="ZorMail logo"
              fill
              sizes="48px"
              className="object-contain group-hover:scale-105 transition-transform duration-200"
              priority
            />
          </div>
          <span className="text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            ZorMail
          </span>
        </Link>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {displayTitle}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          {displaySubtitle}
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          asChild
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90 text-white px-8 min-h-10 h-auto py-1"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Mail className="w-5 h-5" />
            {displayCtaText}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}



