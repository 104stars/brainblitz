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
      login: async (email, password) => {
        set({ loading: true, error: null })
        
        try {
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
            loading: false
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
            error: null
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
              set({
                user: {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName
                },
                token,
                isAuthenticated: true,
                loading: false
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
              loading: false
            })
          }
        })
      }
    }),
    {
      name: 'brainblitz-auth', // Nombre para localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }) // Solo persistir datos necesarios
    }
  )
)
