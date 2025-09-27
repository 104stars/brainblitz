import { LightningIcon, UsersIcon, TrophyIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50 min-h-screen">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.gray.300/0.1)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.gray.300/0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Main content */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-7xl pt-20 pb-32 sm:pt-32 sm:pb-40">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand to-brand-600 rounded-2xl mb-6">
                <LightningIcon size={40} weight="bold" className="text-white" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-brand via-brand-600 to-brand-700 bg-clip-text text-transparent">
                BrainBlitz
              </h1>
            </div>

            {/* Subtitle */}
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
              ¡Pon a prueba tu conocimiento en el juego de preguntas multijugador más emocionante! 
              Compite en tiempo real con jugadores de todo el mundo.
            </p>

            {/* Features highlights */}
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-brand-100 rounded-xl mb-4">
                  <LightningIcon size={24} weight="bold" className="text-brand" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tiempo Real</h3>
                <p className="text-sm text-gray-600 mt-2">Partidas dinámicas con respuestas instantáneas</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-brand-100 rounded-xl mb-4">
                  <UsersIcon size={24} weight="bold" className="text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Multijugador</h3>
                <p className="text-sm text-gray-600 mt-2">Compite con amigos o jugadores aleatorios</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-brand-100 rounded-xl mb-4">
                  <TrophyIcon size={24} weight="bold" className="text-brand-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ranking</h3>
                <p className="text-sm text-gray-600 mt-2">Sistema de puntuación y estadísticas</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-brand to-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Comenzar a Jugar
              </Link>
              <Link
                href="/login"
                className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ring-1 ring-gray-200 hover:ring-gray-300"
              >
                Iniciar Sesión
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 flex items-center justify-center gap-x-8 text-sm text-gray-500">
              <div className="flex items-center gap-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>En línea</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <span className="hidden sm:inline">15+ Categorías disponibles</span>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <span className="hidden sm:inline">Miles de preguntas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
