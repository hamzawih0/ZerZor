import { redirect } from "next/navigation"
import type { Locale } from "@/i18n/config"

export default async function MoePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeFromParams } = await params
  const locale = localeFromParams as Locale
  redirect(`/${locale}/inbox`)
}
