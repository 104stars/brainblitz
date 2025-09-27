import { LightningIcon, HeartIcon, CodeIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'

const navigation = {
  juego: [
    { name: 'Cómo Jugar', href: '#' },
    { name: 'Categorías', href: '#' },
    { name: 'Ranking', href: '#' },
    { name: 'Estadísticas', href: '#' },
  ],
  cuenta: [
    { name: 'Crear Cuenta', href: '/register' },
    { name: 'Iniciar Sesión', href: '/login' },
    { name: 'Recuperar Contraseña', href: '/forgot-password' },
    { name: 'Mi Perfil', href: '/profile' },
  ],
  soporte: [
    { name: 'Centro de Ayuda', href: '#' },
    { name: 'Contacto', href: '#' },
    { name: 'Reportar Problema', href: '#' },
    { name: 'Sugerencias', href: '#' },
  ],
  legal: [
    { name: 'Términos de Uso', href: '#' },
    { name: 'Política de Privacidad', href: '#' },
    { name: 'Cookies', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand to-brand-600 rounded-lg">
                <LightningIcon size={24} weight="bold" className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">BrainBlitz</span>
            </div>
            
            <p className="text-sm leading-6 text-gray-300">
              El juego de preguntas multijugador más emocionante. Pon a prueba tus conocimientos 
              y compite con jugadores de todo el mundo en tiempo real.
            </p>
            
            {/* Stats */}
            <div className="flex space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Servidor activo</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Juego</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.juego.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Cuenta</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.cuenta.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Soporte</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.soporte.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2025 BrainBlitz. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>Hecho con</span>
              <HeartIcon size={12} weight="fill" className="text-red-400" />
              <span>y</span>
              <CodeIcon size={12} weight="bold" className="text-brand" />
              <span>para la comunidad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
