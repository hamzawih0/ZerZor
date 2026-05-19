"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Share2, Copy, Trash2, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useCopy } from "@/hooks/use-copy"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EXPIRY_OPTIONS } from "@/types/email"

interface ShareDialogProps {
  emailId: string
  emailAddress: string
}

interface ShareLink {
  id: string
  token: string
  createdAt: number | string | Date
  expiresAt: number | string | Date | null
  enabled: boolean
}

export function ShareDialog({ emailId }: ShareDialogProps) {
  const t = useTranslations("emails.share")
  const { toast } = useToast()
  const { copyToClipboard } = useCopy()

  const [open, setOpen] = useState(false)
  const [shares, setShares] = useState<ShareLink[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [expiryTime, setExpiryTime] = useState(EXPIRY_OPTIONS[1].value.toString())
  const [deleteTarget, setDeleteTarget] = useState<ShareLink | null>(null)

  const fetchShares = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/emails/${emailId}/share`)
      if (!response.ok) throw new Error("Failed to fetch shares")

      const data = await response.json() as { shares: ShareLink[] }
      setShares(data.shares || [])
    } catch (error) {
      console.error("Failed to fetch shares:", error)
      toast({
        title: t("createFailed"),
        description: String(error),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createShare = async () => {
    try {
      setCreating(true)
      const response = await fetch(`/api/emails/${emailId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresIn: Number(expiryTime) })
      })

      if (!response.ok) throw new Error("Failed to create share")

      const share = await response.json() as ShareLink
      setShares(prev => [share, ...prev])

      toast({
        title: t("createSuccess"),
      })
    } catch (error) {
      console.error("Failed to create share:", error)
      toast({
        title: t("createFailed"),
        description: String(error),
        variant: "destructive"
      })
    } finally {
      setCreating(false)
    }
  }

  const deleteShare = async (share: ShareLink) => {
    try {
      const response = await fetch(`/api/emails/${emailId}/share/${share.id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete share")

      setShares(prev => prev.filter(s => s.id !== share.id))

      toast({
        title: t("deleteSuccess"),
      })
    } catch (error) {
      console.error("Failed to delete share:", error)
      toast({
        title: t("deleteFailed"),
        description: String(error),
        variant: "destructive"
      })
    } finally {
      setDeleteTarget(null)
    }
  }

  const getShareUrl = (token: string) => {
    return `${window.location.origin}/shared/${token}`
  }

  const handleCopy = async (token: string) => {
    const url = getShareUrl(token)
    const success = await copyToClipboard(url)

    if (success) {
      toast({
        title: t("copied"),
      })
    } else {
      toast({
        title: t("copyFailed"),
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (open) {
      fetchShares()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[600px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            if (deleteTarget) {
              e.preventDefault()
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>
              {t("description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Create new share link */}
            <div className="space-y-2">
              <Label>{t("expiryTime")}</Label>
              <div className="flex gap-2">
                <Select value={expiryTime} onValueChange={setExpiryTime}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPIRY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={createShare} disabled={creating} className="min-w-[100px]">
                  {creating ? t("creating") : t("createLink")}
                </Button>
              </div>
            </div>

            {/* Active share links */}
            <div className="space-y-2">
              <Label>{t("activeLinks")}</Label>
              <div className="h-[270px] overflow-y-auto">
                {loading ? (
                  <div className="text-sm text-gray-500 text-center py-8 flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span>{t("loading")}</span>
                  </div>
                ) : shares.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    {t("noLinks")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {shares.map(share => {
                      // 将expiresAt转换为时间戳进行比较
                      const expiresAtTime = share.expiresAt
                        ? (typeof share.expiresAt === 'number'
                          ? share.expiresAt
                          : new Date(share.expiresAt).getTime())
                        : null
                      const isExpired = expiresAtTime !== null && expiresAtTime < Date.now()
                      return (
                        <div
                          key={share.id}
                          className={cn(
                            "p-3 border rounded-lg space-y-2 transition-all",
                            isExpired
                              ? "border-destructive/30 bg-destructive/5 opacity-75"
                              : "border-border"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Link2 className={cn(
                              "h-4 w-4 flex-shrink-0",
                              isExpired ? "text-destructive/60" : "text-primary/60"
                            )} />
                            <a
                              href={isExpired ? undefined : getShareUrl(share.token)}
                              target={isExpired ? undefined : "_blank"}
                              rel={isExpired ? undefined : "noopener noreferrer"}
                              onClick={(e) => {
                                if (isExpired) {
                                  e.preventDefault()
                                }
                              }}
                              className={cn(
                                "flex-1 text-xs p-1 rounded font-mono transition-colors break-all",
                                isExpired
                                  ? "bg-destructive/10 text-destructive/70 cursor-not-allowed pointer-events-none"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary cursor-pointer"
                              )}
                            >
                              {getShareUrl(share.token)}
                            </a>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => handleCopy(share.token)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => setDeleteTarget(share)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="flex gap-y-4 gap-x-2 sm:gap-x-4 text-xs">
                            <span className={cn(
                              isExpired ? "text-destructive/70" : "text-gray-500"
                            )}>
                              {t("createdAt")}: {new Date(
                                typeof share.createdAt === 'number'
                                  ? share.createdAt
                                  : share.createdAt
                              ).toLocaleString()}
                            </span>
                            <span className={cn(
                              isExpired ? "text-destructive/70" : "text-gray-500"
                            )}>
                              {t("expiresAt")}: {
                                share.expiresAt
                                  ? new Date(
                                    typeof share.expiresAt === 'number'
                                      ? share.expiresAt
                                      : share.expiresAt
                                  ).toLocaleString()
                                  : t("permanent")
                              }
                            </span>
                            {isExpired && (
                              <span className="text-destructive font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-destructive rounded-full"></span>
                                {t("expired")}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteShare(deleteTarget)}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


