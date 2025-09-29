'use client'

import { 
  UsersIcon, 
  ClockIcon, 
  TagIcon,
  ArrowRightIcon,
  LockIcon,
  SpinnerGapIcon
} from '@phosphor-icons/react/ssr'

export default function GameCard({ game, onJoin, isJoining = false }) {
  const {
    id,
    name,
    category,
    difficulty,
    maxPlayers,
    currentPlayers,
    isPrivate,
    createdBy,
    createdAt,
    status
  } = game

  const difficultyColors = {
    'Fácil': 'bg-green-100 text-green-700',
    'Medio': 'bg-yellow-100 text-yellow-700',
    'Difícil': 'bg-red-100 text-red-700'
  }

  const statusColors = {
    'waiting': 'bg-blue-100 text-blue-700',
    'playing': 'bg-orange-100 text-orange-700',
    'finished': 'bg-gray-100 text-gray-700'
  }

  const statusLabels = {
    'waiting': 'Esperando',
    'playing': 'En juego',
    'finished': 'Terminado'
  }

  const isJoinable = status === 'waiting' && currentPlayers < maxPlayers

  const handleJoin = () => {
    if (isJoinable && onJoin) {
      onJoin(game)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            {isPrivate && (
              <LockIcon size={16} className="text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600">Por {createdBy}</p>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      {/* Game Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <TagIcon size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{category}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UsersIcon size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {currentPlayers}/{maxPlayers} jugadores
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <ClockIcon size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {new Date(createdAt).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Jugadores</span>
          <span>{currentPlayers}/{maxPlayers}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-brand to-brand-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentPlayers / maxPlayers) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleJoin}
        disabled={!isJoinable || isJoining}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
          ${isJoinable && !isJoining
            ? 'bg-gradient-to-r from-brand to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 hover:shadow-md' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isJoining ? (
          <>
            <SpinnerGapIcon size={16} className="animate-spin" />
            <span>Uniéndose...</span>
          </>
        ) : status === 'playing' ? (
          <>
            <span>En progreso</span>
          </>
        ) : status === 'finished' ? (
          <>
            <span>Terminado</span>
          </>
        ) : currentPlayers >= maxPlayers ? (
          <>
            <span>Partida llena</span>
          </>
        ) : (
          <>
            <span>Unirse</span>
            <ArrowRightIcon size={16} />
          </>
        )}
      </button>
    </div>
  )
}
