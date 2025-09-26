# Plan de Desarrollo Frontend - BrainBlitz

## Descripción del Proyecto

**BrainBlitz** es un MVP de un juego de preguntas multijugador en tiempo real donde los participantes compiten respondiendo preguntas. El sistema incluye gestión de preguntas por administradores, partidas públicas/privadas, sistema de puntuación y ranking. El frontend se construirá con Next.js, Tailwind CSS y ShadCN/UI para complementar el backend ya existente.

> **Nota Importante del MVP**: Este MVP puede incluir tanto preguntas gestionadas manualmente por administradores como generación opcional de preguntas con IA. El backend ya soporta ambas funcionalidades.

## Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v4
- **Componentes:** ShadCN/UI (configurado para JavaScript)
- **Estado Global:** Zustand + React Context
- **Autenticación:** Firebase Auth SDK
- **HTTP Client:** Axios
- **WebSockets:** Socket.io-client
- **Iconos:** Phosphor icons
## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                   # App Router (Next.js 13+)
│   │   ├── (auth)/           # Grupo de rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/        # Panel principal
│   │   ├── game/             # Rutas del juego
│   │   │   ├── create/
│   │   │   ├── lobby/[gameId]/
│   │   │   └── play/[gameId]/
│   │   ├── admin/            # Panel de administración
│   │   │   ├── questions/
│   │   │   └── categories/
│   │   ├── profile/          # Perfil de usuario
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/           # Componentes organizados
│   │   ├── ui/              # ShadCN components base
│   │   ├── auth/            # Componentes de autenticación
│   │   ├── game/            # Componentes específicos del juego
│   │   ├── dashboard/       # Componentes del dashboard
│   │   ├── admin/           # Componentes de administración
│   │   └── common/          # Componentes reutilizables
│   ├── lib/                 # Configuraciones y utilidades
│   │   ├── firebase.js
│   │   ├── api.js
│   │   ├── socket.js
│   │   └── utils.js
│   ├── hooks/               # Custom hooks
│   ├── store/               # Estado global
│   └── constants/           # Constantes de la aplicación
├── public/                  # Archivos estáticos
├── components.json          # Configuración ShadCN
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Pantallas y Funcionalidades Detalladas

### 1. **Pantalla de Bienvenida / Landing** (`/`)
**Funcionalidades:**
- Presentación del juego BrainBlitz
- Botones para Login/Registro
- Información sobre el juego (cómo funciona)
- Diseño atractivo y responsivo

**Componentes necesarios:**
- `Hero` - Sección principal
- `Features` - Características del juego
- `CallToAction` - Botones de acción
- `Footer` - Pie de página

### 2. **Pantalla de Registro** (`/register`)
**Funcionalidades:**
- Formulario de registro con validación
- Campos: email, contraseña, nombre de usuario
- Integración con Firebase Auth
- Manejo de errores y estados de carga
- Redirección automática tras registro exitoso

**Componentes necesarios:**
- `RegisterForm` - Formulario principal
- `FormInput` - Inputs con validación
- `LoadingButton` - Botón con estado de carga

**API Integration:**
- `POST /api/users/register`
- Firebase Auth `createUserWithEmailAndPassword`

### 3. **Pantalla de Login** (`/login`)
**Funcionalidades:**
- Formulario de login con validación
- Campos: email, contraseña
- Opción "Recordarme"
- Enlace a recuperación de contraseña
- Integración con Firebase Auth

**Componentes necesarios:**
- `LoginForm` - Formulario principal
- `ForgotPasswordLink` - Enlace de recuperación

**API Integration:**
- Firebase Auth `signInWithEmailAndPassword`

### 4. **Pantalla de Recuperación de Contraseña** (`/forgot-password`)
**Funcionalidades:**
- Formulario para solicitar recuperación
- Envío de email de recuperación
- Confirmación de envío
- Validación de email

**API Integration:**
- `POST /api/users/recover-password`

### 5. **Dashboard Principal** (`/dashboard`)
**Funcionalidades:**
- Bienvenida personalizada al usuario
- Estadísticas del usuario (partidas jugadas, ganadas, respuestas correctas)
- Lista de partidas públicas disponibles
- Botón para crear nueva partida
- Navegación a perfil de usuario

**Componentes necesarios:**
- `UserStats` - Estadísticas del usuario
- `PublicGamesList` - Lista de partidas públicas
- `CreateGameButton` - Botón para crear partida
- `GameCard` - Tarjeta de partida individual

**API Integration:**
- `GET /api/users/me/stats`
- `GET /api/games`

### 6. **Pantalla de Creación de Partida** (`/game/create`)
**Funcionalidades:**
- Formulario de configuración de partida
- Selección de categoría de preguntas (15+ categorías disponibles)
- Selección de dificultad (Fácil, Medio, Difícil)
- Cantidad de preguntas (1-50)
- Opción pública/privada
- **Dos modos de preguntas:**
  - Selección de preguntas del banco administrado
  - Generación de preguntas con IA (opcional)
- Vista previa de preguntas seleccionadas/generadas
- Creación de partida con WebSocket
- Sistema de invitaciones para partidas privadas

**Componentes necesarios:**
- `GameConfigForm` - Formulario de configuración
- `CategorySelector` - Selector de categorías
- `DifficultySelector` - Selector de dificultad
- `QuestionPreview` - Vista previa de preguntas
- `QuestionSelector` - Selector de preguntas del banco administrado
- `GenerateQuestionsButton` - Botón de generación IA (opcional)
- `InvitationManager` - Gestión de invitaciones

**API Integration:**
- `GET /api/questions` - Obtener preguntas del banco
- `GET /api/ai/topics` - Temas disponibles para IA
- `GET /api/ai/difficulty-levels` - Niveles de dificultad
- `POST /api/ai/generate-questions` - Generar preguntas con IA (opcional)
- WebSocket: `createGame`

### 7. **Pantalla de Lobby/Sala de Espera** (`/game/lobby/[gameId]`)
**Funcionalidades:**
- Mostrar código de partida (6 dígitos)
- Lista de jugadores conectados
- Sistema de invitaciones por enlace/código
- Compartir enlace de invitación
- Chat en tiempo real (opcional)
- Botón de iniciar partida (solo host)
- Botón de salir de partida
- Estados de conexión en tiempo real

**Componentes necesarios:**
- `GameLobby` - Componente principal
- `PlayersList` - Lista de jugadores
- `GameCode` - Código de partida
- `InviteLink` - Enlace de invitación
- `ShareInvitation` - Compartir invitación
- `StartGameButton` - Botón iniciar (solo host)
- `LeaveGameButton` - Botón salir

**WebSocket Events:**
- `joinGame` - Unirse a partida
- `playerJoined` - Nuevo jugador
- `startGame` - Iniciar partida

**API Integration:**
- `GET /api/games/:id/invite-link` - Obtener enlace de invitación
- `POST /api/games/join-by-code` - Unirse por código

### 8. **Pantalla de Juego en Tiempo Real** (`/game/play/[gameId]`)
**Funcionalidades:**
- Mostrar pregunta actual
- Opciones de respuesta interactivas
- Temporizador por pregunta
- Indicador de progreso (pregunta X de Y)
- Lista de jugadores y puntajes
- Animaciones de respuesta correcta/incorrecta
- Pantalla de resultados entre preguntas
- Pantalla de resultados finales

**Componentes necesarios:**
- `GameRoom` - Componente principal
- `QuestionCard` - Pregunta y opciones
- `Timer` - Temporizador
- `ScoreBoard` - Tabla de puntajes
- `ProgressBar` - Progreso de la partida
- `AnswerResult` - Resultado de respuesta
- `FinalResults` - Resultados finales

**WebSocket Events:**
- `gameStarted` - Partida iniciada (con cantidad de preguntas)
- `newQuestion` - Nueva pregunta (con pregunta e índice)
- `submitAnswer` - Enviar respuesta
- `answerResult` - Resultado de respuesta (con explicación y puntajes)
- `gameFinished` - Partida terminada (con resultados finales)
- `requestQuestion` - Solicitar pregunta específica

### 9. **Pantalla de Perfil de Usuario** (`/profile`)
**Funcionalidades:**
- Información del usuario
- Estadísticas detalladas
- Editar nombre de usuario (opcional)
- Cerrar sesión
- Configuraciones de cuenta

**Componentes necesarios:**
- `UserProfile` - Perfil principal
- `UserStats` - Estadísticas detalladas
- `AccountSettings` - Configuraciones
- `LogoutButton` - Cerrar sesión

**API Integration:**
- `GET /api/users/me/stats`

### 10. **Panel de Administración** (`/admin`)
**Funcionalidades:**
- Gestión de preguntas (CRUD)
- Crear nuevas preguntas con opciones múltiples
- Editar preguntas existentes
- Eliminar preguntas
- Organizar preguntas por categorías
- Vista previa de preguntas
- Creación masiva de preguntas
- Estadísticas de uso de preguntas

**Componentes necesarios:**
- `AdminPanel` - Panel principal de administración
- `QuestionManager` - Gestión de preguntas
- `QuestionForm` - Formulario crear/editar preguntas
- `QuestionsList` - Lista de preguntas existentes
- `CategoryManager` - Gestión de categorías
- `QuestionPreview` - Vista previa de preguntas
- `BulkCreateForm` - Formulario de creación masiva

**API Integration:**
- `GET /api/questions` - Obtener todas las preguntas
- `POST /api/questions` - Crear una pregunta
- `POST /api/questions/bulk` - Crear varias preguntas
- `PUT /api/questions/:id` - Actualizar pregunta
- `DELETE /api/questions/:id` - Eliminar pregunta

### 11. **Pantalla de Error 404** (`/not-found`)
**Funcionalidades:**
- Página de error personalizada
- Navegación de vuelta al dashboard
- Diseño consistente con la aplicación

### 12. **Componentes de Layout Global**
**Funcionalidades:**
- Header con navegación
- Footer informativo
- Sidebar (en desktop)
- Navegación responsive
- Indicadores de estado de conexión

## Funcionalidades Transversales

### 1. **Sistema de Autenticación**
- AuthGuard para rutas protegidas
- Persistencia de sesión
- Redirecciones automáticas
- Estados de carga globales

### 2. **Manejo de Estado Global**
- Estado de autenticación (Zustand)
- Estado de juego actual
- Configuración de usuario
- Cache de datos de API

### 3. **Sistema de Notificaciones**
- Toast notifications para acciones
- Alertas de error y éxito
- Notificaciones de WebSocket

### 4. **Responsive Design**
- Diseño móvil-first
- Adaptación a tablets y desktop
- Navegación touch-friendly
- Optimización para diferentes tamaños

### 5. **Optimizaciones de Performance**
- Lazy loading de componentes
- Memoización de componentes pesados
- Optimización de re-renders
- Cache de imágenes y assets

## Hooks Personalizados Necesarios

### 1. **useAuth**
```javascript
// Manejo completo de autenticación
const { user, login, logout, register, loading, error } = useAuth()
```

### 2. **useSocket**
```javascript
// Manejo de conexiones WebSocket
const { socket, connected, emit, on, off } = useSocket()
```

### 3. **useGame**
```javascript
// Estado del juego actual
const { game, players, currentQuestion, score, joinGame, leaveGame } = useGame()
```

### 4. **useAPI**
```javascript
// Wrapper para llamadas API con cache
const { data, loading, error, refetch } = useAPI('/api/endpoint')
```

## Stores de Estado Global (Zustand)

### 1. **AuthStore**
```javascript
// Estado de autenticación
{
  user: null,
  token: null,
  isAuthenticated: false,
  login: (credentials) => {},
  logout: () => {},
  register: (userData) => {}
}
```

### 2. **GameStore**
```javascript
// Estado del juego
{
  currentGame: null,
  players: [],
  gameState: 'idle', // idle, lobby, playing, finished
  score: 0,
  currentQuestion: null,
  setGame: (game) => {},
  updatePlayers: (players) => {}
}
```

### 3. **UIStore**
```javascript
// Estado de la UI
{
  sidebarOpen: false,
  notifications: [],
  theme: 'light',
  toggleSidebar: () => {},
  addNotification: (notification) => {}
}
```

## Lista de Tareas a Implementar

### **Setup Inicial del Proyecto**
- Configurar Next.js 14+ con App Router
- Instalar y configurar Tailwind CSS v4
- Configurar ShadCN/UI para JavaScript
- Configurar Firebase Auth SDK
- Instalar dependencias: axios, socket.io-client, zustand, phosphor icons
- Crear estructura de carpetas del proyecto

### **Sistema de Autenticación**
- Configurar Firebase Auth
- Crear AuthStore con Zustand
- Implementar hook useAuth
- Crear AuthGuard para rutas protegidas
- Implementar formulario de registro
- Implementar formulario de login
- Crear pantalla de recuperación de contraseña
- Manejar redirecciones automáticas
- Implementar persistencia de sesión

### **Layout y Navegación Global**
- Crear layout principal (RootLayout)
- Implementar Header con navegación
- Crear Sidebar responsive
- Implementar Footer
- Crear sistema de notificaciones (toast)
- Configurar navegación responsive
- Implementar indicadores de estado de conexión

### **Pantalla Landing/Bienvenida**
- Crear componente Hero principal
- Implementar sección Features
- Crear botones CallToAction
- Diseño responsive y atractivo

### **Dashboard Principal**
- Crear pantalla dashboard
- Implementar componente UserStats
- Crear lista de partidas públicas (PublicGamesList)
- Implementar componente GameCard
- Crear botón "Crear Nueva Partida"
- Integrar API para estadísticas del usuario
- Integrar API para listar partidas públicas

### **Creación de Partidas** (Prioridad Alta)
- Crear formulario de configuración de partida
- Implementar selector de categorías (CategorySelector)
- Implementar selector de dificultad (DifficultySelector)
- Crear control de cantidad de preguntas
- Implementar toggle público/privado
- Crear selector de preguntas del banco administrado
- Crear botón de generación de preguntas con IA (opcional)
- Implementar vista previa de preguntas seleccionadas/generadas
- Implementar sistema de invitaciones para partidas privadas
- Integrar APIs de categorías y preguntas
- Integrar API de generación de preguntas con IA
- Manejar creación de partida vía WebSocket

### **Sistema WebSocket**
- Configurar cliente Socket.io
- Crear hook useSocket
- Implementar reconexión automática
- Manejar eventos de conexión/desconexión
- Crear GameStore para estado del juego
- Implementar hook useGame

### **Lobby/Sala de Espera** (Prioridad Alta)
- Crear pantalla de lobby
- Mostrar código de partida (6 dígitos)
- Implementar lista de jugadores en tiempo real
- Implementar sistema de invitaciones por enlace/código
- Crear componente para compartir invitaciones
- Crear botón "Iniciar Partida" (solo host)
- Crear botón "Salir de Partida"
- Manejar eventos WebSocket: joinGame, playerJoined, startGame
- Implementar estados de conexión visual

### **Juego en Tiempo Real**
- Crear pantalla principal del juego
- Implementar componente QuestionCard
- Crear opciones de respuesta interactivas
- Implementar componente Timer
- Crear indicador de progreso (ProgressBar)
- Implementar ScoreBoard en tiempo real
- Crear componente AnswerResult
- Implementar pantalla de resultados finales
- Manejar eventos WebSocket: gameStarted, newQuestion, submitAnswer, answerResult, gameFinished, requestQuestion
- Implementar animaciones de respuesta

### **Panel de Administración** (Prioridad Media)
- Crear pantalla de administración
- Implementar gestión CRUD de preguntas
- Crear formulario para crear/editar preguntas
- Implementar lista de preguntas existentes
- Crear gestión de categorías
- Implementar vista previa de preguntas
- Crear formulario de creación masiva de preguntas
- Integrar APIs de administración
- Implementar validación de contenido
- Crear estadísticas de uso de preguntas

### **Perfil de Usuario** (Prioridad Media)
- Crear pantalla de perfil
- Mostrar información del usuario
- Implementar estadísticas detalladas
- Crear botón de cerrar sesión
- Implementar configuraciones de cuenta (opcional)

### **Componentes UI Base**
- Configurar componentes ShadCN necesarios: Button, Card, Input, Modal, Select, etc.
- Crear componentes personalizados: LoadingButton, FormInput, GameCard
- Implementar componentes de loading y error states
- Crear componente ErrorBoundary

### **Manejo de Estado Global**
- Implementar AuthStore completo
- Implementar GameStore completo
- Implementar UIStore para estado de interfaz
- Crear hooks personalizados: useAuth, useSocket, useGame, useAPI

### **Integración con Backend**
- Configurar cliente API con Axios
- Implementar interceptores de autenticación
- Crear funciones para todos los endpoints REST
- Manejar errores de API
- Implementar cache de datos cuando sea necesario

### **Responsive Design y UX**
- Implementar diseño móvil-first
- Optimizar para tablets y desktop
- Crear navegación touch-friendly
- Implementar animaciones y transiciones
- Optimizar performance con lazy loading

### **Manejo de Errores**
- Crear página 404 personalizada
- Implementar manejo robusto de errores
- Crear fallbacks para estados de error
- Implementar retry automático para WebSockets

### **Optimizaciones**
- Implementar lazy loading de componentes
- Memoizar componentes pesados
- Optimizar re-renders
- Configurar cache de imágenes y assets
- Optimizar bundle size

### **Testing y Deploy**
- Testing de funcionalidades críticas
- Configurar build para producción
- Configurar deploy en Vercel
- Configurar variables de entorno para producción
- Testing en diferentes dispositivos

## Consideraciones Técnicas

### **Integración con Backend Existente**
- **Backend en producción:** https://backend-v1-2nej.onrender.com
- **Documentación Swagger:** https://backend-v1-2nej.onrender.com/api-docs
- Todas las APIs REST están completamente documentadas
- WebSockets completamente funcionales con Socket.io
- Sistema de autenticación Firebase ya implementado
- Generación de preguntas con IA operativa (Groq/OpenAI)
- Base de datos Firebase Firestore configurada
- Sistema de gestión de preguntas CRUD funcional
- Códigos de partida de 6 dígitos generados automáticamente
- Estadísticas de usuario actualizadas automáticamente
- Historial de partidas deshabilitado (devuelve array vacío)

### **Optimizaciones Específicas**
- Server-side rendering para SEO en páginas públicas
- Client-side navigation para experiencia fluida
- Cache inteligente de preguntas y partidas
- Reconexión automática de WebSockets

### **Accesibilidad y UX**
- Diseño accesible con ARIA labels
- Soporte para lectores de pantalla
- Navegación por teclado
- Indicadores visuales claros para estados del juego

## Consideraciones del MVP

### **Funcionalidades Principales (Basadas en Historias de Usuario)**
1. **Registro y autenticación de usuarios** (Historia #1, #2)
2. **Creación y unión a partidas multijugador** (Historia #3)
3. **Sistema de preguntas y respuestas** (Historia #4)
4. **Sistema de puntuación y ranking** (Historia #8)
5. **Panel de administración para preguntas** (Historia #7)
6. **Historial y estadísticas personales** (Historia #6)

### **Funcionalidades Secundarias**
- **Retroalimentación básica** (Historia #9) - Explicaciones almacenadas en preguntas
- **Sistema de invitaciones** (Historia #10) - Para partidas privadas
- **Recuperación de contraseña** (Historia #11) - Prioridad baja
- **Filtrado por categorías** (Historia #12) - Funcionalidad básica
- **Temporizador visual** (Historia #13) - Indicador de tiempo restante
- **Resumen de partida** (Historia #14) - Resultados finales

### **Limitaciones del MVP**
- **Historial de partidas deshabilitado**: El backend devuelve array vacío
- **Datos personales limitados**: Solo UID y estadísticas básicas
- **Sin chat avanzado**: Solo funcionalidades básicas de comunicación
- **Sin análisis avanzado**: Estadísticas básicas únicamente
- **Sin notificaciones push**: Solo notificaciones en la aplicación

### **Funcionalidades Opcionales con IA**
- **Generación de preguntas con IA**: Disponible pero opcional
- **15+ categorías disponibles**: Ciencia, Historia, Geografía, Tecnología, Deportes, Arte, Literatura, Matemáticas, Biología, Química, Física, Astronomía, Música, Cine, Videojuegos
- **3 niveles de dificultad**: Fácil, Medio, Difícil
- **Hasta 50 preguntas por generación**: Límite del backend

Este plan proporciona una hoja de ruta completa para desarrollar el frontend de BrainBlitz como MVP, enfocándose en las funcionalidades esenciales y aprovechando al máximo las funcionalidades ya implementadas en el backend, siguiendo las mejores prácticas de desarrollo con Next.js, Tailwind CSS y ShadCN/UI.
