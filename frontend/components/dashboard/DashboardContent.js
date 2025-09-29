'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import UserStats from './UserStats'
import PublicGamesList from './PublicGamesList'
import CreateGameButton from './CreateGameButton'
import DashboardHeader from './DashboardHeader'
import JoinGameModal from './JoinGameModal'

export default function DashboardContent() {
  const { user, username } = useAuth()
  const [showJoinModal, setShowJoinModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-25 to-gray-50">
      {/* Header */}
      <DashboardHeader user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido de vuelta, {username || user?.email?.split('@')[0] || 'Jugador'}! 👋
          </h1>
          <p className="text-gray-600">
            ¿Listo para poner a prueba tus conocimientos? Crea una nueva partida o únete a una existente.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats and Create Game */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Stats */}
            <UserStats user={user} />
            
            {/* Create Game Button */}
            <CreateGameButton />
          </div>

          {/* Right Column - Public Games */}
          <div className="lg:col-span-2">
            <PublicGamesList />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowJoinModal(true)}
              className="p-4 border border-gray-200 rounded-xl hover:border-brand hover:bg-brand-50 transition-all duration-200 text-left"
            >
              <div className="text-brand font-semibold mb-1">Unirse por Código</div>
              <div className="text-sm text-gray-600">Ingresa un código de 6 dígitos para unirte</div>
            </button>
            
            <button 
              onClick={() => alert('Función será implementada próximamente')}
              className="p-4 border border-gray-200 rounded-xl hover:border-brand hover:bg-brand-50 transition-all duration-200 text-left"
            >
              <div className="text-brand font-semibold mb-1">Historial</div>
              <div className="text-sm text-gray-600">Revisa tus partidas anteriores</div>
            </button>
            
            <button 
              onClick={() => alert('Función será implementada próximamente')}
              className="p-4 border border-gray-200 rounded-xl hover:border-brand hover:bg-brand-50 transition-all duration-200 text-left"
            >
              <div className="text-brand font-semibold mb-1">Ranking Global</div>
              <div className="text-sm text-gray-600">Ve tu posición en el ranking</div>
            </button>
          </div>
        </div>
      </main>

      {/* Join Game Modal */}
      <JoinGameModal 
        isOpen={showJoinModal} 
        onClose={() => setShowJoinModal(false)} 
      />
    </div>
  )
}
