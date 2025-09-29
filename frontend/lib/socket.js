import { io } from 'socket.io-client'

class SocketManager {
  constructor() {
    this.socket = null
    this.connected = false
    this.listeners = new Map()
    this.currentToken = null
    this.connectionAttempts = 0
    this.maxConnectionAttempts = 3
  }

  connect(token = null) {
    // Si ya hay una conexión activa con el mismo token, reutilizarla
    if (this.socket && this.connected && this.currentToken === token) {
      console.log('Reusing existing socket connection')
      return this.socket
    }

    // Si hay una conexión pero con diferente token, desconectar primero
    if (this.socket && this.currentToken !== token) {
      console.log('Token changed, reconnecting...')
      this.disconnect()
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
    this.currentToken = token
    
    // Configuración específica para producción vs desarrollo
    const isProduction = SOCKET_URL.includes('render.com') || SOCKET_URL.includes('https')
    
    console.log('Connecting to socket server:', SOCKET_URL)
    console.log('Production mode:', isProduction)
    console.log('Transport mode:', isProduction ? 'polling only' : 'websocket + polling')
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      // Para producción usar solo polling, para desarrollo websocket
      transports: isProduction ? ['polling'] : ['websocket', 'polling'],
      timeout: 30000,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      // Configuraciones específicas para Render.com
      ...(isProduction && {
        upgrade: false, // Deshabilitar upgrade a WebSocket
        forceNew: true,
        autoConnect: true
      })
    })

    // Eventos de conexión
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
      this.connected = true
      this.connectionAttempts = 0 // Reset counter on successful connection
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      this.connected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.connected = false
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts')
      this.connected = true
    })

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error)
    })

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed')
      this.connected = false
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket')
      this.socket.disconnect()
      this.socket = null
      this.connected = false
      this.currentToken = null
      this.connectionAttempts = 0
      this.listeners.clear()
    }
  }

  emit(event, data, callback) {
    if (!this.socket || !this.connected) {
      console.warn('Socket not connected, cannot emit:', event)
      return false
    }

    console.log('Emitting event:', event, data)
    
    if (callback) {
      this.socket.emit(event, data, callback)
    } else {
      this.socket.emit(event, data)
    }
    return true
  }

  on(event, callback) {
    if (!this.socket) {
      console.warn('Socket not initialized, cannot listen to:', event)
      return
    }

    // Guardar referencia del listener para poder removerlo después
    this.listeners.set(event, callback)
    this.socket.on(event, callback)
    console.log('Listening to event:', event)
  }

  off(event, callback) {
    if (!this.socket) {
      return
    }

    if (callback) {
      this.socket.off(event, callback)
    } else {
      // Si no se proporciona callback, remover todos los listeners de ese evento
      this.socket.off(event)
    }
    
    this.listeners.delete(event)
    console.log('Stopped listening to event:', event)
  }

  // Métodos específicos para el juego
  createGame(gameData, callback) {
    return this.emit('createGame', gameData, callback)
  }

  createGameOriginal(gameData) {
    return this.emit('createGameOriginal', gameData)
  }

  joinGame(gameId, userPayload, callback) {
    // userPayload: { uid, displayName }
    return this.emit('joinGame', { gameId, ...userPayload }, callback)
  }

  leaveGame(gameId, payloadOrCallback, maybeCb) {
    // Soportar leaveGame(gameId, { uid }, cb) o leaveGame(gameId, cb)
    if (typeof payloadOrCallback === 'function') {
      return this.emit('leaveGame', { gameId }, payloadOrCallback)
    }
    const callback = maybeCb
    const payload = payloadOrCallback || {}
    return this.emit('leaveGame', { gameId, ...payload }, callback)
  }

  startGame(gameId, callback) {
    return this.emit('startGame', { gameId }, callback)
  }

  submitAnswer(gameId, _questionIndex, answer, callback) {
    const payload = {
      gameId,
      uid: answer?.uid,
      // Backend soporta answerValue o answerIndex
      answerValue: typeof answer?.value !== 'undefined' ? answer.value : undefined,
      answerIndex: typeof answer?.index === 'number' ? answer.index : undefined
    }
    return this.emit('submitAnswer', payload, callback)
  }

  requestQuestion(gameId, questionIndex, callback) {
    return this.emit('requestQuestion', {
      gameId,
      questionIndex
    }, callback)
  }
  
  // Sincronización de tiempo restante (si el backend lo ofrece)
  requestRemainingTime(gameId, questionIndex, callback) {
    return this.emit('requestRemainingTime', {
      gameId,
      questionIndex
    }, callback)
  }

  // Getters
  isConnected() {
    return this.connected && this.socket && this.socket.connected
  }

  getId() {
    return this.socket?.id || null
  }

  getSocket() {
    return this.socket
  }
}

// Crear instancia singleton
const socketManager = new SocketManager()

export default socketManager
