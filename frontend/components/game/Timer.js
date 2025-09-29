'use client'

import { useEffect, useRef, useState } from 'react'

export default function Timer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds || 0)
  const intervalRef = useRef(null)
  const onExpireRef = useRef(onExpire)

  // Mantener la última referencia del callback sin reiniciar el temporizador
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    setRemaining(seconds || 0)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!seconds) return

    const startedAt = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const next = Math.max(0, (seconds || 0) - elapsed)
      setRemaining(next)
      if (next <= 0) {
        clearInterval(intervalRef.current)
        onExpireRef.current?.()
      }
    }, 200)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [seconds])

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
      <div className="text-sm text-gray-700">Tiempo: {remaining}s</div>
    </div>
  )
}


