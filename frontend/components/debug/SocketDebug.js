'use client'

import { useState, useEffect } from 'react'
import { useSocketDebug } from '../../hooks/useSocketDebug'
import { useAuth } from '../../hooks/useAuth'

export default function SocketDebug() {
  const { connected, error, socketId, emit, on, off } = useSocketDebug()
  const { isAuthenticated, token } = useAuth()
  const [logs, setLogs] = useState([])
  const [testMessage, setTestMessage] = useState('')

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-9), { timestamp, message, type }])
  }

  useEffect(() => {
    if (connected) {
      addLog('✅ Socket conectado exitosamente', 'success')
    } else if (error) {
      addLog(`❌ Error de conexión: ${error}`, 'error')
    }
  }, [connected, error])

  const handleTestConnection = () => {
    addLog('🔄 Probando conexión...', 'info')
    
    // Mostrar información de configuración
    addLog(`📡 Intentando conectar a: ${process.env.NEXT_PUBLIC_SOCKET_URL}`, 'info')
    
    if (!connected) {
      addLog('❌ No hay conexión WebSocket', 'error')
      addLog('💡 Probando conectividad básica...', 'info')
      
      // Probar conectividad HTTP básica
      fetch(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://backend-v1-2nej.onrender.com')
        .then(response => {
          if (response.ok) {
            addLog('✅ Servidor HTTP accesible', 'success')
            addLog('⚠️ Problema específico con WebSockets', 'warning')
          } else {
            addLog('❌ Servidor no responde HTTP', 'error')
          }
        })
        .catch(err => {
          addLog(`❌ Error de conectividad: ${err.message}`, 'error')
        })
      return
    }

    // Configurar listener para pong antes de enviar ping
    const handlePong = (data) => {
      addLog('✅ Pong recibido: ' + JSON.stringify(data), 'success')
      off('pong', handlePong) // Remover listener después de recibir respuesta
    }
    
    on('pong', handlePong)

    // Probar evento básico
    addLog('📤 Enviando ping...', 'info')
    emit('ping', { timestamp: Date.now() })
    
    // Timeout para detectar si no hay respuesta
    setTimeout(() => {
      off('pong', handlePong)
      addLog('⏱️ Timeout: No se recibió respuesta pong en 5 segundos', 'warning')
    }, 5000)
  }

  const handleTestGameCreation = () => {
    if (!connected) {
      addLog('❌ No hay conexión WebSocket', 'error')
      return
    }

    const gameData = {
      name: 'Partida de Prueba Debug',
      category: 'general',
      difficulty: 'medio',
      questionCount: 10,
      isPublic: true,
      createdBy: 'debug-user',
      creatorUsername: 'Usuario Debug'
    }

    addLog('🎮 Probando creación de partida...', 'info')
    addLog('📤 Enviando datos: ' + JSON.stringify(gameData), 'info')
    
    emit('createGame', gameData, (response) => {
      if (response && response.success) {
        addLog('✅ Partida creada exitosamente!', 'success')
        addLog('🎯 ID: ' + response.data.id, 'success')
        addLog('🔑 Código: ' + response.data.code, 'success')
        addLog('👥 Jugadores: ' + response.data.players.length, 'success')
        addLog('📊 Detalles completos: ' + JSON.stringify(response.data, null, 2), 'info')
      } else {
        addLog('❌ Error creando partida: ' + (response?.error || 'Sin respuesta'), 'error')
      }
    })
  }

  const handleSendCustomMessage = () => {
    if (!testMessage.trim()) return
    
    addLog(`📤 Enviando: ${testMessage}`, 'info')
    emit('test', { message: testMessage })
    setTestMessage('')
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔧 Debug WebSocket
      </h2>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Estado de Conexión</h3>
          <div className={`flex items-center gap-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">
              {connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Socket ID</h3>
          <div className="text-sm font-mono text-gray-600">
            {socketId || 'N/A'}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Autenticación</h3>
          <div className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
            {isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Pruebas Rápidas</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleTestConnection}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              🔍 Diagnosticar Conexión
            </button>
            <button
              onClick={handleTestConnection}
              disabled={!connected}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🏓 Test Ping
            </button>
            <button
              onClick={handleTestGameCreation}
              disabled={!connected}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎮 Test Crear Partida
            </button>
            <button
              onClick={() => {
                addLog('🔄 Intentando reconectar...', 'info')
                window.location.reload()
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              🔄 Reconectar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Mensaje Personalizado</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Mensaje de prueba..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendCustomMessage()}
            />
            <button
              onClick={handleSendCustomMessage}
              disabled={!connected || !testMessage.trim()}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📤 Enviar
            </button>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Logs de Conexión</h3>
          <button
            onClick={clearLogs}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            🗑️ Limpiar
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500">No hay logs aún...</div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  'text-gray-300'
                }`}
              >
                <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Environment Info */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Información del Entorno</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <div><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'No configurada'}</div>
          <div><strong>Socket URL:</strong> {process.env.NEXT_PUBLIC_SOCKET_URL || 'No configurada'}</div>
          <div><strong>Token disponible:</strong> {token ? 'Sí' : 'No'}</div>
        </div>
      </div>
    </div>
  )
}
