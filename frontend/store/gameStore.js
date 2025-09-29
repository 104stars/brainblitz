import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useGameStore = create(
  persist(
    (set, get) => ({
      // Estado del juego actual
      currentGame: null,
      players: [],
      gameState: 'idle', // idle, lobby, playing, finished
      isHost: false,
      
      // Estado de la pregunta actual
      currentQuestion: null,
      currentQuestionIndex: 0,
      totalQuestions: 0,
      timeRemaining: 0,
      answerLocked: false,
      selectedAnswer: null,
      answerResult: null,
      
      // Puntuaciones y resultados
      scores: {},
      myScore: 0,
      finalResults: null,
      
      // Estado de la UI
      loading: false,
      error: null,

      // Acciones para gestionar el juego
      setGame: (game) => {
        const hostField = game?.hostId || game?.host || game?.hostUid
        set({
          currentGame: game,
          gameState: game ? 'lobby' : 'idle',
          isHost: game ? hostField === game.currentUserId : false,
          totalQuestions: game?.questionCount || 0,
          error: null
        })
      },

      setPlayers: (players) => {
        set({ players })
      },

      addPlayer: (player) => {
        const { players } = get()
        if (!players.find(p => p.id === player.id)) {
          set({ players: [...players, player] })
        }
      },

      removePlayer: (playerId) => {
        const { players } = get()
        set({ players: players.filter(p => p.id !== playerId) })
      },

      setGameState: (state) => {
        set({ gameState: state })
      },

      // Acciones para preguntas
      setCurrentQuestion: (question, index) => {
        set({
          currentQuestion: question,
          currentQuestionIndex: index,
          timeRemaining: question?.timeLimit || 20,
          answerLocked: false,
          selectedAnswer: null
        })
      },

      setTimeRemaining: (time) => {
        set({ timeRemaining: time })
      },

      setTotalQuestions: (count) => {
        set({ totalQuestions: typeof count === 'number' ? count : 0 })
      },

      lockAnswer: (answerValue) => {
        set({ answerLocked: true, selectedAnswer: answerValue })
      },

      unlockAnswer: () => {
        set({ answerLocked: false })
      },

      // Acciones para puntuaciones
      updateScores: (newScores) => {
        set({ scores: newScores })
      },

      updateMyScore: (score) => {
        set({ myScore: score })
      },

      setFinalResults: (results) => {
        set({ 
          finalResults: results,
          gameState: 'finished'
        })
      },

      setAnswerResult: (result) => {
        set({ answerResult: result })
      },

      // Acciones para UI
      setLoading: (loading) => {
        set({ loading })
      },

      setError: (error) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      // Limpiar el estado del juego
      resetGame: () => {
        set({
          currentGame: null,
          players: [],
          gameState: 'idle',
          isHost: false,
          currentQuestion: null,
          currentQuestionIndex: 0,
          totalQuestions: 0,
          timeRemaining: 0,
          answerLocked: false,
          selectedAnswer: null,
          answerResult: null,
          scores: {},
          myScore: 0,
          finalResults: null,
          loading: false,
          error: null
        })
      },

      // Utilidades
      getPlayerById: (playerId) => {
        const { players } = get()
        return players.find(p => p.id === playerId)
      },

      getPlayerCount: () => {
        const { players } = get()
        return players.length
      },

      getProgress: () => {
        const { currentQuestionIndex, totalQuestions } = get()
        if (totalQuestions === 0) return 0
        return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
      },

      isGameActive: () => {
        const { gameState } = get()
        return ['lobby', 'playing'].includes(gameState)
      },

      canStartGame: () => {
        const { isHost, players, gameState } = get()
        return isHost && players.length >= 1 && gameState === 'lobby'
      }
    }),
    {
      name: 'brainblitz-game-storage',
      storage: createJSONStorage(() => sessionStorage), // Usar sessionStorage para que se limpie al cerrar la pestaña
      partialize: (state) => ({
        // Solo persistir datos esenciales
        currentGame: state.currentGame,
        gameState: state.gameState,
        isHost: state.isHost
      })
    }
  )
)

export default useGameStore
