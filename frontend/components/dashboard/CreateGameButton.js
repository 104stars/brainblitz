'use client'

import { PlusIcon, SparkleIcon } from '@phosphor-icons/react/ssr'
import { useRouter } from 'next/navigation'

export default function CreateGameButton() {
  const router = useRouter()

  const handleCreateGame = () => {
    router.push('/game/create')
  }

  return (
    <div className="bg-gradient-to-br from-brand to-brand-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white opacity-5 rounded-full"></div>
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <SparkleIcon size={24} weight="bold" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Crear Nueva Partida</h3>
            <p className="text-blue-100 text-sm">Reta a otros jugadores</p>
          </div>
        </div>

        <p className="text-blue-100 mb-6 leading-relaxed">
          Configura tu propia partida con preguntas personalizadas o generadas por IA. 
          Invita amigos o hazla pública para que cualquiera pueda unirse.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCreateGame}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-brand px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:shadow-lg"
          >
            <PlusIcon size={20} weight="bold" />
            Crear Partida
          </button>
          
          <button
            onClick={() => alert('Función de partida rápida será implementada próximamente')}
            className="flex-1 sm:flex-none border-2 border-white border-opacity-30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          >
            Partida Rápida
          </button>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
            <span>15+ Categorías</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
            <span>Preguntas con IA</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
            <span>Hasta 10 jugadores</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
            <span>Tiempo real</span>
          </div>
        </div>
      </div>
    </div>
  )
}
