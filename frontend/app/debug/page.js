'use client'

import SocketDebug from '../../components/debug/SocketDebug'
import { useAuth } from '../../hooks/useAuth'

export default function DebugPage() {
  const { isAuthenticated, loading, user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Banner de estado de autenticación */}
      <div className="max-w-4xl mx-auto mb-6 px-6">
        <div className={`p-4 rounded-lg border ${
          loading 
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : isAuthenticated 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                <span>🔄 Verificando autenticación...</span>
              </>
            ) : isAuthenticated ? (
              <>
                <span>✅ Autenticado como: <strong>{user?.email}</strong></span>
              </>
            ) : (
              <>
                <span>⚠️ No autenticado - Los WebSockets pueden no funcionar correctamente</span>
                <a 
                  href="/login" 
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Iniciar Sesión
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <SocketDebug />
    </div>
  )
}
