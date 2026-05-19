import { Header } from "@/components/layout/header"
import { InboxPageClient } from "@/components/emails/inbox-page-client"
import type { Locale } from "@/i18n/config"

export default async function InboxPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeFromParams } = await params
  const locale = localeFromParams as Locale

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 h-screen">
      <div className="container mx-auto h-full px-4 lg:px-8 max-w-[1600px]">
        <Header />
        <main className="h-full">
          <InboxPageClient locale={locale} />
        </main>
      </div>
    </div>
  )
}
