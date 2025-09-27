import { useEffect, useState, useCallback, useRef } from 'react'
import socketManager from '../lib/socket'
import { useAuth } from './useAuth'

export const useSocket = () => {
  const { token, isAuthenticated } = useAuth()
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const listenersRef = useRef(new Set())

  // Conectar cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && token) {
      try {
        const socket = socketManager.connect(token)
        
        // Escuchar cambios de conexión
        const handleConnect = () => {
          setConnected(true)
          setError(null)
        }

        const handleDisconnect = (reason) => {
          setConnected(false)
          if (reason === 'io server disconnect') {
            setError('Desconectado del servidor')
          }
        }

        const handleConnectError = (err) => {
          setConnected(false)
          setError(err.message || 'Error de conexión')
        }

        const handleReconnect = () => {
          setConnected(true)
          setError(null)
        }

        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)
        socket.on('connect_error', handleConnectError)
        socket.on('reconnect', handleReconnect)

        // Cleanup
        return () => {
          socket.off('connect', handleConnect)
          socket.off('disconnect', handleDisconnect)
          socket.off('connect_error', handleConnectError)
          socket.off('reconnect', handleReconnect)
        }
      } catch (err) {
        console.error('Error connecting to socket:', err)
        setError(err.message)
      }
    } else {
      // Desconectar si no está autenticado
      socketManager.disconnect()
      setConnected(false)
    }

    // Cleanup al desmontar
    return () => {
      // Remover todos los listeners registrados por este hook
      listenersRef.current.forEach(({ event, callback }) => {
        socketManager.off(event, callback)
      })
      listenersRef.current.clear()
    }
  }, [isAuthenticated, token])

  // Función para emitir eventos
  const emit = useCallback((event, data, callback) => {
    if (!connected) {
      console.warn('Socket not connected, cannot emit:', event)
      return false
    }
    return socketManager.emit(event, data, callback)
  }, [connected])

  // Función para escuchar eventos
  const on = useCallback((event, callback) => {
    socketManager.on(event, callback)
    // Guardar referencia para cleanup
    listenersRef.current.add({ event, callback })
    
    // Retornar función para remover el listener
    return () => {
      socketManager.off(event, callback)
      listenersRef.current.delete({ event, callback })
    }
  }, [])

  // Función para remover listeners
  const off = useCallback((event, callback) => {
    socketManager.off(event, callback)
    if (callback) {
      listenersRef.current.delete({ event, callback })
    } else {
      // Remover todos los listeners de ese evento
      listenersRef.current.forEach((listener) => {
        if (listener.event === event) {
          listenersRef.current.delete(listener)
        }
      })
    }
  }, [])

  // Métodos específicos del juego
  const createGame = useCallback((gameData) => {
    return new Promise((resolve, reject) => {
      if (!connected) {
        reject(new Error('Socket not connected'))
        return
      }

      socketManager.createGame(gameData, (response) => {
        if (response.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.error || 'Failed to create game'))
        }
      })
    })
  }, [connected])

  const joinGame = useCallback((gameId) => {
    return new Promise((resolve, reject) => {
      if (!connected) {
        reject(new Error('Socket not connected'))
        return
      }

      socketManager.joinGame(gameId, (response) => {
        if (response.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.error || 'Failed to join game'))
        }
      })
    })
  }, [connected])

  const leaveGame = useCallback((gameId) => {
    return new Promise((resolve, reject) => {
      if (!connected) {
        reject(new Error('Socket not connected'))
        return
      }

      socketManager.leaveGame(gameId, (response) => {
        if (response.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.error || 'Failed to leave game'))
        }
      })
    })
  }, [connected])

  const startGame = useCallback((gameId) => {
    return new Promise((resolve, reject) => {
      if (!connected) {
        reject(new Error('Socket not connected'))
        return
      }

      socketManager.startGame(gameId, (response) => {
        if (response.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.error || 'Failed to start game'))
        }
      })
    })
  }, [connected])

  const submitAnswer = useCallback((gameId, questionIndex, answer) => {
    return new Promise((resolve, reject) => {
      if (!connected) {
        reject(new Error('Socket not connected'))
        return
      }

      socketManager.submitAnswer(gameId, questionIndex, answer, (response) => {
        if (response.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.error || 'Failed to submit answer'))
        }
      })
    })
  }, [connected])

  return {
    // Estado
    connected,
    error,
    socket: socketManager.getSocket(),
    socketId: socketManager.getId(),

    // Métodos básicos
    emit,
    on,
    off,

    // Métodos del juego
    createGame,
    joinGame,
    leaveGame,
    startGame,
    submitAnswer,

    // Utilidades
    isConnected: () => socketManager.isConnected(),
    disconnect: () => socketManager.disconnect()
  }
}
