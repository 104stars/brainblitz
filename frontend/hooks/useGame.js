import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import useGameStore from '../store/gameStore'
import { useSocket } from './useSocket'
import { mapDifficultyIdToApi } from '../lib/presetQuestions'
import { useAuth } from './useAuth'

export const useGame = () => {
  const router = useRouter()
  const { user, username, token } = useAuth()
  const { connected, on, off, createGame: socketCreateGame, joinGame: socketJoinGame, leaveGame: socketLeaveGame, startGame: socketStartGame, submitAnswer: socketSubmitAnswer, requestQuestion: socketRequestQuestion, requestRemainingTime: socketRequestRemaining } = useSocket()
  const questionStartRef = useRef(null)
  const submittedAnswerRef = useRef(null)
  
  const {
    currentGame,
    players,
    gameState,
    isHost,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    timeRemaining,
    scores,
    myScore,
    finalResults,
    answerResult,
    loading,
    error,
    
    setGame,
    setPlayers,
    addPlayer,
    removePlayer,
    setGameState,
    setCurrentQuestion,
    setTimeRemaining,
    setTotalQuestions,
    lockAnswer,
    unlockAnswer,
    updateScores,
    updateMyScore,
    setFinalResults,
    setAnswerResult,
    setLoading,
    setError,
    clearError,
    resetGame,
    
    getPlayerById,
    getPlayerCount,
    getProgress,
    isGameActive,
    canStartGame
  } = useGameStore()

  // Configurar listeners de WebSocket cuando se conecte
  useEffect(() => {
    if (!connected) return

    // Normalizador de jugadores (backend puede enviar uid/displayName)
    const normalizePlayer = (p) => ({
      id: p?.id || p?.uid,
      username: p?.username || p?.displayName || p?.email || 'Jugador',
      score: typeof p?.score === 'number' ? p.score : 0,
      responseTimes: Array.isArray(p?.responseTimes) ? p.responseTimes : []
    })

    // Listener: Jugador se unió
    const handlePlayerJoined = (data) => {
      console.log('Player joined:', data)
      if (Array.isArray(data?.players)) {
        setPlayers(data.players.map(normalizePlayer))
      } else if (data?.player) {
        addPlayer(normalizePlayer(data.player))
        if ((data.player.id || data.player.uid) !== user?.uid) {
          console.log(`${data.player.displayName || data.player.username || 'Jugador'} se unió a la partida`)
        }
      }
    }

    // Listener: Jugador salió
    const handlePlayerLeft = (data) => {
      console.log('Player left:', data)
      if (Array.isArray(data?.players)) {
        setPlayers(data.players.map(normalizePlayer))
      } else if (data?.playerId) {
        removePlayer(data.playerId)
        const player = getPlayerById(data.playerId)
        if (player) {
          console.log(`${player.username} salió de la partida`)
        }
      }
    }

    // Listener: Juego iniciado
    const handleGameStarted = (data) => {
      console.log('Game started:', data)
      setGameState('playing')
      setCurrentQuestion(null, 0)
      // backend emite questionsCount
      if (typeof data?.questionsCount === 'number') {
        setTotalQuestions(data.questionsCount)
      }
      
      // Redirigir a la pantalla de juego
      if (currentGame?.id) {
        router.push(`/game/play/${currentGame.id}`)
      }
    }

    // Listener: Nueva pregunta
    const handleNewQuestion = (data) => {
      console.log('New question:', data)
      const index = typeof data.index === 'number' ? data.index : (typeof data.questionIndex === 'number' ? data.questionIndex : 0)
      setCurrentQuestion(data.question, index)
      setTimeRemaining(data.question?.timeLimit || 20)
      // Reset de feedback/locks en nueva pregunta
      try { setAnswerResult(null) } catch (_) {}
      questionStartRef.current = Date.now()
      submittedAnswerRef.current = null
    }

    // Listener: Resultado de respuesta
    const handleAnswerResult = (data) => {
      console.log('Answer result:', data)
      // data.players => [{ uid, displayName, score, responseTimes }]
      let wasCorrect = false
      if (Array.isArray(data?.players)) {
        // Actualizar lista de jugadores normalizada
        setPlayers(data.players.map(normalizePlayer))
        // Construir mapa de puntajes
        const newScores = {}
        data.players.forEach((p) => {
          const id = p.uid || p.id
          if (id) newScores[id] = typeof p.score === 'number' ? p.score : 0
        })
        updateScores(newScores)
        // Actualizar mi puntaje y determinar si fue correcta
        const me = data.players.find((p) => (p.uid || p.id) === user?.uid)
        const previousScore = myScore
        const newScore = me?.score || 0
        updateMyScore(newScore)
        // Si el puntaje aumentó, la respuesta fue correcta
        wasCorrect = newScore > previousScore
      }
      
      // Si tenemos la respuesta enviada, podemos verificar también por índice
      if (!wasCorrect && submittedAnswerRef.current !== null && typeof data.correctAnswerIndex === 'number') {
        wasCorrect = submittedAnswerRef.current === data.correctAnswerIndex
      }
      
      // Guardar feedback para UI (explicación / índice correcto / si fue correcta)
      setAnswerResult({
        correct: wasCorrect,
        correctAnswerIndex: data.correctAnswerIndex,
        explanation: data.explanation
      })
      // desbloquear para la siguiente pregunta cuando llegue
    }

    // Listener: Juego terminado
    const handleGameFinished = (data) => {
      console.log('Game finished:', data)
      setFinalResults(data.results)
      setGameState('finished')
    }

    // Listener: Error del juego
    const handleGameError = (data) => {
      console.error('Game error:', data)
      setError(data.message || 'Error en el juego')
    }

    // Listener: Actualización de partida
    const handleGameUpdate = (data) => {
      console.log('Game update:', data)
      if (data.game) {
        const previousId = currentGame?.id || currentGame?.code
        const nextId = data.game.id || data.game.gameId || previousId
        const nextCode = data.game.code || nextId
        setGame({
          ...data.game,
          id: nextId,
          code: nextCode,
          currentUserId: user?.uid
        })
      }
      if (data.players) {
        setPlayers(data.players.map(normalizePlayer))
      }
    }

    const handleHostChanged = (payload) => {
      if (!payload || !payload.hostId) return
      // Actualizar currentGame.hostId y recomputar isHost mediante setGame
      const updated = {
        ...currentGame,
        hostId: payload.hostId
      }
      setGame({
        ...updated,
        currentUserId: user?.uid
      })
    }

    // Al reconectar, intentar resincronizar pregunta y tiempo restante
    const handleReconnectSync = async () => {
      try {
        if (!currentGame?.id) return
        // Intentar pedir la pregunta actual
        await socketRequestQuestion(currentGame.id, currentQuestionIndex)
        const remaining = await socketRequestRemaining(currentGame.id, currentQuestionIndex)
        if (typeof remaining === 'number') {
          setTimeRemaining(Math.ceil(remaining / 1000))
        }
      } catch (e) {
        // Ignorar errores de resincronización
      }
    }

    // Registrar listeners
    const removePlayerJoined = on('playerJoined', handlePlayerJoined)
    const removePlayerLeft = on('playerLeft', handlePlayerLeft)
    // Algunos backends emiten 'playersUpdated' en lugar de playerLeft/joined
    const removePlayersUpdated = on('playersUpdated', (payload) => {
      if (Array.isArray(payload?.players)) {
        setPlayers(payload.players.map(normalizePlayer))
      }
    })
    const removeGameStarted = on('gameStarted', handleGameStarted)
    const removeNewQuestion = on('newQuestion', handleNewQuestion)
    const removeAnswerResult = on('answerResult', handleAnswerResult)
    const removeGameFinished = on('gameFinished', handleGameFinished)
    const removeGameError = on('gameError', handleGameError)
    const removeGameUpdate = on('gameUpdate', handleGameUpdate)
    const removeHostChanged = on('hostChanged', handleHostChanged)
    const removeReconnected = on('reconnect', handleReconnectSync)

    // Cleanup
    return () => {
      removePlayerJoined()
      removePlayerLeft()
      removePlayersUpdated()
      removeGameStarted()
      removeNewQuestion()
      removeAnswerResult()
      removeGameFinished()
      removeGameError()
      removeGameUpdate()
      removeHostChanged()
      removeReconnected()
    }
  }, [connected, currentGame?.id, currentQuestionIndex, user?.uid, router])

  // Crear juego
  const createGame = useCallback(async (gameData) => {
    if (!connected) {
      throw new Error('No hay conexión con el servidor')
    }

    setLoading(true)
    setError(null)

    try {
      const difficultyApi = mapDifficultyIdToApi(gameData.difficulty?.id)
      const topic = gameData.category?.name || gameData.category?.id || 'general'
      const gameConfig = {
        // Compat payload para servidores "simplificado" y "original"
        name: gameData.gameName,
        category: gameData.category?.id,
        topic, // algunos backends esperan 'topic'
        difficulty: difficultyApi, // 'easy'|'medium'|'hard'
        difficultyId: gameData.difficulty?.id, // referencia local 'facil'|'medio'|'dificil'
        questionCount: gameData.questionCount,
        count: gameData.questionCount, // algunos backends usan 'count'
        isPublic: gameData.gameType === 'public',
        createdBy: user?.uid,
        creatorUsername: username,
        hostId: user?.uid,
        displayName: username || user?.email?.split('@')[0] || 'Host',
        ...(Array.isArray(gameData.questions) && gameData.questions.length ? { questions: gameData.questions } : {})
      }

      console.log('Creating game with config:', gameConfig)
      
      // Usar el token del store (emitido en login) para alinear con el handshake
      const game = await socketCreateGame({ ...gameConfig, token })
      
      // Configurar el juego en el store
      setGame({
        ...game,
        id: game?.id || game?.gameId,
        code: game?.code || game?.id || game?.gameId,
        currentUserId: user?.uid
      })
      if (Array.isArray(game.players)) {
        setPlayers(game.players.map((p) => ({
          id: p?.id || p?.uid,
          username: p?.username || p?.displayName || p?.email || 'Jugador',
          score: typeof p?.score === 'number' ? p.score : 0,
          responseTimes: Array.isArray(p?.responseTimes) ? p.responseTimes : []
        })))
      }

      console.log('Game created successfully:', game)
      
      // Redirigir al lobby
      if (game?.id || game?.gameId) {
        const gid = game?.id || game?.gameId
        router.push(`/game/lobby/${gid}`)
      }
      
      return game
    } catch (err) {
      console.error('Error creating game:', err)
      setError(err.message || 'Error al crear la partida')
      throw err
    } finally {
      setLoading(false)
    }
  }, [connected, user?.uid, username, router, socketCreateGame, setLoading, setError, setGame])

  // Unirse a juego
  const joinGame = useCallback(async (gameId) => {
    if (!connected) {
      throw new Error('No hay conexión con el servidor')
    }

    setLoading(true)
    setError(null)

    try {
      const game = await socketJoinGame(gameId, {
        uid: user?.uid,
        displayName: username || user?.email?.split('@')[0] || 'Jugador'
      })
      
      setGame({
        ...game,
        id: game?.id || gameId || game?.gameId,
        code: game?.code || game?.id || gameId || game?.gameId,
        currentUserId: user?.uid
      })
      if (Array.isArray(game.players)) {
        setPlayers(game.players.map((p) => ({
          id: p?.id || p?.uid,
          username: p?.username || p?.displayName || p?.email || 'Jugador',
          score: typeof p?.score === 'number' ? p.score : 0,
          responseTimes: Array.isArray(p?.responseTimes) ? p.responseTimes : []
        })))
      }

      console.log('Joined game successfully:', game)
      
      // Redirigir al lobby
      router.push(`/game/lobby/${gameId}`)
      
      return game
    } catch (err) {
      console.error('Error joining game:', err)
      setError(err.message || 'Error al unirse a la partida')
      throw err
    } finally {
      setLoading(false)
    }
  }, [connected, user?.uid, router, socketJoinGame, setLoading, setError, setGame])

  // Salir del juego
  const leaveGame = useCallback(async (gameId) => {
    // Siempre intentamos salir limpiamente, incluso si no hay conexión
    setLoading(true)
    setError(null)

    try {
      if (connected && gameId) {
        // No bloquear si el backend no envía ACK: usar timeout corto
        const ackOrTimeout = Promise.race([
          socketLeaveGame(gameId, { uid: user?.uid }),
          new Promise((resolve) => setTimeout(resolve, 800))
        ])
        await ackOrTimeout
      }
    } catch (err) {
      console.error('Error leaving game:', err)
      // No bloquear navegación por error al salir
    } finally {
      resetGame()
      console.log('Left game (frontend)')
      router.replace('/dashboard')
      setLoading(false)
    }
  }, [connected, router, socketLeaveGame, setLoading, setError, resetGame])

  // Iniciar juego (solo host)
  const startGame = useCallback(async (gameId) => {
    if (!connected || !isHost || !gameId) {
      throw new Error('No tienes permisos para iniciar la partida')
    }

    setLoading(true)
    setError(null)

    try {
      await socketStartGame(gameId)
      console.log('Game started successfully')
    } catch (err) {
      console.error('Error starting game:', err)
      setError(err.message || 'Error al iniciar la partida')
      throw err
    } finally {
      setLoading(false)
    }
  }, [connected, isHost, socketStartGame, setLoading, setError])

  // Enviar respuesta (durante el juego)
  const submitAnswer = useCallback(async (answerValueOrIndex) => {
    if (!connected || !currentGame?.id) {
      throw new Error('No hay conexión o juego activo')
    }

    // Calcular elapsed desde que llegó la pregunta
    const elapsedMs = questionStartRef.current ? Date.now() - questionStartRef.current : null
    const isIndex = typeof answerValueOrIndex === 'number'
    const isTimeout = answerValueOrIndex === '__timeout__'
    const valueToSend = isTimeout ? null : (isIndex ? undefined : answerValueOrIndex)
    const indexToSend = isTimeout ? undefined : (isIndex ? answerValueOrIndex : undefined)

    // Guardar la respuesta enviada para validación posterior
    submittedAnswerRef.current = isTimeout ? null : (isIndex ? answerValueOrIndex : null)

    try {
      lockAnswer(isIndex ? null : answerValueOrIndex)
      await socketSubmitAnswer(currentGame.id, currentQuestionIndex, {
        value: valueToSend,
        index: indexToSend,
        elapsedMs,
        uid: user?.uid
      })
    } catch (err) {
      console.error('Error submitting answer:', err)
      // Permitimos reintentar en caso de error, pero evitamos doble envío rápido
      unlockAnswer()
      throw err
    }
  }, [connected, currentGame?.id, currentQuestionIndex, socketSubmitAnswer, lockAnswer, unlockAnswer, user?.uid])

  return {
    // Estado
    currentGame,
    players,
    gameState,
    isHost,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    timeRemaining,
    scores,
    myScore,
    finalResults,
    answerResult,
    loading,
    error,
    connected,

    // Acciones
    createGame,
    joinGame,
    leaveGame,
    startGame,
    submitAnswer,
    clearError,
    resetGame,

    // Utilidades
    getPlayerById,
    getPlayerCount,
    getProgress,
    isGameActive,
    canStartGame
  }
}
