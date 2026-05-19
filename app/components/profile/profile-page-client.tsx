"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ProfileCard } from "@/components/profile/profile-card"

interface ProfilePageClientProps {
  locale: string
}

export function ProfilePageClient({ locale }: ProfilePageClientProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/${locale}`)
    }
  }, [status, router, locale])

  if (status === "loading") {
    return null
  }

  if (!session?.user) {
    return null
  }

  return <ProfileCard user={session.user} />
}

