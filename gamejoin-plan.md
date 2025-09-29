# Plan: Funcionalidad de Unirse a Partidas

## 📋 Resumen

Implementar funcionalidad completa para unirse a partidas públicas y privadas en BrainBlitz, sin modificar el backend existente.

## 🎯 Objetivos

1. Unirse a partidas públicas desde la lista del dashboard
2. Unirse por código de 6 dígitos (partidas privadas)
3. Experiencia fluida desde dashboard hasta lobby

---

## 📝 Lista de Tareas

### 1. Arreglar Unirse a Partidas Públicas
- **Archivo:** `frontend/components/dashboard/PublicGamesList.js`
- **Tarea:** Implementar función `handleJoinGame` para usar `useGame.joinGame()`
- **Cambios:** Reemplazar alert con lógica real de unirse a partida

### 2. Crear Modal "Unirse por Código"
- **Archivo:** `frontend/components/dashboard/JoinGameModal.js` (nuevo)
- **Funcionalidades:**
  - Input para código de 6 dígitos
  - Validación en tiempo real
  - Formateo automático
  - Integración con `useGame.joinGame()`

### 3. Integrar Modal en Dashboard
- **Archivo:** `frontend/components/dashboard/DashboardContent.js`
- **Cambios:**
  - Importar `JoinGameModal`
  - Agregar estado para controlar modal
  - Agregar botón "Unirse por Código"
  - Reemplazar alert en "Acciones Rápidas"

### 4. Mejorar Compartir Código
- **Archivo:** `frontend/components/game/GameLobby.js`
- **Cambios:** Actualizar `handleShareGame` para copiar código de partida al portapapeles

### 5. Mejorar WebSocket Handling
- **Archivo:** `frontend/hooks/useGame.js`
- **Cambios:** Agregar listeners para eventos `playerJoined`, `playerLeft`, `gameStarted`

---

## 🧪 Testing

### Casos de Prueba:
1. **Partidas Públicas:** Crear partida pública y unirse desde otro usuario
2. **Código de 6 Dígitos:** Crear partida privada y unirse usando modal
3. **Compartir Código:** Copiar código desde lobby y usarlo en modal
4. **Casos de Error:** Código inexistente, partida ya iniciada, partida llena

---

## 📊 Resultado Final

Los usuarios podrán:
1. Ver partidas públicas en el dashboard y unirse con un clic
2. Unirse por código usando un modal intuitivo
3. Compartir código de partida para que otros se unan
4. Experimentar un flujo completo desde dashboard → lobby → juego

**Todo esto sin modificar una sola línea del backend existente.**