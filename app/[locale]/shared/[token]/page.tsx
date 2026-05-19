import { getSharedEmail, getSharedEmailMessages } from "@/lib/shared-data"
import { SharedErrorPage } from "@/components/emails/shared-error-page"
import { SharedEmailPageClient } from "./page-client"

interface PageProps {
  params: Promise<{
    token: string
    locale: string
  }>
}

export default async function SharedEmailPage({ params }: PageProps) {
  const { token } = await params

  // 服务端获取数据
  const email = await getSharedEmail(token)

  if (!email) {
    return (
      <SharedErrorPage
        titleKey="emailNotFound"
        subtitleKey="linkExpired"
        errorKey="linkInvalid"
        descriptionKey="linkInvalidDescription"
        ctaTextKey="createOwnEmail"
      />
    )
  }

  // 获取初始消息列表
  const messagesResult = await getSharedEmailMessages(token)

  return (
    <SharedEmailPageClient
      email={email}
      initialMessages={messagesResult.messages}
      initialNextCursor={messagesResult.nextCursor}
      initialTotal={messagesResult.total}
      token={token}
    />
  )
}

