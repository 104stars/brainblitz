'use client'

export default function AnswerResult({ result }) {
  if (!result) return null
  const isCorrect = !!result.correct
  const explanation = result.explanation || result.message
  return (
    <div className={`rounded-2xl p-4 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
        {isCorrect ? '¡Correcto!' : 'Incorrecto'}
      </div>
      {explanation && (
        <div className="text-sm mt-1 text-gray-700">{explanation}</div>
      )}
    </div>
  )
}


