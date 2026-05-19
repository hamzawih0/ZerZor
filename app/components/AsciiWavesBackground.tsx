"use client"

import { useEffect, useRef } from "react"

const CHAR_WIDTH = 7
const CHAR_HEIGHT = 12
const BASE_STRING = "SEVAS_TRA"

type Explosion = {
  x: number
  y: number
  radius: number
  life: number
}

type CursedString = {
  baseY: number
  amplitude: number
  wavelength: number
  speed: number
  offset: number
  time: number
}

export default function AsciiWavesBackground() {
  const ref = useRef<HTMLPreElement | null>(null)

  useEffect(() => {
    const asciiEl = ref.current
    if (!asciiEl) return

    let cols = 0
    let rows = 0
    let mouse = { x: 0, y: 0 }
    let explosions: Explosion[] = []
    let currentString = BASE_STRING
    let strings: CursedString[] = []
    let rafId = 0
    let lastMutation = 0

    const mutations = [
      (s: string) => s.split("").reverse().join(""),
      (s: string) => s.replace(/O/g, "0"),
      (s: string) => s.replace(/E/g, "3"),
      (s: string) => s.slice(0, Math.max(1, Math.floor(Math.random() * s.length))),
      (s: string) => `${s}_ERR`,
    ]

    function resize() {
      cols = Math.floor(window.innerWidth / CHAR_WIDTH)
      rows = Math.floor(window.innerHeight / CHAR_HEIGHT)
      mouse = { x: cols / 2, y: rows / 2 }
      createStrings()
    }

    function mutateString() {
      const fn = mutations[Math.floor(Math.random() * mutations.length)]
      currentString = fn(currentString)
      if (currentString.length < 2) currentString = BASE_STRING
    }

    function createStrings() {
      strings = []
      const total = 22
      for (let i = 0; i < total; i += 1) {
        const depth = 0.6 + Math.random() * 0.8
        strings.push({
          baseY: (i / total) * rows,
          amplitude: 2 + depth * 4,
          wavelength: 0.08,
          speed: 0.0 + depth * 0.002,
          offset: Math.random() * 100,
          time: 0,
        })
      }
    }

    function getY(s: CursedString, x: number) {
      let y =
        s.baseY +
        Math.sin(x * s.wavelength + s.time * s.speed + s.offset) * s.amplitude

      y += Math.sin(x * 0.04 + s.time * 0.0015) * (s.amplitude * 0.5)

      const dx = x - mouse.x
      const dy = y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 10) {
        y += (10 - dist) * 0.3
      }

      return Math.floor(y)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX / CHAR_WIDTH
      mouse.y = e.clientY / CHAR_HEIGHT
    }

    const onClick = (e: MouseEvent) => {
      explosions.push({
        x: e.clientX / CHAR_WIDTH,
        y: e.clientY / CHAR_HEIGHT,
        radius: 0,
        life: 1,
      })
    }

    function draw(time: number) {
      if (!asciiEl) return
      const grid = Array.from({ length: rows }, () => Array(cols).fill(" "))

      strings.forEach((s) => {
        s.time = time

        for (let x = 0; x < cols; x += 1) {
          const y = getY(s, x)
          if (y >= 0 && y < rows) {
            const charIndex = (x + Math.floor(time * 0.01)) % currentString.length
            let char = currentString[charIndex]
            if (Math.random() < 0.02) char = "#"
            grid[y][x] = char
          }
        }
      })

      explosions.forEach((exp) => {
        exp.radius += 0.3
        exp.life -= 0.015

        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const dx = x - exp.x
            const dy = y - exp.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < exp.radius && Math.random() < 0.25) {
              grid[y][x] = "@"
            }
          }
        }
      })

      explosions = explosions.filter((e) => e.life > 0)
      asciiEl.textContent = grid.map((r) => r.join("")).join("\n")

      if (time - lastMutation > 2500) {
        mutateString()
        lastMutation = time
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("click", onClick)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("click", onClick)
    }
  }, [])

  return <pre ref={ref} aria-hidden="true" className="ascii-main-background" />
}
