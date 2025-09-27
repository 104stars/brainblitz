'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { SpinnerGapIcon } from '@phosphor-icons/react/ssr'

export default function AuthGuard({ children, redirectTo = '/login' }) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir
    if (!loading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50">
        <div className="text-center">
          <SpinnerGapIcon size={48} className="animate-spin text-brand mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no renderizar nada (se está redirigiendo)
  if (!isAuthenticated) {
    return null
  }

  // Si está autenticado, renderizar los children
  return children
}
