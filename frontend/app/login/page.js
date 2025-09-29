'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import LoginForm from '../../components/auth/LoginForm'
import Link from 'next/link'
import { LightningIcon, SpinnerGapIcon } from '@phosphor-icons/react/ssr'

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

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

  // Si está autenticado, no mostrar nada (se está redirigiendo)
  if (isAuthenticated) {
    return null
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center space-x-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand to-brand-600 rounded-xl">
            <LightningIcon size={24} weight="bold" className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-brand via-brand-600 to-brand-700 bg-clip-text text-transparent">
            BrainBlitz
          </span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          ¿Problemas para acceder?{' '}
          <Link href="#" className="text-brand hover:text-brand-600 transition-colors">
            Contacta soporte
          </Link>
        </p>
      </div>
    </div>
  )
}
