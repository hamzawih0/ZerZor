"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ThreeColumnLayout } from "@/components/emails/three-column-layout"
import { NoPermissionDialog } from "@/components/no-permission-dialog"
import { useRolePermission } from "@/hooks/use-role-permission"
import { PERMISSIONS } from "@/lib/permissions"

interface InboxPageClientProps {
  locale: string
}

export function InboxPageClient({ locale }: InboxPageClientProps) {
  const router = useRouter()
  const { status } = useSession()
  const { checkPermission } = useRolePermission()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/${locale}`)
    }
  }, [status, router, locale])

  if (status === "loading") {
    return null
  }

  if (status === "unauthenticated") {
    return null
  }

  const hasPermission = checkPermission(PERMISSIONS.MANAGE_EMAIL)

  return (
    <>
      <ThreeColumnLayout />
      {!hasPermission && <NoPermissionDialog />}
    </>
  )
}

