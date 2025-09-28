import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useGameStore from '../store/gameStore'
import { useSocket } from './useSocket'
import { useAuth } from './useAuth'

export const useGame = () => {
  const router = useRouter()
  const { user, username } = useAuth()
  const { connected, on, off, createGame: socketCreateGame, joinGame: socketJoinGame, leaveGame: socketLeaveGame, startGame: socketStartGame } = useSocket()
  
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
    loading,
    error,
    
    setGame,
    setPlayers,
    addPlayer,
    removePlayer,
    setGameState,
    setCurrentQuestion,
    setTimeRemaining,
    updateScores,
    updateMyScore,
    setFinalResults,
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

    // Listener: Jugador se unió
    const handlePlayerJoined = (data) => {
      console.log('Player joined:', data)
      addPlayer(data.player)
      
      // Mostrar notificación opcional
      if (data.player.id !== user?.uid) {
        // TODO: Mostrar toast notification
        console.log(`${data.player.username} se unió a la partida`)
      }
    }

    // Listener: Jugador salió
    const handlePlayerLeft = (data) => {
      console.log('Player left:', data)
      removePlayer(data.playerId)
      
      // Mostrar notificación opcional
      const player = getPlayerById(data.playerId)
      if (player) {
        console.log(`${player.username} salió de la partida`)
      }
    }

    // Listener: Juego iniciado
    const handleGameStarted = (data) => {
      console.log('Game started:', data)
      setGameState('playing')
      setCurrentQuestion(null, 0)
      
      // Redirigir a la pantalla de juego
      if (currentGame?.id) {
        router.push(`/game/play/${currentGame.id}`)
      }
    }

    // Listener: Nueva pregunta
    const handleNewQuestion = (data) => {
      console.log('New question:', data)
      setCurrentQuestion(data.question, data.questionIndex)
      setTimeRemaining(data.question.timeLimit || 20)
    }

    // Listener: Resultado de respuesta
    const handleAnswerResult = (data) => {
      console.log('Answer result:', data)
      updateScores(data.scores)
      updateMyScore(data.playerScore || 0)
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
        setGame({
          ...data.game,
          currentUserId: user?.uid
        })
      }
      if (data.players) {
        setPlayers(data.players)
      }
    }

    // Registrar listeners
    const removePlayerJoined = on('playerJoined', handlePlayerJoined)
    const removePlayerLeft = on('playerLeft', handlePlayerLeft)
    const removeGameStarted = on('gameStarted', handleGameStarted)
    const removeNewQuestion = on('newQuestion', handleNewQuestion)
    const removeAnswerResult = on('answerResult', handleAnswerResult)
    const removeGameFinished = on('gameFinished', handleGameFinished)
    const removeGameError = on('gameError', handleGameError)
    const removeGameUpdate = on('gameUpdate', handleGameUpdate)

    // Cleanup
    return () => {
      removePlayerJoined()
      removePlayerLeft()
      removeGameStarted()
      removeNewQuestion()
      removeAnswerResult()
      removeGameFinished()
      removeGameError()
      removeGameUpdate()
    }
  }, [connected, currentGame?.id, user?.uid, router])

  // Crear juego
  const createGame = useCallback(async (gameData) => {
    if (!connected) {
      throw new Error('No hay conexión con el servidor')
    }

    setLoading(true)
    setError(null)

    try {
      const gameConfig = {
        name: gameData.gameName,
        category: gameData.category.id,
        difficulty: gameData.difficulty.id,
        questionCount: gameData.questionCount,
        isPublic: gameData.gameType === 'public',
        createdBy: user?.uid,
        creatorUsername: username
      }

      console.log('Creating game with config:', gameConfig)
      
      const game = await socketCreateGame(gameConfig)
      
      // Configurar el juego en el store
      setGame({
        ...game,
        currentUserId: user?.uid
      })

      console.log('Game created successfully:', game)
      
      // Redirigir al lobby
      router.push(`/game/lobby/${game.id}`)
      
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
      const game = await socketJoinGame(gameId)
      
      setGame({
        ...game,
        currentUserId: user?.uid
      })

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
          socketLeaveGame(gameId),
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
    loading,
    error,
    connected,

    // Acciones
    createGame,
    joinGame,
    leaveGame,
    startGame,
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
