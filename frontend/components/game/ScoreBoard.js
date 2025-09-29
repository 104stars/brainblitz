'use client'

export default function ScoreBoard({ players = [], scores = {}, currentUserId }) {
  const items = players
    .map((p) => ({
      id: p.id || p.uid,
      username: p.username || p.displayName || 'Jugador',
      score: typeof scores[(p.id || p.uid)] === 'number' ? scores[(p.id || p.uid)] : (p.score || 0)
    }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Marcador</h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id || item.username} className={`flex items-center justify-between p-2 rounded-lg ${item.id === currentUserId ? 'bg-brand/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <div className="w-6 text-gray-500">#{idx + 1}</div>
              <div className="font-medium text-gray-900">{item.username}</div>
            </div>
            <div className="text-brand font-semibold">{item.score}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-gray-500">Aún no hay jugadores</div>
        )}
      </div>
    </div>
  )
}


