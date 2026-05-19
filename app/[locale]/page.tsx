import { Header } from "@/components/layout/header"
import { Shield, Share2, Clock, Code2 } from "lucide-react"
import { ActionButton } from "@/components/home/action-button"
import { FeatureCard } from "@/components/home/feature-card"
import AsciiWavesBackground from "@/components/AsciiWavesBackground"
import { getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/config"

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeFromParams } = await params
  const locale = localeFromParams as Locale
  const t = await getTranslations({ locale, namespace: "home" })

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AsciiWavesBackground />
      <div className="container mx-auto px-4 lg:px-8 max-w-[1600px] relative z-10">
        <Header />
        <main className="pt-16">
          <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-2 relative overflow-hidden">
            <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 py-4">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    {t("title")}
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 tracking-wide">
                  {t("subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-2 sm:px-0">
                <FeatureCard
                  icon={<Shield className="w-5 h-5" />}
                  title={t("features.privacy.title")}
                  description={t("features.privacy.description")}
                />
                <FeatureCard
                  icon={<Share2 className="w-5 h-5" />}
                  title={t("features.instant.title")}
                  description={t("features.instant.description")}
                />
                <FeatureCard
                  icon={<Clock className="w-5 h-5" />}
                  title={t("features.expiry.title")}
                  description={t("features.expiry.description")}
                />
                <FeatureCard
                  icon={<Code2 className="w-5 h-5" />}
                  title={t("features.openapi.title")}
                  description={t("features.openapi.description")}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
                <ActionButton />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}





