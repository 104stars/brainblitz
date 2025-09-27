'use client'

import { useState, useEffect } from 'react'
import { ArrowClockwiseIcon, MagnifyingGlassIcon } from '@phosphor-icons/react/ssr'
import { gamesAPI } from '../../lib/api'
import GameCard from './GameCard'

export default function PublicGamesList() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchGames = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const publicGames = await gamesAPI.getPublicGames()
      setGames(publicGames || [])
    } catch (err) {
      console.warn('Failed to fetch public games:', err)
      setError('Error al cargar partidas')
      
      // Datos mock para desarrollo
      setGames([
        {
          id: '1',
          name: 'Trivia General',
          category: 'General',
          difficulty: 'Medio',
          maxPlayers: 6,
          currentPlayers: 3,
          isPrivate: false,
          createdBy: 'JugadorPro',
          createdAt: new Date().toISOString(),
          status: 'waiting'
        },
        {
          id: '2',
          name: 'Ciencia y Tecnología',
          category: 'Ciencia',
          difficulty: 'Difícil',
          maxPlayers: 4,
          currentPlayers: 2,
          isPrivate: false,
          createdBy: 'CientificoLoco',
          createdAt: new Date(Date.now() - 300000).toISOString(),
          status: 'waiting'
        },
        {
          id: '3',
          name: 'Historia Mundial',
          category: 'Historia',
          difficulty: 'Fácil',
          maxPlayers: 8,
          currentPlayers: 8,
          isPrivate: false,
          createdBy: 'HistoriadorX',
          createdAt: new Date(Date.now() - 600000).toISOString(),
          status: 'playing'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
    
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchGames, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleJoinGame = (game) => {
    // TODO: Implementar lógica de unirse a partida
    console.log('Joining game:', game)
    alert(`Función de unirse a partida "${game.name}" será implementada próximamente`)
  }

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || game.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Partidas Públicas</h2>
        <button
          onClick={fetchGames}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand hover:text-brand-600 transition-colors disabled:opacity-50"
        >
           <ArrowClockwiseIcon size={16} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar partidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
        >
          <option value="all">Todas</option>
          <option value="waiting">Esperando</option>
          <option value="playing">En juego</option>
        </select>
      </div>

      {/* Games List */}
      {loading && games.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6">
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : error && games.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchGames}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'No se encontraron partidas con los filtros aplicados' 
              : 'No hay partidas públicas disponibles'
            }
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
              }}
              className="mt-2 text-brand hover:text-brand-600 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onJoin={handleJoinGame}
            />
          ))}
        </div>
      )}

      {/* Footer Info */}
      {games.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Mostrando {filteredGames.length} de {games.length} partidas
            {error && (
              <span className="text-amber-600 ml-2">
                • Datos de demostración (servidor desconectado)
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
