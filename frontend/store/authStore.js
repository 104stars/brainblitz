import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { authAPI } from '../lib/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      rememberMe: false,

      // Acciones
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Registro con Firebase + Backend
      register: async (email, password, username) => {
        set({ loading: true, error: null })
        
        try {
          // 1. Crear usuario en Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          const firebaseUser = userCredential.user
          
          // 2. Obtener token de Firebase
          const token = await firebaseUser.getIdToken()
          
          // 3. Registrar en el backend
          const backendResponse = await authAPI.register({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: username
          })
          
          // 4. Actualizar estado
          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              username: username,
              ...backendResponse.user
            },
            token,
            isAuthenticated: true,
            loading: false
          })
          
          return { success: true, user: firebaseUser }
        } catch (error) {
          console.error('Registration error:', error)
          set({ 
            error: error.message || 'Error al registrar usuario',
            loading: false 
          })
          return { success: false, error: error.message }
        }
      },

      // Login con Firebase
      login: async (email, password, rememberMe = false) => {
        set({ loading: true, error: null })
        
        try {
          // Configurar persistencia de Firebase Auth según rememberMe
          if (typeof window !== 'undefined') {
            const { setPersistence, browserLocalPersistence, browserSessionPersistence } = await import('firebase/auth')
            const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
            await setPersistence(auth, persistenceType)
          }
          
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const firebaseUser = userCredential.user
          const token = await firebaseUser.getIdToken()
          
          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName
            },
            token,
            isAuthenticated: true,
            loading: false,
            rememberMe // Guardar la preferencia de recordar
          })
          
          return { success: true, user: firebaseUser }
        } catch (error) {
          console.error('Login error:', error)
          set({ 
            error: error.message || 'Error al iniciar sesión',
            loading: false 
          })
          return { success: false, error: error.message }
        }
      },

      // Logout
      logout: async () => {
        set({ loading: true })
        
        try {
          await signOut(auth)
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            rememberMe: false
          })
          return { success: true }
        } catch (error) {
          console.error('Logout error:', error)
          set({ 
            error: error.message,
            loading: false 
          })
          return { success: false, error: error.message }
        }
      },

      // Recuperar contraseña
      recoverPassword: async (email) => {
        set({ loading: true, error: null })
        
        try {
          // Firebase reset
          await sendPasswordResetEmail(auth, email)
          
          // Notificar al backend (opcional)
          try {
            await authAPI.recoverPassword(email)
          } catch (backendError) {
            console.warn('Backend password recovery failed:', backendError)
            // No fallar si el backend falla, Firebase ya envió el email
          }
          
          set({ loading: false })
          return { success: true }
        } catch (error) {
          console.error('Password recovery error:', error)
          set({ 
            error: error.message || 'Error al recuperar contraseña',
            loading: false 
          })
          return { success: false, error: error.message }
        }
      },

      // Inicializar listener de auth state
      initializeAuth: () => {
        return onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const token = await firebaseUser.getIdToken()
              const currentState = get()
              
              set({
                user: {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName
                },
                token,
                isAuthenticated: true,
                loading: false,
                // Mantener el estado de rememberMe si ya existe
                rememberMe: currentState.rememberMe || false
              })
            } catch (error) {
              console.error('Auth state change error:', error)
              set({ loading: false })
            }
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
              rememberMe: false
            })
          }
        })
      }
    }),
    {
      name: 'brainblitz-auth', // Nombre para localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe
      }), // Solo persistir datos necesarios
      storage: {
        getItem: (name) => {
          // Primero intentar obtener de localStorage (sesiones persistentes)
          let storedState = localStorage.getItem(name)
          if (storedState) {
            try {
              const parsedState = JSON.parse(storedState)
              // Verificar que tenga rememberMe activo
              if (parsedState?.state?.rememberMe) {
                return storedState
              } else {
                // Si no tiene rememberMe, limpiar localStorage
                localStorage.removeItem(name)
              }
            } catch (e) {
              localStorage.removeItem(name)
            }
          }
          
          // Luego intentar obtener de sessionStorage (sesiones temporales)
          storedState = sessionStorage.getItem(name)
          if (storedState) {
            try {
              const parsedState = JSON.parse(storedState)
              return storedState
            } catch (e) {
              sessionStorage.removeItem(name)
            }
          }
          
          return null
        },
        setItem: (name, value) => {
          try {
            // Asegurar que siempre trabajamos con una cadena JSON válida
            const valueString = typeof value === 'string' ? value : JSON.stringify(value)
            const parsedValue = typeof value === 'string' ? JSON.parse(value) : value
            
            // Limpiar ambos storages primero
            localStorage.removeItem(name)
            sessionStorage.removeItem(name)
            
            // Guardar en el storage apropiado según rememberMe
            if (parsedValue?.state?.rememberMe) {
              localStorage.setItem(name, valueString)
            } else {
              sessionStorage.setItem(name, valueString)
            }
          } catch (e) {
            console.error('Error saving auth state:', e)
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
          sessionStorage.removeItem(name)
        }
      }
    }
  )
)
