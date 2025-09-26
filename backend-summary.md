# BrainBlitz Backend - Análisis Completo

## Descripción General

**BrainBlitz** es un backend para un juego de trivia multijugador en tiempo real construido con Node.js, Express, Socket.io y Firebase. El sistema permite a los usuarios crear partidas, generar preguntas con IA, y jugar en tiempo real con otros jugadores.

**URL de Producción:** https://backend-v1-2nej.onrender.com

## Arquitectura del Sistema

### Stack Tecnológico
- **Backend:** Node.js + Express
- **Tiempo Real:** Socket.io
- **Base de Datos:** Firebase Firestore
- **Autenticación:** Firebase Auth
- **IA:** Groq API + OpenAI (fallback)
- **Documentación:** Swagger/OpenAPI 3.0

### Estructura de Carpetas

```
backend-v1-main/
├── controllers/           # Lógica de negocio de endpoints
│   ├── aiController.js    # Generación de preguntas con IA
│   ├── gamesController.js # Gestión de partidas
│   ├── questionsController.js # CRUD de preguntas
│   └── usersController.js # Gestión de usuarios
├── middleware/           # Middleware de autenticación
│   └── authenticate.js   # Validación de tokens JWT
├── routes/              # Definición de rutas REST
│   ├── ai.js           # Rutas de IA
│   ├── games.js        # Rutas de partidas
│   ├── questions.js    # Rutas de preguntas
│   └── users.js        # Rutas de usuarios
├── services/            # Servicios y utilidades
│   └── aiQuestionGenerator.js # Generador de preguntas IA
├── swagger/            # Documentación API
│   └── swagger.yaml    # Especificación OpenAPI
├── firebase.js         # Configuración Firebase
├── hybridServer.js     # Servidor principal (Express + Socket.io)
├── package.json        # Dependencias y scripts
└── .gitignore         # Archivos ignorados por Git
```

## Funcionalidades Principales

### 1. API RESTful
- **Usuarios:** Registro, autenticación, estadísticas
- **Partidas:** Listado de partidas públicas
- **Preguntas:** CRUD completo de preguntas
- **IA:** Generación de preguntas con inteligencia artificial

### 2. WebSockets (Tiempo Real)
- **Crear partidas:** `createGame`
- **Unirse a partidas:** `joinGame`
- **Iniciar partidas:** `startGame`
- **Responder preguntas:** `submitAnswer`
- **Gestión de puntajes:** Automática en tiempo real

### 3. Generación de Preguntas con IA
- **Proveedores:** Groq (principal) + OpenAI (fallback)
- **Temas:** 15+ categorías disponibles
- **Dificultades:** Fácil, Medio, Difícil
- **Límite:** Hasta 50 preguntas por petición

## Flujo de Juego

### 1. Preparación
1. Usuario genera preguntas con IA (`POST /api/ai/generate-questions`)
2. Selecciona tema, dificultad y cantidad de preguntas

### 2. Creación de Partida
1. Usuario crea partida vía WebSocket (`createGame`)
2. Envía preguntas generadas y configuración
3. Sistema valida autenticación y datos

### 3. Participación
1. Otros jugadores se unen (`joinGame`)
2. Host inicia la partida (`startGame`)
3. Sistema envía preguntas secuencialmente

### 4. Desarrollo
1. Jugadores responden (`submitAnswer`)
2. Sistema valida respuestas automáticamente
3. Actualiza puntajes en tiempo real
4. Avanza a siguiente pregunta

### 5. Finalización
1. Sistema calcula resultados finales
2. Guarda estadísticas de jugadores
3. Actualiza historial de partidas

## Endpoints REST Principales

### Usuarios
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/recover-password` - Recuperar contraseña
- `GET /api/users/me/stats` - Obtener estadísticas
- `GET /api/users/me/history` - Historial (deshabilitado)

### Partidas
- `GET /api/games` - Listar partidas públicas

### Preguntas
- `GET /api/questions` - Listar todas las preguntas
- `POST /api/questions` - Crear pregunta
- `POST /api/questions/bulk` - Crear múltiples preguntas
- `PUT /api/questions/{id}` - Actualizar pregunta
- `DELETE /api/questions/{id}` - Eliminar pregunta

### IA
- `POST /api/ai/generate-questions` - Generar preguntas con IA
- `GET /api/ai/topics` - Temas disponibles
- `GET /api/ai/difficulty-levels` - Niveles de dificultad

## Configuración y Despliegue

### Variables de Entorno Requeridas
```env
PORT=5000
GROQ_API_KEY=tu_api_key_groq
GROQ_MODEL=llama-3.1-8b-instant
# OPENAI_API_KEY=tu_api_key_openai (opcional)
# OPENAI_MODEL=gpt-3.5-turbo (opcional)
```

### Archivos de Configuración
- `.env` - Variables de entorno
- `serviceAccountKey.json` - Clave de servicio Firebase

### Scripts Disponibles
```bash
npm start          # Iniciar servidor
npm run dev        # Desarrollo con nodemon
npm test           # Ejecutar pruebas
npm run test:coverage # Pruebas con cobertura
```

## Características Técnicas

### Seguridad
- Autenticación JWT con Firebase
- Validación de tokens en endpoints protegidos
- CORS configurado para múltiples orígenes

### Escalabilidad
- Arquitectura modular con separación de responsabilidades
- Base de datos NoSQL (Firestore) para escalabilidad horizontal
- WebSockets para comunicación en tiempo real

### Documentación
- Swagger UI disponible en `/api-docs`
- Documentación completa de todos los endpoints
- Ejemplos de uso y respuestas

### Testing
- Suite de pruebas con Jest
- Pruebas unitarias y de integración
- Cobertura de código configurada

## Consideraciones de Diseño

### Ventajas
- **Agnóstico de Frontend:** Cualquier cliente puede consumir la API
- **Tiempo Real:** WebSockets para experiencia fluida
- **IA Integrada:** Generación automática de preguntas
- **Documentación Completa:** Swagger para fácil integración
- **Escalable:** Arquitectura preparada para crecimiento

### Limitaciones
- **Dependencia de Firebase:** Requiere configuración de Firebase
- **API Keys Externas:** Depende de servicios de IA externos
- **Historial Deshabilitado:** Funcionalidad de historial no disponible

## Estado Actual

El backend está **completamente funcional** y desplegado en producción. Incluye:
- ✅ API REST completa
- ✅ WebSockets funcionando
- ✅ Generación de preguntas con IA
- ✅ Autenticación Firebase
- ✅ Documentación Swagger
- ✅ Suite de pruebas

**Punto de entrada único:** `hybridServer.js` (no usar otros archivos de arranque)
