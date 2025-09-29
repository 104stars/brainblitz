'use client'

import { useParams } from 'next/navigation'
import AuthGuard from '../../../../components/auth/AuthGuard'
import GameRoom from '../../../../components/game/GameRoom'

export default function PlayPage() {
  const params = useParams()
  const gameId = params.gameId

  return (
    <AuthGuard>
      <GameRoom gameId={gameId} />
    </AuthGuard>
  )
}


