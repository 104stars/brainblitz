'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import AuthGuard from '../../../components/auth/AuthGuard'
import GameConfigForm from '../../../components/game/GameConfigForm'
import { ArrowLeftIcon, SparkleIcon } from '@phosphor-icons/react/ssr'

export default function CreateGamePage() {
  const router = useRouter()
  const { user, username, loading } = useAuth()

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header fijo */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Navegación */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-brand transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeftIcon size={20} />
                  <span className="hidden sm:inline">Volver</span>
                </button>
                
                <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
                
                <div className="flex items-center gap-2">
                  <SparkleIcon size={20} className="text-brand" />
                  <h1 className="text-lg font-semibold text-gray-900">
                    Crear Partida
                  </h1>
                </div>
              </div>

              {/* Usuario */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {username}
                  </p>
                  <p className="text-xs text-gray-500">Creando partida</p>
                </div>
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand font-semibold text-sm">
                    {username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GameConfigForm />
        </main>

        {/* Footer informativo */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">
                ¿Necesitas ayuda? Consulta nuestra guía de creación de partidas
              </p>
              <div className="flex justify-center gap-4">
                <button className="text-brand hover:text-brand-600 transition-colors">
                  Guía de Juego
                </button>
                <span>•</span>
                <button className="text-brand hover:text-brand-600 transition-colors">
                  Preguntas Frecuentes
                </button>
                <span>•</span>
                <button className="text-brand hover:text-brand-600 transition-colors">
                  Soporte
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}
