'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { useGame } from '../../hooks/useGame'
import CategorySelector from './CategorySelector'
import DifficultySelector from './DifficultySelector'
import QuestionCountSelector from './QuestionCountSelector'
import GameTypeSelector from './GameTypeSelector'
import LoadingButton from '../auth/LoadingButton'
import { aiAPI } from '../../lib/api'
import { getPresetQuestions, mapDifficultyIdToApi } from '../../lib/presetQuestions'
import { 
  PlayIcon, 
  SparkleIcon, 
  ExclamationMarkIcon,
  CheckCircleIcon,
  WifiSlashIcon
} from '@phosphor-icons/react/ssr'

export default function GameConfigForm() {
  const router = useRouter()
  const { user, username } = useAuth()
  const { createGame, loading: gameLoading, error: gameError, connected, clearError } = useGame()
  
  const [formData, setFormData] = useState({
    gameName: '',
    category: null,
    difficulty: null,
    questionCount: 15,
    gameType: 'public'
  })
  
  const [localError, setLocalError] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [questions, setQuestions] = useState([])
  const [generating, setGenerating] = useState(false)

  // Combinar loading y error del hook useGame con el local
  const loading = gameLoading
  const error = gameError || localError

  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (localError) {
      setLocalError(null)
    }
    if (gameError) {
      clearError()
    }

    // Si el usuario cambia parámetros clave, invalidar preguntas generadas
    if (['category','difficulty','questionCount'].includes(field)) {
      setQuestions([])
    }
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.gameName.trim()) {
      errors.push('El nombre de la partida es requerido')
    } else if (formData.gameName.length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres')
    } else if (formData.gameName.length > 50) {
      errors.push('El nombre no puede tener más de 50 caracteres')
    }
    
    if (!formData.category) {
      errors.push('Debes seleccionar una categoría')
    }
    
    if (!formData.difficulty) {
      errors.push('Debes seleccionar una dificultad')
    }
    
    if (formData.questionCount < 5 || formData.questionCount > 50) {
      errors.push('La cantidad de preguntas debe estar entre 5 y 50')
    }
    
    return errors
  }

  const handlePreview = () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setLocalError(errors[0])
      return
    }
    setShowPreview(true)
  }

  const handleGenerateQuestions = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setLocalError(errors[0])
      return
    }

    try {
      setGenerating(true)
      setLocalError(null)

      const topic = formData.category?.name || formData.category?.id
      const difficultyApi = mapDifficultyIdToApi(formData.difficulty?.id)
      const count = formData.questionCount

      const data = await aiAPI.generateQuestions({
        topic,
        difficulty: difficultyApi,
        count,
        useAI: true
      })

      if (Array.isArray(data?.questions) && data.questions.length > 0) {
        setQuestions(data.questions.slice(0, count))
      } else {
        // Fallback local
        setQuestions(getPresetQuestions(formData.category?.name || formData.category?.id, formData.difficulty?.id, count))
      }
    } catch (e) {
      console.warn('AI generation failed, using preset questions:', e)
      setQuestions(getPresetQuestions(formData.category?.name || formData.category?.id, formData.difficulty?.id, formData.questionCount))
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateGame = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setLocalError(errors[0])
      return
    }

    if (!connected) {
      setLocalError('No hay conexión con el servidor. Verifica tu conexión a internet.')
      return
    }
    
    setLocalError(null)
    clearError()
    
    try {
      const gameData = {
        gameName: formData.gameName,
        category: formData.category,
        difficulty: formData.difficulty,
        questionCount: formData.questionCount,
        gameType: formData.gameType,
        questions
      }
      
      console.log('Creating game with WebSocket:', gameData)
      
      // Crear partida usando WebSocket
      await createGame(gameData)
      
      // El hook useGame se encarga de la redirección al lobby
      
    } catch (err) {
      console.error('Error creating game:', err)
      setLocalError(err.message || 'Error al crear la partida. Inténtalo de nuevo.')
    }
  }

  if (showPreview) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Vista Previa de tu Partida
            </h2>
            <p className="text-gray-600">
              Revisa la configuración antes de crear la partida
            </p>
          </div>

          {/* Resumen de configuración */}
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Configuración</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nombre:</span>
                  <p className="font-semibold">{formData.gameName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <p className="font-semibold">
                    {formData.gameType === 'public' ? 'Pública' : 'Privada'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Categoría:</span>
                  <p className="font-semibold">{formData.category?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Dificultad:</span>
                  <p className="font-semibold">{formData.difficulty?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Preguntas:</span>
                  <p className="font-semibold">{formData.questionCount}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo estimado:</span>
                  <p className="font-semibold">
                    ~{Math.ceil((formData.questionCount * 20) / 60)} min
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Volver a Editar
            </button>
            <LoadingButton
              onClick={handleCreateGame}
              loading={loading}
              className="flex-1"
              size="lg"
            >
              <PlayIcon size={20} className="mr-2" />
              {loading ? 'Creando...' : 'Crear Partida'}
            </LoadingButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Crear Nueva Partida
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configura tu partida personalizada. Elige la categoría, dificultad y cantidad de preguntas 
          para crear la experiencia perfecta para ti y tus amigos.
        </p>
        
        {/* Indicador de conexión */}
        <div className="mt-4">
          {connected ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Conectado al servidor
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
              <WifiSlashIcon size={16} />
              Sin conexión al servidor
            </div>
          )}
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
        {/* Nombre de la partida */}
        <div className="space-y-2">
          <label className="block text-lg font-semibold text-gray-900">
            Nombre de la Partida <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.gameName}
            onChange={(e) => handleInputChange('gameName')(e.target.value)}
            placeholder="Ej: Trivia de Conocimiento General"
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand disabled:opacity-50"
          />
          <p className="text-sm text-gray-500">
            {formData.gameName.length}/50 caracteres
          </p>
        </div>

        {/* Selecciones */}
        <CategorySelector
          selectedCategory={formData.category}
          onCategoryChange={handleInputChange('category')}
          disabled={loading}
        />

        <DifficultySelector
          selectedDifficulty={formData.difficulty}
          onDifficultyChange={handleInputChange('difficulty')}
          disabled={loading}
        />

        <QuestionCountSelector
          questionCount={formData.questionCount}
          onQuestionCountChange={handleInputChange('questionCount')}
          disabled={loading}
        />

        <GameTypeSelector
          gameType={formData.gameType}
          onGameTypeChange={handleInputChange('gameType')}
          disabled={loading}
        />

        {/* Generar preguntas */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            {questions.length > 0 ? (
              <span>
                Preguntas preparadas: <strong>{questions.length}</strong> / {formData.questionCount}
              </span>
            ) : (
              <span>No hay preguntas generadas aún.</span>
            )}
          </div>
          <LoadingButton
            onClick={handleGenerateQuestions}
            loading={generating}
            disabled={loading || !formData.category || !formData.difficulty}
            variant="secondary"
          >
            Generar preguntas
          </LoadingButton>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
            <ExclamationMarkIcon size={20} className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <LoadingButton
            onClick={handlePreview}
            disabled={loading}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <SparkleIcon size={20} className="mr-2" />
            Vista Previa
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}
