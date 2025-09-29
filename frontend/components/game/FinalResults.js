'use client'

export default function FinalResults({ results, onBack }) {
  const items = Array.isArray(results?.standings) ? results.standings : []

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resultados finales</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">No hay resultados para mostrar.</p>
      ) : (
        <div className="space-y-2">
          {items.map((row, idx) => (
            <div key={row.id || row.username || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 text-gray-500">#{idx + 1}</div>
                <div className="font-medium text-gray-900">{row.username || 'Jugador'}</div>
              </div>
              <div className="text-brand font-semibold">{row.score ?? 0}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <button onClick={onBack} className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-600">Volver al dashboard</button>
      </div>
    </div>
  )
}


