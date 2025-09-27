'use client'

import { useState, useEffect } from 'react'
import { 
  TrophyIcon, 
  GameControllerIcon, 
  CheckCircleIcon, 
  LightningIcon 
} from '@phosphor-icons/react/ssr'
import { authAPI } from '../../lib/api'

export default function UserStats({ user }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Intentar obtener estadísticas del backend
        const userStats = await authAPI.getUserStats()
        setStats(userStats)
      } catch (err) {
        console.warn('Failed to fetch user stats from backend:', err)
        // Usar estadísticas por defecto para desarrollo
        setStats({
          gamesPlayed: 0,
          gamesWon: 0,
          correctAnswers: 0,
          totalAnswers: 0,
          winRate: 0,
          accuracy: 0
        })
        setError('Conectando con servidor...')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserStats()
    }
  }, [user])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statsData = [
    {
      label: 'Partidas Jugadas',
      value: stats?.gamesPlayed || 0,
      icon: GameControllerIcon,
      color: 'blue'
    },
    {
      label: 'Partidas Ganadas',
      value: stats?.gamesWon || 0,
      icon: TrophyIcon,
      color: 'yellow'
    },
    {
      label: 'Respuestas Correctas',
      value: stats?.correctAnswers || 0,
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      label: 'Precisión',
      value: stats?.accuracy ? `${Math.round(stats.accuracy)}%` : '0%',
      icon: LightningIcon,
      color: 'purple'
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tus Estadísticas</h2>
        {error && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            {error}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${colorClasses[stat.color]}`}>
              <stat.icon size={24} weight="bold" />
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {stats && stats.gamesPlayed > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tasa de Victoria</span>
            <span className="font-semibold text-gray-900">
              {Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%
            </span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-brand to-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(stats.gamesWon / stats.gamesPlayed) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
