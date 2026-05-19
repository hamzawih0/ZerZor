"use client"

import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link 
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <div className="relative h-8 w-8 overflow-hidden rounded-md">
        <Image
          src="/zormail-logo.png"
          alt="ZorMail logo"
          fill
          sizes="32px"
          className="object-contain"
          priority
        />
      </div>
      <span className="font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
        ZorMail
      </span>
    </Link>
  )
}



