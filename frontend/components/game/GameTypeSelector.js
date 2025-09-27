'use client'

import { GlobeIcon, LockIcon, UsersIcon } from '@phosphor-icons/react/ssr'

export default function GameTypeSelector({ 
  gameType, 
  onGameTypeChange, 
  disabled = false 
}) {
  const gameTypes = [
    {
      id: 'public',
      name: 'Pública',
      description: 'Cualquier jugador puede unirse',
      icon: GlobeIcon,
      features: [
        'Visible para todos',
        'Unión automática',
        'Aparece en el dashboard',
        'Máximo 10 jugadores'
      ],
      color: 'blue'
    },
    {
      id: 'private',
      name: 'Privada',
      description: 'Solo con código de invitación',
      icon: LockIcon,
      features: [
        'Solo por invitación',
        'Código de 6 dígitos',
        'Control total del host',
        'Máximo 10 jugadores'
      ],
      color: 'purple'
    }
  ]

  const colorClasses = {
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      selected: 'border-blue-500 bg-blue-100 ring-blue-500',
      hover: 'hover:border-blue-300 hover:bg-blue-50'
    },
    purple: {
      border: 'border-purple-200',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      selected: 'border-purple-500 bg-purple-100 ring-purple-500',
      hover: 'hover:border-purple-300 hover:bg-purple-50'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UsersIcon size={20} className="text-brand" />
        <h3 className="text-lg font-semibold text-gray-900">Tipo de Partida</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gameTypes.map((type) => {
          const colors = colorClasses[type.color]
          const isSelected = gameType === type.id
          const IconComponent = type.icon
          
          return (
            <button
              key={type.id}
              onClick={() => onGameTypeChange(type.id)}
              disabled={disabled}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? `${colors.selected} ring-2 ring-opacity-20` 
                  : `${colors.border} ${colors.hover}`
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <IconComponent size={24} className={colors.text} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${colors.text}`}>
                      {type.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {type.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} ${colors.text}`}></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Información adicional */}
      {gameType === 'private' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <LockIcon size={20} className="text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900 text-sm mb-2">
                Partida Privada
              </h4>
              <div className="text-purple-700 text-sm space-y-1">
                <p>• Se generará un código único de 6 dígitos</p>
                <p>• Podrás compartir el código con tus amigos</p>
                <p>• Solo jugadores con el código pueden unirse</p>
                <p>• Tendrás control total sobre quién participa</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameType === 'public' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <GlobeIcon size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm mb-2">
                Partida Pública
              </h4>
              <div className="text-blue-700 text-sm space-y-1">
                <p>• Aparecerá en la lista de partidas públicas</p>
                <p>• Cualquier jugador registrado puede unirse</p>
                <p>• Ideal para conocer nuevos jugadores</p>
                <p>• Mayor competitividad y diversión</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
