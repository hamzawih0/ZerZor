"use client"

import { useTranslations } from "next-intl"
import { BrandHeader } from "@/components/ui/brand-header"
import { FloatingLanguageSwitcher } from "@/components/layout/floating-language-switcher"
import { SharedMessageDetail } from "@/components/emails/shared-message-detail"

interface MessageDetail {
  id: string
  from_address?: string
  to_address?: string
  subject: string
  content?: string
  html?: string
  received_at?: Date
  sent_at?: Date
  expiresAt?: Date
  emailAddress?: string
  emailExpiresAt?: Date
}

interface SharedMessagePageClientProps {
  message: MessageDetail
}

export function SharedMessagePageClient({ message }: SharedMessagePageClientProps) {
  const t = useTranslations("emails")
  const tShared = useTranslations("emails.shared")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 max-w-7xl">
        <BrandHeader
          title={message.emailAddress || message.to_address || message.subject}
          subtitle={message.emailExpiresAt && new Date(message.emailExpiresAt).getFullYear() === 9999
            ? tShared("permanent")
            : message.emailExpiresAt
              ? `${tShared("expiresAt")}: ${new Date(message.emailExpiresAt).toLocaleString()}`
              : tShared("sharedMessage")}
          ctaText={tShared("createOwnEmail")}
        />

        <div className="mt-6">
          <div className="border-2 border-primary/20 bg-background rounded-lg overflow-hidden h-[calc(100vh-260px)] lg:h-[calc(100vh-280px)]">
            <SharedMessageDetail
              message={{
                ...message,
                received_at: message.received_at ? new Date(message.received_at).getTime() : undefined,
                sent_at: message.sent_at ? new Date(message.sent_at).getTime() : undefined
              }}
              loading={false}
              t={{
                messageContent: t("layout.messageContent"),
                selectMessage: t("layout.selectMessage"),
                loading: tShared("loading"),
                from: t("messageView.from"),
                to: t("messageView.to"),
                subject: t("messages.subject"),
                time: t("messageView.time"),
                htmlFormat: t("messageView.htmlFormat"),
                textFormat: t("messageView.textFormat")
              }}
            />
          </div>
        </div>
      </div>
      
      <FloatingLanguageSwitcher />
    </div>
  )
}

