'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import FormInput from './FormInput'
import LoadingButton from './LoadingButton'
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react/ssr'

export default function LoginForm() {
  const router = useRouter()
  const { login, loading, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Validaciones del formulario
  const validateForm = () => {
    const errors = {}
    
    // Email
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un email válido'
    }
    
    // Password
    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    }
    
    return errors
  }

  const handleInputChange = (field) => (e) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
    
    // Limpiar error global
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar formulario
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    // Limpiar errores
    setFormErrors({})
    clearError()
    
    // Iniciar sesión
    const result = await login(formData.email, formData.password, formData.rememberMe)
    
    if (result.success) {
      setShowSuccess(true)
      
      // Redirigir al dashboard después de 1.5 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <CheckCircleIcon size={24} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido de vuelta!</h2>
        <p className="text-gray-600 mb-4">
          Inicio de sesión exitoso
        </p>
        <p className="text-sm text-gray-500">Redirigiendo al dashboard...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
        <p className="text-gray-600">
          Accede a tu cuenta de BrainBlitz
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={formErrors.email}
          required
          disabled={loading}
          autoComplete="email"
        />

        <FormInput
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={formErrors.password}
          required
          disabled={loading}
          autoComplete="current-password"
        />

        {/* Recordarme y Olvidé contraseña */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange('rememberMe')}
              disabled={loading}
              className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <Link 
              href="/forgot-password" 
              className="font-medium text-brand hover:text-brand-600 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <XCircleIcon size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <LoadingButton
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </LoadingButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link 
            href="/register" 
            className="font-medium text-brand hover:text-brand-600 transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Separador */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>
      </div>

      {/* Demo credentials info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 text-center">
          <strong>Modo desarrollo:</strong> Los usuarios se crean en Firebase pero pueden no sincronizar con el backend hasta obtener las credenciales de producción.
        </p>
      </div>
    </div>
  )
}
