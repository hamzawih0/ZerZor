import { NextResponse } from "next/server"
import { getTurnstileConfig } from "@/lib/turnstile"

export const runtime = "edge"

export async function GET() {
  const config = await getTurnstileConfig()
  return NextResponse.json({
    enabled: config.enabled,
    siteKey: config.siteKey,
  })
}

