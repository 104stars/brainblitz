'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import FormInput from './FormInput'
import LoadingButton from './LoadingButton'
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react/ssr'

export default function RegisterForm() {
  const router = useRouter()
  const { register, loading, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Validaciones del formulario
  const validateForm = () => {
    const errors = {}
    
    // Username
    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido'
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    } else if (formData.username.length > 20) {
      errors.username = 'El nombre de usuario no puede tener más de 20 caracteres'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'El nombre de usuario solo puede contener letras, números y guiones bajos'
    }
    
    // Email
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un email válido'
    }
    
    // Password
    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    // Confirm Password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    return errors
  }

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
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
    
    // Registrar usuario
    const result = await register(
      formData.email,
      formData.password,
      formData.username
    )
    
    if (result.success) {
      setShowSuccess(true)
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <CheckCircleIcon size={24} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro exitoso!</h2>
        <p className="text-gray-600 mb-4">
          Bienvenido a BrainBlitz, <span className="font-semibold">{formData.username}</span>
        </p>
        <p className="text-sm text-gray-500">Redirigiendo al dashboard...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
        <p className="text-gray-600">
          Únete a la comunidad de BrainBlitz y pon a prueba tus conocimientos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Nombre de usuario"
          type="text"
          placeholder="Ej: jugador123"
          value={formData.username}
          onChange={handleInputChange('username')}
          error={formErrors.username}
          required
          disabled={loading}
        />

        <FormInput
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={formErrors.email}
          required
          disabled={loading}
        />

        <FormInput
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={formErrors.password}
          required
          disabled={loading}
        />

        <FormInput
          label="Confirmar contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={formErrors.confirmPassword}
          required
          disabled={loading}
        />

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
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </LoadingButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            href="/login" 
            className="font-medium text-brand hover:text-brand-600 transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
