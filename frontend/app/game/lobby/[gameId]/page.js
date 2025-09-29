'use client'

import { useParams } from 'next/navigation'
import AuthGuard from '../../../../components/auth/AuthGuard'
import GameLobby from '../../../../components/game/GameLobby'

export default function GameLobbyPage() {
  const params = useParams()
  const gameId = params.gameId

  return (
    <AuthGuard>
      <GameLobby gameId={gameId} />
    </AuthGuard>
  )
}
