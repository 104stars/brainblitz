'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Hero from '../components/common/Hero'
import Features from '../components/common/Features'
import CallToAction from '../components/common/CallToAction'
import Footer from '../components/common/Footer'
import { SpinnerGapIcon } from '@phosphor-icons/react/ssr'

export default function Home() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si el usuario está autenticado, redirigir al dashboard
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

  // Si no está autenticado, mostrar la landing page
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
}
