'use client'

import { memo } from 'react'

function QuestionCard({ question, selected, locked, onSelect, showCorrect = false }) {
  if (!question) return null

  const handleClick = (value, index) => {
    if (locked) return
    onSelect?.({ value, index })
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">Pregunta</div>
      <h2 className="text-xl font-semibold text-gray-900">{question.text || question.question}</h2>

      <div className="space-y-3" role="list" aria-label="Opciones de respuesta">
        {(question.options || question.answers || []).map((opt, idx) => {
          const value = typeof opt === 'string' ? opt : opt?.text || opt?.value || String(idx)
          const isCorrect = showCorrect && (typeof question.correctAnswerIndex === 'number') && idx === question.correctAnswerIndex
          const isSelected = selected === value
          return (
            <button
              key={value}
              type="button"
              role="listitem"
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                isCorrect
                  ? 'border-green-300 bg-green-50'
                  : isSelected
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-200 bg-white'
              } ${locked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              aria-pressed={isSelected}
              aria-disabled={locked}
              onClick={() => handleClick(value, idx)}
            >
              <span className="font-medium text-gray-900">{value}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(QuestionCard)


