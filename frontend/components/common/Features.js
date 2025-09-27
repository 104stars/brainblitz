import { 
  LightningIcon, 
  UsersIcon, 
  TrophyIcon, 
  BrainIcon, 
  TimerIcon, 
  ChatCircleIcon,
  ShieldCheckIcon,
  SparkleIcon
} from '@phosphor-icons/react/ssr'

const features = [
  {
    name: 'Partidas en Tiempo Real',
    description: 'Compite con otros jugadores en partidas dinámicas donde cada segundo cuenta. Respuestas instantáneas y resultados inmediatos.',
    icon: LightningIcon,
    color: 'blue'
  },
  {
    name: 'Modo Multijugador',
    description: 'Únete a partidas públicas o crea salas privadas para jugar con tus amigos. Hasta 10 jugadores por partida.',
    icon: UsersIcon,
    color: 'purple'
  },
  {
    name: 'Sistema de Puntuación',
    description: 'Gana puntos por respuestas correctas y velocidad. Sube en el ranking global y demuestra tu conocimiento.',
    icon: TrophyIcon,
    color: 'yellow'
  },
  {
    name: 'Preguntas Inteligentes',
    description: 'Más de 15 categorías diferentes con preguntas generadas por IA y creadas por administradores expertos.',
    icon: BrainIcon,
    color: 'green'
  },
  {
    name: 'Temporizador Dinámico',
    description: 'Cada pregunta tiene un límite de tiempo que mantiene la emoción y la competitividad alta.',
    icon: TimerIcon,
    color: 'red'
  },
  {
    name: 'Interacción Social',
    description: 'Sistema de invitaciones, códigos de partida y comunicación en tiempo real con otros jugadores.',
    icon: ChatCircleIcon,
    color: 'indigo'
  },
  {
    name: 'Seguro y Confiable',
    description: 'Autenticación segura con Firebase y protección de datos. Tu progreso siempre estará guardado.',
    icon: ShieldCheckIcon,
    color: 'teal'
  },
  {
    name: 'Experiencia Premium',
    description: 'Interfaz moderna y responsiva diseñada para todos los dispositivos. Animaciones suaves y feedback visual.',
    icon: SparkleIcon,
    color: 'pink'
  }
]

const colorClasses = {
  blue: 'bg-brand-100 text-brand',
  purple: 'bg-brand-100 text-brand-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  indigo: 'bg-brand-100 text-brand-700',
  teal: 'bg-teal-100 text-teal-600',
  pink: 'bg-pink-100 text-pink-600'
}

export default function Features() {
  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand">Todo lo que necesitas</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Una experiencia de juego completa
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            BrainBlitz combina la emoción de la competencia con el aprendizaje divertido. 
            Anímate a competir en nuestra plataforma.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[feature.color]}`}>
                    <feature.icon size={20} weight="bold" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Stats section */}
        <div className="mt-16 sm:mt-20">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-8">
                Únete a la comunidad de BrainBlitz
              </h3>
            </div>
            <dl className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-gray-50 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Categorías</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">15+</dd>
              </div>
              <div className="flex flex-col bg-gray-50 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Preguntas</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">1000+</dd>
              </div>
              <div className="flex flex-col bg-gray-50 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Jugadores por partida</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">Hasta 10</dd>
              </div>
              <div className="flex flex-col bg-gray-50 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Niveles de dificultad</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">3</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
