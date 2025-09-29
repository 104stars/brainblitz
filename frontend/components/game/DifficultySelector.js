'use client'

import { useState, useEffect } from 'react'
import { LightningIcon, TrendUpIcon } from '@phosphor-icons/react/ssr'
import { aiAPI } from '../../lib/api'

export default function DifficultySelector({ selectedDifficulty, onDifficultyChange, disabled = false }) {
  const [difficulties, setDifficulties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Dificultades por defecto según el plan
  const defaultDifficulties = [
    {
      id: 'facil',
      name: 'Fácil',
      description: 'Preguntas básicas y accesibles',
      color: 'green',
      icon: '😊',
      points: 10,
      timeLimit: 30
    },
    {
      id: 'medio',
      name: 'Medio',
      description: 'Preguntas de dificultad intermedia',
      color: 'yellow',
      icon: '🤔',
      points: 20,
      timeLimit: 20
    },
    {
      id: 'dificil',
      name: 'Difícil',
      description: 'Preguntas desafiantes para expertos',
      color: 'red',
      icon: '🧠',
      points: 30,
      timeLimit: 15
    }
  ]

  const colorClasses = {
    green: {
      border: 'border-green-200',
      bg: 'bg-green-50',
      text: 'text-green-700',
      selected: 'border-green-500 bg-green-100 ring-green-500',
      hover: 'hover:border-green-300 hover:bg-green-50'
    },
    yellow: {
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      selected: 'border-yellow-500 bg-yellow-100 ring-yellow-500',
      hover: 'hover:border-yellow-300 hover:bg-yellow-50'
    },
    red: {
      border: 'border-red-200',
      bg: 'bg-red-50',
      text: 'text-red-700',
      selected: 'border-red-500 bg-red-100 ring-red-500',
      hover: 'hover:border-red-300 hover:bg-red-50'
    }
  }

  useEffect(() => {
    const fetchDifficulties = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Intentar obtener niveles de dificultad del backend
        const levels = await aiAPI.getDifficultyLevels()
        
        if (levels && levels.length > 0) {
          // Mapear niveles del backend a formato de dificultades
          const backendDifficulties = levels.map((level, index) => {
            const defaultDiff = defaultDifficulties.find(d => 
              d.name.toLowerCase() === level.toLowerCase()
            ) || defaultDifficulties[index % defaultDifficulties.length]
            
            return {
              id: level.toLowerCase().replace(/\s+/g, '-'),
              name: level,
              description: defaultDiff.description,
              color: defaultDiff.color,
              icon: defaultDiff.icon,
              points: defaultDiff.points,
              timeLimit: defaultDiff.timeLimit
            }
          })
          setDifficulties(backendDifficulties)
        } else {
          throw new Error('No difficulty levels received')
        }
      } catch (err) {
        console.warn('Failed to fetch difficulties from backend:', err)
        setError('Usando niveles por defecto')
        setDifficulties(defaultDifficulties)
      } finally {
        setLoading(false)
      }
    }

    fetchDifficulties()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendUpIcon size={20} className="text-brand" />
          <h3 className="text-lg font-semibold text-gray-900">Dificultad</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl p-6 h-32"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendUpIcon size={20} className="text-brand" />
          <h3 className="text-lg font-semibold text-gray-900">Dificultad</h3>
        </div>
        {error && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <LightningIcon size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((difficulty) => {
          const colors = colorClasses[difficulty.color]
          const isSelected = selectedDifficulty?.id === difficulty.id
          
          return (
            <button
              key={difficulty.id}
              onClick={() => onDifficultyChange(difficulty)}
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
              <div className="text-center">
                <div className="text-4xl mb-2">{difficulty.icon}</div>
                <h4 className={`font-bold text-lg mb-1 ${colors.text}`}>
                  {difficulty.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {difficulty.description}
                </p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Puntos:</span>
                    <span className={`font-semibold ${colors.text}`}>
                      {difficulty.points}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tiempo:</span>
                    <span className={`font-semibold ${colors.text}`}>
                      {difficulty.timeLimit}s
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {selectedDifficulty && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{selectedDifficulty.icon}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                Dificultad: {selectedDifficulty.name}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedDifficulty.description}
              </p>
            </div>
            <div className="text-right text-sm">
              <div className="text-gray-500">
                <strong>{selectedDifficulty.points}</strong> puntos
              </div>
              <div className="text-gray-500">
                <strong>{selectedDifficulty.timeLimit}</strong> segundos
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
