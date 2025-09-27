import { ArrowRightIcon, PlayIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'

export default function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-brand via-brand-600 to-brand-700">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¿Listo para el desafío?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Únete a miles de jugadores que ya están poniendo a prueba sus conocimientos. 
            Crea tu cuenta gratis y comienza a competir ahora mismo.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="group flex items-center gap-x-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:bg-gray-50 hover:shadow-xl hover:scale-105 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PlayIcon size={20} weight="fill" />
              Crear Cuenta Gratis
              <ArrowRightIcon 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-200" 
              />
            </Link>
            
            <Link
              href="/login"
              className="group flex items-center gap-x-2 rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-gray-900 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ya tengo cuenta
              <ArrowRightIcon 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-200" 
              />
            </Link>
          </div>

          {/* Additional info */}
          <div className="mt-12 flex items-center justify-center gap-x-6 text-sm text-blue-100">
            <div className="flex items-center gap-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sin descargas</span>
            </div>
            <div className="w-px h-4 bg-blue-200"></div>
            <span>100% Gratis</span>
            <div className="w-px h-4 bg-blue-200"></div>
            <span>Registro rápido</span>
          </div>
        </div>
      </div>
    </div>
  )
}
