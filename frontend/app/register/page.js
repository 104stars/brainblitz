import RegisterForm from '../../components/auth/RegisterForm'
import Link from 'next/link'
import { LightningIcon } from '@phosphor-icons/react/ssr'

export const metadata = {
  title: 'Registro - BrainBlitz',
  description: 'Crea tu cuenta en BrainBlitz y únete a la comunidad de jugadores más emocionante.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center space-x-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand to-brand-600 rounded-xl">
            <LightningIcon size={24} weight="bold" className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-brand via-brand-600 to-brand-700 bg-clip-text text-transparent">
            BrainBlitz
          </span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          <RegisterForm />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Al registrarte, aceptas nuestros{' '}
          <Link href="#" className="text-brand hover:text-brand-600 transition-colors">
            Términos de Uso
          </Link>
          {' '}y{' '}
          <Link href="#" className="text-brand hover:text-brand-600 transition-colors">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}
