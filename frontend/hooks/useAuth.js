import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
    register,
    login,
    logout,
    recoverPassword,
    initializeAuth
  } = useAuthStore()

  // Inicializar listener de Firebase Auth al montar el hook
  useEffect(() => {
    const unsubscribe = initializeAuth()
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [initializeAuth])

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Acciones
    register,
    login,
    logout,
    recoverPassword,
    clearError,
    
    // Utilidades
    isLoggedIn: isAuthenticated && !!user,
    userId: user?.uid,
    userEmail: user?.email,
    username: user?.username || user?.displayName
  }
}
