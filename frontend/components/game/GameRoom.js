'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '../../hooks/useGame'
import QuestionCard from './QuestionCard'
import Timer from './Timer'
import ProgressBar from './ProgressBar'
import ScoreBoard from './ScoreBoard'
import AnswerResult from './AnswerResult'
import FinalResults from './FinalResults'

export default function GameRoom({ gameId }) {
  const router = useRouter()
  const {
    currentGame,
    gameState,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    timeRemaining,
    players,
    scores,
    myScore,
    finalResults,
    loading,
    error,
    connected
  } = useGame()
  const store = useGame()

  const [localSelected, setLocalSelected] = useState(null)
  const [localLocked, setLocalLocked] = useState(false)
  const { submitAnswer } = useGame()

  // Confirmación al salir de la página durante una partida
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (gameState === 'playing') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [gameState])

  // Guard: si no hay juego o no estamos en playing/finished, redirigir a lobby
  useEffect(() => {
    if (!currentGame) return
    if (!['playing', 'finished'].includes(gameState)) {
      router.replace(`/game/lobby/${currentGame.id}`)
    }
  }, [currentGame, gameState, router])

  // Fallback desconexión
  const [showDisconnected, setShowDisconnected] = useState(false)
  useEffect(() => {
    setShowDisconnected(!connected)
  }, [connected])

  const handleSelect = useCallback(async (payload) => {
    if (localLocked) return
    const { value, index } = typeof payload === 'object' && payload !== null ? payload : { value: payload, index: undefined }
    setLocalSelected(value)
    setLocalLocked(true)
    try {
      await submitAnswer(typeof index === 'number' ? index : value)
    } catch (e) {
      setLocalLocked(false)
    }
  }, [localLocked, submitAnswer])

  // Reset selección cuando llega una nueva pregunta
  useEffect(() => {
    setLocalSelected(null)
    setLocalLocked(false)
  }, [currentQuestionIndex])

  // Placeholder inicial hasta tener componentes UI
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partida</h1>
            <p className="text-gray-600 mt-1">
              Pregunta {currentQuestionIndex + 1} / {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Tu puntaje</div>
            <div className="text-xl font-semibold text-brand">{myScore}</div>
          </div>
        </div>
      </header>

      {!connected && showDisconnected && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-yellow-800 text-sm">
            Reconectando con el servidor...
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loading && !currentQuestion && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-6">
              <ProgressBar current={currentQuestionIndex} total={totalQuestions} />
              <div className="flex items-center justify-between">
                <Timer key={currentQuestionIndex} seconds={timeRemaining} onExpire={() => handleSelect('__timeout__')} />
              </div>
              <QuestionCard
                question={currentQuestion}
                selected={localSelected}
                locked={localLocked}
                onSelect={handleSelect}
                showCorrect={true}
              />
              <AnswerResult result={store?.answerResult} />
            </div>
            <div className="space-y-6">
              <ScoreBoard players={players} scores={scores} currentUserId={currentGame?.currentUserId} />
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <FinalResults results={finalResults} onBack={() => router.replace('/dashboard')} />
        )}
      </main>
    </div>
  )
}


