'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '../../hooks/useGame'
import { useAuth } from '../../hooks/useAuth'
import LoadingButton from '../auth/LoadingButton'
import ConnectionStatus from '../debug/ConnectionStatus'
import {
  PlayIcon,
  ShareIcon,
  SignOutIcon,
  UsersIcon,
  ClockIcon,
  CopyIcon,
  CheckIcon
} from '@phosphor-icons/react/ssr'

export default function GameLobby({ gameId }) {
  const router = useRouter()
  const { username } = useAuth()
  
  // Hook para el estado del juego
  const {
    currentGame,
    players,
    isHost,
    loading,
    error,
    startGame,
    leaveGame,
    clearError,
    connected
  } = useGame()
  
  // Estado de conexión provisto por el socket autenticado del juego

  // Si no hay juego actual, redirigir al dashboard (sin depender de connected)
  useEffect(() => {
    if (!loading && !currentGame) {
      console.log('No current game, redirecting to dashboard')
      router.replace('/dashboard')
    }
  }, [currentGame, loading, router])

  const handleStartGame = async () => {
    if (!isHost || !gameId) return

    try {
      await startGame(gameId)
    } catch (err) {
      console.error('Error starting game:', err)
    }
  }

  const handleLeaveGame = async () => {
    if (!gameId) return

    try {
      await leaveGame(gameId)
    } catch (err) {
      console.error('Error leaving game:', err)
    }
  }

  const handleCopyGameCode = () => {
    if (currentGame?.code) {
      navigator.clipboard.writeText(currentGame.code)
      // TODO: Show toast notification
      console.log('Game code copied to clipboard')
    }
  }

  const handleShareGame = () => {
    if (currentGame?.code) {
      const shareUrl = `${window.location.origin}/game/join/${currentGame.code}`
      navigator.clipboard.writeText(shareUrl)
      // TODO: Show toast notification
      console.log('Share URL copied to clipboard')
    }
  }

  // Loading state
  if (loading || !currentGame) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sala de espera...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SignOutIcon size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={clearError}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reintentar
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-600"
            >
              Volver al Dashboard
            </button>
        </div>
      </div>
      
      {/* Debug Component - Temporal */}
      <ConnectionStatus />
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentGame.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Sala de espera • {players.length} jugador{players.length !== 1 ? 'es' : ''}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Connection status */}
              {connected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Conectado</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Desconectado</span>
                </div>
              )}
              
              <button
                onClick={handleLeaveGame}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <SignOutIcon size={16} />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Game info and controls */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Game code */}
            {currentGame.code && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Código de la Partida
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl font-bold text-brand tracking-wider">
                        {currentGame.code}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Comparte este código para que otros se unan
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleCopyGameCode}
                      className="p-2 text-gray-600 hover:text-brand border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Copiar código"
                    >
                      <CopyIcon size={20} />
                    </button>
                    <button
                      onClick={handleShareGame}
                      className="p-2 text-gray-600 hover:text-brand border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Compartir enlace"
                    >
                      <ShareIcon size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Game settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de la Partida
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">Categoría</div>
                  <div className="text-gray-600 mt-1">{currentGame.category || 'General'}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">Dificultad</div>
                  <div className="text-gray-600 mt-1">{currentGame.difficulty || 'Medio'}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">Preguntas</div>
                  <div className="text-gray-600 mt-1">{currentGame.questionCount || 15}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">Tipo</div>
                  <div className="text-gray-600 mt-1">{currentGame.isPublic ? 'Pública' : 'Privada'}</div>
                </div>
              </div>
            </div>

            {/* Start game button (only for host) */}
            {isHost && (
              <div className="bg-gradient-to-r from-brand to-brand-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      ¿Listos para jugar?
                    </h3>
                    <p className="text-blue-100">
                      Tienes {players.length} jugador{players.length !== 1 ? 'es' : ''} en la sala
                    </p>
                  </div>
                  <LoadingButton
                    onClick={handleStartGame}
                    loading={loading}
                    className="bg-white text-brand hover:bg-gray-50"
                    disabled={players.length < 1}
                  >
                    <PlayIcon size={20} className="mr-2" />
                    Iniciar Partida
                  </LoadingButton>
                </div>
              </div>
            )}

            {/* Waiting message (for non-hosts) */}
            {!isHost && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <ClockIcon size={24} className="text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Esperando al host
                    </h3>
                    <p className="text-blue-700 text-sm mt-1">
                      El host iniciará la partida cuando todos estén listos
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Players list */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <UsersIcon size={20} className="text-brand" />
              <h2 className="text-lg font-semibold text-gray-900">
                Jugadores ({players.length})
              </h2>
            </div>
            
            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand font-semibold text-sm">
                      {player.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {player.username}
                      {player.id === currentGame.host && (
                        <span className="ml-2 text-xs bg-brand text-white px-2 py-1 rounded-full">
                          HOST
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {player.id === currentGame.currentUserId ? 'Tú' : 'En línea'}
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>

            {players.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <UsersIcon size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500">No hay jugadores conectados</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
