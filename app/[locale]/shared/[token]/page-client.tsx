"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { BrandHeader } from "@/components/ui/brand-header"
import { FloatingLanguageSwitcher } from "@/components/layout/floating-language-switcher"
import { SharedMessageList } from "@/components/emails/shared-message-list"
import { SharedMessageDetail } from "@/components/emails/shared-message-detail"
import { EMAIL_CONFIG } from "@/config"

interface Email {
  id: string
  address: string
  createdAt: Date
  expiresAt: Date
}

interface Message {
  id: string
  from_address?: string
  to_address?: string
  subject: string
  received_at?: Date
  sent_at?: Date
}

interface MessageDetail extends Message {
  content?: string
  html?: string
}

interface SharedEmailPageClientProps {
  email: Email
  initialMessages: Message[]
  initialNextCursor: string | null
  initialTotal: number
  token: string
}

export function SharedEmailPageClient({
  email,
  initialMessages,
  initialNextCursor,
  initialTotal,
  token
}: SharedEmailPageClientProps) {
  const t = useTranslations("emails")
  const tShared = useTranslations("emails.shared")

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null)
  const [messageLoading, setMessageLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(initialTotal)
  const [refreshing, setRefreshing] = useState(false)
  const pollTimeoutRef = useRef<Timer | null>(null)
  const messagesRef = useRef<Message[]>(initialMessages)

  // 当 messages 改变时更新 ref
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const fetchMessages = async (cursor?: string) => {
    try {
      if (cursor) {
        setLoadingMore(true)
      }

      const url = new URL(`/api/shared/${token}/messages`, window.location.origin)
      if (cursor) {
        url.searchParams.set('cursor', cursor)
      }

      const messagesResponse = await fetch(url)
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json() as {
          messages: Message[]
          nextCursor: string | null
          total: number
        }

        if (!cursor) {
          // 刷新时：合并新消息和旧消息，避免重复
          const newMessages = messagesData.messages
          const oldMessages = messagesRef.current

          // 找到第一个重复的消息
          const lastDuplicateIndex = newMessages.findIndex(
            newMsg => oldMessages.some(oldMsg => oldMsg.id === newMsg.id)
          )

          if (lastDuplicateIndex === -1) {
            // 没有重复，直接使用新消息
            setMessages(newMessages)
            setNextCursor(messagesData.nextCursor)
            setTotal(messagesData.total)
            return
          }
          // 有重复，只添加新的消息
          const uniqueNewMessages = newMessages.slice(0, lastDuplicateIndex)
          setMessages([...uniqueNewMessages, ...oldMessages])
          setTotal(messagesData.total)
          return
        }
        // 加载更多：追加到列表末尾
        setMessages(prev => [...prev, ...(messagesData.messages || [])])
        setNextCursor(messagesData.nextCursor)
        setTotal(messagesData.total)
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err)
    } finally {
      setLoadingMore(false)
      setRefreshing(false)
    }
  }

  const startPolling = () => {
    stopPolling()
    pollTimeoutRef.current = setInterval(() => {
      if (!refreshing && !loadingMore) {
        fetchMessages()
      }
    }, EMAIL_CONFIG.POLL_INTERVAL)
  }

  const stopPolling = () => {
    if (pollTimeoutRef.current) {
      clearInterval(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchMessages()
  }

  // 启动轮询
  useEffect(() => {
    startPolling()
    return () => {
      stopPolling()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleLoadMore = () => {
    if (nextCursor && !loadingMore) {
      fetchMessages(nextCursor)
    }
  }

  const fetchMessageDetail = async (messageId: string) => {
    try {
      setMessageLoading(true)

      const response = await fetch(`/api/shared/${token}/messages/${messageId}`)

      if (!response.ok) {
        throw new Error("Failed to load message")
      }

      const data = await response.json() as { message: MessageDetail }
      setSelectedMessage(data.message)
    } catch (err) {
      console.error("Failed to fetch message:", err)
    } finally {
      setMessageLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 max-w-7xl">
        <BrandHeader
          title={email.address}
          subtitle={(() => {
            try {
              const expiresDate = new Date(email.expiresAt)
              if (isNaN(expiresDate.getTime())) return tShared("sharedMailbox")
              return expiresDate.getFullYear() === 9999
                ? tShared("permanent")
                : `${tShared("expiresAt")}: ${expiresDate.toLocaleDateString()} ${expiresDate.toLocaleTimeString()}`
            } catch {
              return tShared("sharedMailbox")
            }
          })()}
          ctaText={tShared("createOwnEmail")}
        />

        {/* 桌面端双栏布局 */}
        <div className="hidden lg:grid grid-cols-2 gap-4 h-[calc(100vh-280px)] mt-6">
          <div className="border-2 border-primary/20 bg-background rounded-lg overflow-hidden">
            <SharedMessageList
              messages={messages.map(msg => ({
                ...msg,
                received_at: (() => {
                  if (!msg.received_at) return undefined
                  try {
                    const date = new Date(msg.received_at)
                    return isNaN(date.getTime()) ? undefined : date.getTime()
                  } catch {
                    return undefined
                  }
                })(),
                sent_at: (() => {
                  if (!msg.sent_at) return undefined
                  try {
                    const date = new Date(msg.sent_at)
                    return isNaN(date.getTime()) ? undefined : date.getTime()
                  } catch {
                    return undefined
                  }
                })()
              }))}
              selectedMessageId={selectedMessage?.id}
              onMessageSelect={fetchMessageDetail}
              onLoadMore={handleLoadMore}
              onRefresh={handleRefresh}
              loading={false}
              loadingMore={loadingMore}
              refreshing={refreshing}
              hasMore={!!nextCursor}
              total={total}
              t={{
                received: t("messages.received"),
                noMessages: t("messages.noMessages"),
                messageCount: t("messages.messageCount"),
                loading: t("messageView.loading"),
                loadingMore: t("messages.loadingMore")
              }}
            />
          </div>

          <div className="border-2 border-primary/20 bg-background rounded-lg overflow-hidden">
            <SharedMessageDetail
              message={selectedMessage ? {
                ...selectedMessage,
                received_at: (() => {
                  if (!selectedMessage.received_at) return undefined
                  try {
                    const date = new Date(selectedMessage.received_at)
                    return isNaN(date.getTime()) ? undefined : date.getTime()
                  } catch {
                    return undefined
                  }
                })(),
                sent_at: (() => {
                  if (!selectedMessage.sent_at) return undefined
                  try {
                    const date = new Date(selectedMessage.sent_at)
                    return isNaN(date.getTime()) ? undefined : date.getTime()
                  } catch {
                    return undefined
                  }
                })()
              } : null}
              loading={messageLoading}
              t={{
                messageContent: t("layout.messageContent"),
                selectMessage: t("layout.selectMessage"),
                loading: t("messageView.loading"),
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

        {/* 移动端单栏布局 */}
        <div className="lg:hidden h-[calc(100vh-260px)] mt-6">
          <div className="border-2 border-primary/20 bg-background rounded-lg overflow-hidden h-full flex flex-col">
            {!selectedMessage ? (
              // 消息列表视图
              <SharedMessageList
                messages={messages.map(msg => ({
                  ...msg,
                  received_at: (() => {
                    if (!msg.received_at) return undefined
                    try {
                      const date = new Date(msg.received_at)
                      return isNaN(date.getTime()) ? undefined : date.getTime()
                    } catch {
                      return undefined
                    }
                  })(),
                  sent_at: (() => {
                    if (!msg.sent_at) return undefined
                    try {
                      const date = new Date(msg.sent_at)
                      return isNaN(date.getTime()) ? undefined : date.getTime()
                    } catch {
                      return undefined
                    }
                  })()
                }))}
                selectedMessageId={null}
                onMessageSelect={fetchMessageDetail}
                onLoadMore={handleLoadMore}
                onRefresh={handleRefresh}
                loading={false}
                loadingMore={loadingMore}
                refreshing={refreshing}
                hasMore={!!nextCursor}
                total={total}
                t={{
                  received: t("messages.received"),
                  noMessages: t("messages.noMessages"),
                  messageCount: t("messages.messageCount"),
                  loading: t("messageView.loading"),
                  loadingMore: t("messages.loadingMore")
                }}
              />
            ) : (
              // 消息详情视图
              <>
                <div className="p-2 border-b-2 border-primary/20 flex items-center justify-between shrink-0">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-sm text-primary"
                  >
                    {t("layout.backToMessageList")}
                  </button>
                  <span className="text-sm font-medium">{t("layout.messageContent")}</span>
                </div>
                <div className="flex-1 overflow-auto">
                  <SharedMessageDetail
                    message={{
                      ...selectedMessage,
                      received_at: (() => {
                        if (!selectedMessage.received_at) return undefined
                        try {
                          const date = new Date(selectedMessage.received_at)
                          return isNaN(date.getTime()) ? undefined : date.getTime()
                        } catch {
                          return undefined
                        }
                      })(),
                      sent_at: (() => {
                        if (!selectedMessage.sent_at) return undefined
                        try {
                          const date = new Date(selectedMessage.sent_at)
                          return isNaN(date.getTime()) ? undefined : date.getTime()
                        } catch {
                          return undefined
                        }
                      })()
                    }}
                    loading={messageLoading}
                    t={{
                      messageContent: t("layout.messageContent"),
                      selectMessage: t("layout.selectMessage"),
                      loading: t("messageView.loading"),
                      from: t("messageView.from"),
                      to: t("messageView.to"),
                      subject: t("messages.subject"),
                      time: t("messageView.time"),
                      htmlFormat: t("messageView.htmlFormat"),
                      textFormat: t("messageView.textFormat")
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <FloatingLanguageSwitcher />
    </div>
  )
}

