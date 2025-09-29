'use client'

import { useState } from 'react'
import { useGame } from '../../hooks/useGame'
import LoadingButton from '../auth/LoadingButton'
import { X, Hash, WarningCircle } from '@phosphor-icons/react/ssr'

export default function JoinGameModal({ isOpen, onClose }) {
  const [gameCode, setGameCode] = useState('')
  const [localError, setLocalError] = useState(null)
  const { joinGame, loading } = useGame()

  const handleCodeChange = (e) => {
    // Formatear código: solo números, máximo 6 dígitos
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setGameCode(value)
    if (localError) setLocalError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (gameCode.length !== 6) {
      setLocalError('El código debe tener 6 dígitos')
      return
    }

    try {
      await joinGame(gameCode) // Backend acepta tanto ID como código
      onClose() // Cerrar modal tras éxito
      setGameCode('') // Limpiar código
      setLocalError(null)
    } catch (error) {
      setLocalError(error.message || 'Error al unirse a la partida')
    }
  }

  const handleClose = () => {
    if (!loading) {
      setGameCode('')
      setLocalError(null)
      onClose()
    }
  }

  const formatDisplayCode = (code) => {
    // Mostrar código como XXX-XXX para mejor legibilidad
    if (code.length <= 3) return code
    return `${code.slice(0, 3)}-${code.slice(3)}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg">
              <Hash size={24} className="text-brand" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Unirse por Código</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="gameCode" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Partida
            </label>
            <input
              id="gameCode"
              type="text"
              value={formatDisplayCode(gameCode)}
              onChange={handleCodeChange}
              placeholder="123-456"
              disabled={loading}
              className={`
                w-full px-4 py-3 border rounded-lg text-center text-lg font-mono tracking-wider
                focus:ring-2 focus:ring-brand focus:border-brand transition-colors
                disabled:bg-gray-50 disabled:cursor-not-allowed
                ${localError ? 'border-red-300 bg-red-50' : 'border-gray-300'}
              `}
              maxLength={7} // 6 dígitos + 1 guión
            />
            <p className="mt-2 text-sm text-gray-500">
              Ingresa el código de 6 dígitos de la partida
            </p>
          </div>

          {/* Error Message */}
          {localError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <WarningCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{localError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <LoadingButton
              type="submit"
              loading={loading}
              disabled={gameCode.length !== 6}
              className="flex-1 bg-gradient-to-r from-brand to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unirse
            </LoadingButton>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">¿Cómo obtener un código?</h3>
          <p className="text-sm text-gray-600">
            El host de la partida puede compartir el código de 6 dígitos desde el lobby de la partida.
          </p>
        </div>
      </div>
    </div>
  )
}
