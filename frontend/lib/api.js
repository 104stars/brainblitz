import axios from 'axios'
import { auth } from './firebase'

// URL del backend según backend-summary.md
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-v1-2nej.onrender.com'

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
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Funciones de API según backend-summary.md

// === USUARIOS ===
export const authAPI = {
  // POST /api/users/register
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData)
    return response.data
  },
  
  // POST /api/users/recover-password
  recoverPassword: async (email) => {
    const response = await api.post('/api/users/recover-password', { email })
    return response.data
  },
  
  // GET /api/users/me/stats
  getUserStats: async () => {
    const response = await api.get('/api/users/me/stats')
    return response.data
  }
}

// === PARTIDAS ===
export const gamesAPI = {
  // GET /api/games - Listar partidas públicas
  getPublicGames: async () => {
    const response = await api.get('/api/games')
    return response.data
  }
}

// === PREGUNTAS ===
export const questionsAPI = {
  // GET /api/questions
  getAllQuestions: async () => {
    const response = await api.get('/api/questions')
    return response.data
  },
  
  // POST /api/questions
  createQuestion: async (questionData) => {
    const response = await api.post('/api/questions', questionData)
    return response.data
  },
  
  // POST /api/questions/bulk
  createBulkQuestions: async (questionsArray) => {
    const response = await api.post('/api/questions/bulk', { questions: questionsArray })
    return response.data
  },
  
  // PUT /api/questions/{id}
  updateQuestion: async (id, questionData) => {
    const response = await api.put(`/api/questions/${id}`, questionData)
    return response.data
  },
  
  // DELETE /api/questions/{id}
  deleteQuestion: async (id) => {
    const response = await api.delete(`/api/questions/${id}`)
    return response.data
  }
}

// === IA ===
export const aiAPI = {
  // POST /api/ai/generate-questions
  generateQuestions: async (params) => {
    const response = await api.post('/api/ai/generate-questions', params)
    return response.data
  },
  
  // GET /api/ai/topics
  getTopics: async () => {
    const response = await api.get('/api/ai/topics')
    return response.data
  },
  
  // GET /api/ai/difficulty-levels
  getDifficultyLevels: async () => {
    const response = await api.get('/api/ai/difficulty-levels')
    return response.data
  }
}

export default api
