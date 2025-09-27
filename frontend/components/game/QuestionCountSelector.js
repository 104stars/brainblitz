'use client'

import { QuestionMarkIcon, ClockIcon } from '@phosphor-icons/react/ssr'

export default function QuestionCountSelector({ 
  questionCount, 
  onQuestionCountChange, 
  disabled = false,
  min = 5,
  max = 50 
}) {
  // Opciones predefinidas comunes
  const presetOptions = [5, 10, 15, 20, 25, 30]

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value)
    onQuestionCountChange(value)
  }

  const handlePresetClick = (count) => {
    onQuestionCountChange(count)
  }

  // Calcular tiempo estimado (asumiendo 20 segundos promedio por pregunta)
  const estimatedTime = Math.ceil((questionCount * 20) / 60) // en minutos

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <QuestionMarkIcon size={20} className="text-brand" />
        <h3 className="text-lg font-semibold text-gray-900">Cantidad de Preguntas</h3>
      </div>

      {/* Opciones Rápidas */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Opciones rápidas:</p>
        <div className="flex flex-wrap gap-2">
          {presetOptions.map((count) => (
            <button
              key={count}
              onClick={() => handlePresetClick(count)}
              disabled={disabled}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium
                ${questionCount === count
                  ? 'border-brand bg-brand text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand hover:bg-brand-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Slider Personalizado */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Personalizar:</p>
        <div className="space-y-2">
          <input
            type="range"
            min={min}
            max={max}
            value={questionCount}
            onChange={handleSliderChange}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #0f5aff 0%, #0f5aff ${((questionCount - min) / (max - min)) * 100}%, #e5e7eb ${((questionCount - min) / (max - min)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{min}</span>
            <span className="font-semibold text-brand text-lg">
              {questionCount}
            </span>
            <span>{max}</span>
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ClockIcon size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">
              Tiempo estimado de partida
            </h4>
            <p className="text-blue-700 text-sm mt-1">
              Aproximadamente <strong>{estimatedTime} minuto{estimatedTime !== 1 ? 's' : ''}</strong> con {questionCount} pregunta{questionCount !== 1 ? 's' : ''}
            </p>
            <p className="text-blue-600 text-xs mt-2">
              * El tiempo puede variar según la dificultad y el tiempo de respuesta de los jugadores
            </p>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="font-semibold text-green-700 mb-1">Partida Rápida</div>
          <div className="text-green-600">5-10 preguntas</div>
          <div className="text-green-500">~5 minutos</div>
        </div>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <div className="font-semibold text-yellow-700 mb-1">Partida Normal</div>
          <div className="text-yellow-600">15-25 preguntas</div>
          <div className="text-yellow-500">~10 minutos</div>
        </div>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
          <div className="font-semibold text-red-700 mb-1">Partida Larga</div>
          <div className="text-red-600">30-50 preguntas</div>
          <div className="text-red-500">~20 minutos</div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0f5aff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0f5aff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
