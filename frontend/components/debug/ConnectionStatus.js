'use client'

import { useSocket } from '../../hooks/useSocket'
import { useGame } from '../../hooks/useGame'

export default function ConnectionStatus() {
  const socketHook = useSocket()
  const gameHook = useGame()

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg text-xs">
      <h3 className="font-semibold mb-2">Debug: Connection Status</h3>
      <div className="space-y-1">
        <div>
          <span className="text-gray-600">useSocket connected:</span>
          <span className={socketHook.connected ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
            {socketHook.connected ? '✅ True' : '❌ False'}
          </span>
        </div>
        <div>
          <span className="text-gray-600">useGame connected:</span>
          <span className={gameHook.connected ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
            {gameHook.connected ? '✅ True' : '❌ False'}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Socket ID:</span>
          <span className="text-blue-600 ml-1">
            {socketHook.socketId || 'None'}
          </span>
        </div>
      </div>
    </div>
  )
}
