'use client'

export default function AnswerResult({ result }) {
  if (!result) return null
  const isCorrect = !!result.correct
  const explanation = result.explanation || result.message
  
  return (
    <div 
      className={`rounded-2xl p-5 border-2 shadow-sm transition-all duration-300 ${
        isCorrect 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {isCorrect ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className={`text-lg mb-1 ${
            isCorrect ? 'text-green-800' : 'text-red-800'
          }`}>
            {isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
          </div>
          {explanation && (
            <div className={`text-sm leading-relaxed ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


