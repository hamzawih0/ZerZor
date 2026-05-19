import { Header } from "@/components/layout/header"
import { ProfilePageClient } from "@/components/profile/profile-page-client"
import type { Locale } from "@/i18n/config"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeFromParams } = await params
  const locale = localeFromParams as Locale

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1600px]">
        <Header />
        <main className="pt-20 pb-5">
          <ProfilePageClient locale={locale} />
        </main>
      </div>
    </div>
  )
}



