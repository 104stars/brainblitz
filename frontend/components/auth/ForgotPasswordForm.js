'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import FormInput from './FormInput'
import LoadingButton from './LoadingButton'
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@phosphor-icons/react/ssr'

export default function ForgotPasswordForm() {
  const { recoverPassword, loading, error, clearError } = useAuth()
  
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Validación del email
  const validateEmail = () => {
    if (!email.trim()) {
      return 'El email es requerido'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Ingresa un email válido'
    }
    return ''
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    
    // Limpiar errores cuando el usuario escriba
    if (emailError) {
      setEmailError('')
    }
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar email
    const emailValidationError = validateEmail()
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }
    
    // Limpiar errores
    setEmailError('')
    clearError()
    
    // Enviar email de recuperación
    const result = await recoverPassword(email)
    
    if (result.success) {
      setShowSuccess(true)
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <CheckCircleIcon size={24} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Email enviado!</h2>
        <p className="text-gray-600 mb-6">
          Hemos enviado un enlace de recuperación a <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/login"
            className="block w-full bg-gradient-to-r from-brand to-brand-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-brand-600 hover:to-brand-700 transition-all duration-200"
          >
            Volver al login
          </Link>
          
          <button
            onClick={() => {
              setShowSuccess(false)
              setEmail('')
            }}
            className="block w-full text-brand hover:text-brand-600 font-medium transition-colors"
          >
            Enviar a otro email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Volver al login
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
        <p className="text-gray-600">
          No te preocupes, te ayudamos a recuperar el acceso a tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email de tu cuenta"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
          required
          disabled={loading}
          autoComplete="email"
        />

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p>
            Te enviaremos un enlace seguro para restablecer tu contraseña. 
            El enlace expirará en 1 hora por seguridad.
          </p>
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
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </LoadingButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Recordaste tu contraseña?{' '}
          <Link 
            href="/login" 
            className="font-medium text-brand hover:text-brand-600 transition-colors"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
