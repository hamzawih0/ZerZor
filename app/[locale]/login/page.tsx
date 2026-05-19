import { LoginPageClient } from "@/components/auth/login-page-client"
import type { Locale } from "@/i18n/config"

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeFromParams } = await params
  const locale = localeFromParams as Locale

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <LoginPageClient locale={locale} />
    </div>
  )
}


