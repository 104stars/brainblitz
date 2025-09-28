import axios from 'axios'
import { auth } from './firebase'

// URL del backend según backend-summary.md
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-v1-2nej.onrender.com/api'

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser
      if (user) {
        const token = await user.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error getting auth token:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url || ''
    if (url.includes('/games') && status === 400) {
      console.warn('API /games 400 - usando datos de demostración en frontend')
    } else if (status && status < 500) {
      console.warn('API Warning:', error.response?.data || error.message)
    } else {
      console.error('API Error:', error.response?.data || error.message)
    }
    return Promise.reject(error)
  }
)

// Funciones de API según backend-summary.md

// === USUARIOS ===
export const authAPI = {
  // POST /api/users/register
  register: async (userData) => {
    const response = await api.post('/users/register', userData)
    return response.data
  },
  
  // POST /api/users/recover-password
  recoverPassword: async (email) => {
    const response = await api.post('/users/recover-password', { email })
    return response.data
  },
  
  // GET /api/users/me/stats
  getUserStats: async () => {
    const response = await api.get('/users/me/stats')
    return response.data
  }
}

// === PARTIDAS ===
export const gamesAPI = {
  // GET /api/games - Listar partidas públicas
  getPublicGames: async () => {
    const response = await api.get('/games')
    return response.data
  }
}

// === PREGUNTAS ===
export const questionsAPI = {
  // GET /api/questions
  getAllQuestions: async () => {
    const response = await api.get('/questions')
    return response.data
  },
  
  // POST /api/questions
  createQuestion: async (questionData) => {
    const response = await api.post('/questions', questionData)
    return response.data
  },
  
  // POST /api/questions/bulk
  createBulkQuestions: async (questionsArray) => {
    const response = await api.post('/questions/bulk', { questions: questionsArray })
    return response.data
  },
  
  // PUT /api/questions/{id}
  updateQuestion: async (id, questionData) => {
    const response = await api.put(`/questions/${id}`, questionData)
    return response.data
  },
  
  // DELETE /api/questions/{id}
  deleteQuestion: async (id) => {
    const response = await api.delete(`/questions/${id}`)
    return response.data
  }
}

// === IA ===
export const aiAPI = {
  // POST /api/ai/generate-questions
  generateQuestions: async (params) => {
    const response = await api.post('/ai/generate-questions', params)
    return response.data
  },
  
  // GET /api/ai/topics
  getTopics: async () => {
    const response = await api.get('/ai/topics')
    return response.data
  },
  
  // GET /api/ai/difficulty-levels
  getDifficultyLevels: async () => {
    const response = await api.get('/ai/difficulty-levels')
    return response.data
  }
}

export default api
