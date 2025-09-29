'use client'

export default function ProgressBar({ current = 0, total = 0 }) {
  const percent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0
  return (
    <div className="w-full" aria-label="Progreso de la partida">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
        <span>Pregunta {current + 1} de {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}


