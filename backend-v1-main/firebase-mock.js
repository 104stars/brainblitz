// Versión mock de Firebase para desarrollo sin credenciales
console.log('🚧 Using Firebase Mock for development')

// Mock de Firebase Admin
const mockAdmin = {
  auth: () => ({
    verifyIdToken: async (token) => {
      console.log('Mock: Verifying token:', token?.substring(0, 20) + '...')
      // Simular verificación exitosa
      return {
        uid: 'mock-user-id',
        email: 'mock@example.com',
        name: 'Mock User'
      }
    }
  }),
  firestore: () => ({
    collection: (name) => ({
      doc: (id) => ({
        set: async (data) => {
          console.log(`Mock: Setting document ${name}/${id}:`, data)
          return { id }
        },
        get: async () => ({
          exists: true,
          id: 'mock-doc-id',
          data: () => ({ 
            id: 'mock-doc-id',
            createdAt: new Date(),
            ...mockData[name] 
          })
        }),
        update: async (data) => {
          console.log(`Mock: Updating document ${name}/${id}:`, data)
          return { id }
        },
        delete: async () => {
          console.log(`Mock: Deleting document ${name}/${id}`)
          return true
        }
      }),
      add: async (data) => {
        console.log(`Mock: Adding to collection ${name}:`, data)
        return { id: 'mock-new-id-' + Date.now() }
      },
      where: () => ({
        get: async () => ({
          docs: [],
          empty: true
        })
      }),
      get: async () => ({
        docs: [],
        empty: true
      })
    })
  })
}

// Datos mock para diferentes colecciones
const mockData = {
  users: {
    email: 'mock@example.com',
    username: 'MockUser',
    stats: {
      gamesPlayed: 5,
      gamesWon: 2,
      totalScore: 150
    }
  },
  games: {
    name: 'Mock Game',
    host: 'mock-user-id',
    players: ['mock-user-id'],
    status: 'lobby',
    code: 'ABC123'
  }
}

const db = mockAdmin.firestore()
const auth = mockAdmin.auth()

module.exports = { 
  admin: mockAdmin, 
  db, 
  auth 
}
