"use client"

import { Mail, Calendar, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useThrottle } from "@/hooks/use-throttle"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  from_address?: string
  to_address?: string
  subject: string
  received_at?: number
  sent_at?: number
}

interface SharedMessageListProps {
  messages: Message[]
  selectedMessageId?: string | null
  onMessageSelect: (messageId: string) => void
  onLoadMore?: () => void
  onRefresh?: () => void
  loading?: boolean
  loadingMore?: boolean
  refreshing?: boolean
  hasMore?: boolean
  total?: number
  t: {
    received: string
    noMessages: string
    messageCount: string
    loading: string
    loadingMore: string
  }
}

export function SharedMessageList({
  messages,
  selectedMessageId,
  onMessageSelect,
  onLoadMore,
  onRefresh,
  loading = false,
  loadingMore = false,
  refreshing = false,
  hasMore = false,
  total = 0,
  t,
}: SharedMessageListProps) {
  const handleScroll = useThrottle((e: React.UIEvent<HTMLDivElement>) => {
    if (loadingMore || !hasMore || !onLoadMore) return

    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
    const threshold = clientHeight * 1.5
    const remainingScroll = scrollHeight - scrollTop

    if (remainingScroll <= threshold) {
      onLoadMore()
    }
  }, 200)

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 flex justify-between items-center border-b border-primary/20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={refreshing || loading}
          className={cn("h-8 w-8", refreshing && "animate-spin")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <span className="text-xs text-gray-500">
          {total > 0 ? `${total} ${t.messageCount}` : t.noMessages}
        </span>
      </div>

      <div className="flex-1 overflow-auto" onScroll={handleScroll}>
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
            {t.loading}
          </div>
        ) : messages.length > 0 ? (
          <div className="divide-y divide-primary/10">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => onMessageSelect(message.id)}
                className={cn(
                  "p-3 hover:bg-primary/5 cursor-pointer",
                  selectedMessageId === message.id && "bg-primary/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary/60 mt-1" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {message.subject}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="truncate">
                        {message.from_address || message.to_address || ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(
                          message.received_at || message.sent_at || 0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loadingMore && (
              <div className="text-center text-sm text-gray-500 py-2">
                {t.loadingMore}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            {t.noMessages}
          </div>
        )}
      </div>
    </div>
  )
}

