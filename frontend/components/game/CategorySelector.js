'use client'

import { useState, useEffect } from 'react'
import { TagIcon, SparkleIcon } from '@phosphor-icons/react/ssr'
import { aiAPI } from '../../lib/api'

export default function CategorySelector({ selectedCategory, onCategoryChange, disabled = false }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Categorías por defecto basadas en el plan (15+ categorías)
  const defaultCategories = [
    { id: 'general', name: 'General', description: 'Conocimiento general variado', icon: '🧠' },
    { id: 'ciencia', name: 'Ciencia', description: 'Física, química, biología', icon: '🔬' },
    { id: 'historia', name: 'Historia', description: 'Historia mundial y local', icon: '📚' },
    { id: 'geografia', name: 'Geografía', description: 'Países, capitales, continentes', icon: '🌍' },
    { id: 'tecnologia', name: 'Tecnología', description: 'Informática y tecnología', icon: '💻' },
    { id: 'deportes', name: 'Deportes', description: 'Deportes y olimpiadas', icon: '⚽' },
    { id: 'arte', name: 'Arte', description: 'Pintura, escultura, arte', icon: '🎨' },
    { id: 'literatura', name: 'Literatura', description: 'Libros y autores', icon: '📖' },
    { id: 'matematicas', name: 'Matemáticas', description: 'Números y cálculos', icon: '🔢' },
    { id: 'biologia', name: 'Biología', description: 'Seres vivos y naturaleza', icon: '🌿' },
    { id: 'quimica', name: 'Química', description: 'Elementos y reacciones', icon: '⚗️' },
    { id: 'fisica', name: 'Física', description: 'Fuerzas y movimiento', icon: '⚛️' },
    { id: 'astronomia', name: 'Astronomía', description: 'Espacio y planetas', icon: '🚀' },
    { id: 'musica', name: 'Música', description: 'Artistas y géneros', icon: '🎵' },
    { id: 'cine', name: 'Cine', description: 'Películas y actores', icon: '🎬' },
    { id: 'videojuegos', name: 'Videojuegos', description: 'Gaming y esports', icon: '🎮' }
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Intentar obtener categorías del backend
        const topics = await aiAPI.getTopics()
        
        if (topics && topics.length > 0) {
          // Mapear topics del backend a formato de categorías
          const backendCategories = topics.map((topic, index) => ({
            id: topic.toLowerCase().replace(/\s+/g, '-'),
            name: topic,
            description: `Preguntas sobre ${topic.toLowerCase()}`,
            icon: defaultCategories[index % defaultCategories.length]?.icon || '📝'
          }))
          setCategories(backendCategories)
        } else {
          throw new Error('No topics received')
        }
      } catch (err) {
        console.warn('Failed to fetch categories from backend:', err)
        setError('Usando categorías por defecto')
        setCategories(defaultCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TagIcon size={20} className="text-brand" />
          <h3 className="text-lg font-semibold text-gray-900">Categoría</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl p-4 h-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TagIcon size={20} className="text-brand" />
          <h3 className="text-lg font-semibold text-gray-900">Categoría</h3>
          <span className="text-sm text-gray-500">({categories.length} disponibles)</span>
        </div>
        {error && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <SparkleIcon size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category)}
            disabled={disabled}
            className={`
              p-4 rounded-xl border-2 transition-all duration-200 text-left
              ${selectedCategory?.id === category.id
                ? 'border-brand bg-brand-50 ring-2 ring-brand ring-opacity-20'
                : 'border-gray-200 hover:border-brand hover:bg-brand-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{category.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {category.name}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="mt-4 p-4 bg-brand-50 border border-brand-200 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedCategory.icon}</span>
            <div>
              <h4 className="font-semibold text-brand">
                {selectedCategory.name}
              </h4>
              <p className="text-sm text-brand-700">
                {selectedCategory.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
