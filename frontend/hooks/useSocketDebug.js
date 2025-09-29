import { useEffect, useState, useCallback, useRef } from 'react'
import socketManager from '../lib/socket'

export const useSocketDebug = () => {
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const listenersRef = useRef(new Set())

  // Conectar sin autenticación para debug
  useEffect(() => {
    try {
      const socket = socketManager.connect() // Sin token para debug

      // Si ya estaba conectado antes de montar este hook, reflejarlo inmediatamente
      if (socket?.connected || socketManager.isConnected()) {
        setConnected(true)
        setError(null)
      }
      
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
      console.error('Error connecting to socket for debug:', err)
      setError(err.message)
    }

    // Cleanup al desmontar
    return () => {
      // Remover todos los listeners registrados por este hook
      listenersRef.current.forEach(({ event, callback }) => {
        socketManager.off(event, callback)
      })
      listenersRef.current.clear()
    }
  }, [])

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

    // Utilidades
    isConnected: () => socketManager.isConnected(),
    disconnect: () => socketManager.disconnect()
  }
}
