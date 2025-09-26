# Juego de Preguntas Multijugador 

## Descripción General
Este proyecto consiste en un MVP de un juego multijugador en el que los participantes compiten respondiendo preguntas en tiempo real. El sistema cuenta con un encargado de crear y gestionar las preguntas, incluyendo sus opciones de respuesta y la solución correcta. Para el almacenamiento de usuarios, partidas y preguntas se utilizará una base de datos no relacional, lo que garantiza escalabilidad, flexibilidad y un manejo eficiente de la información en entornos dinámicos.


## Funcionalidades Principales
- Registro y autenticación de usuarios.
- Creación y unión a partidas multijugador.
- Generación dinámica de preguntas.
- Almacenamiento de datos en una base no relacional (Firebase).
- Sistema de puntuación y ranking.
- Retroalimentación.
- Panel de administración para agregar/modificar preguntas.
- Historial de partidas y estadísticas personales.

## Historias de Usuario (Formato Connextra)
1. Como usuario nuevo, quiero registrarme para poder participar en partidas.
2. Como jugador, quiero iniciar sesión para acceder a mis partidas.
3. Como jugador, quiero unirme a partidas públicas o privadas para competir con otros jugadores.
4. Como jugador, quiero responder preguntas para probar mis conocimientos.
5. Como sistema, quiero almacenar preguntas y partidas en una base de datos no relacional para escalabilidad.
6. Como usuario, quiero ver mi historial y estadísticas para medir mi progreso.
7. Como administrador, quiero gestionar las preguntas para mantener el juego actualizado.
8. Como jugador, quiero ver el ranking en tiempo real para saber mi posición.
9. Como usuario, quiero recibir retroalimentación después de las respuestas.
10. Como jugador, quiero invitar amigos a partidas privadas.
11. Como usuario, quiero recuperar mi contraseña si la olvido.
12. Como jugador, quiero filtrar preguntas por categorías.
13. Como jugador, quiero ver el tiempo restante para responder cada pregunta.
14. Como jugador, quiero ver el resumen de la partida al finalizar.


> **Nota importante:**
> El MVP descrito en este documento no requiere integración con servicios de IA para la generación de preguntas ni para el filtrado de categorías. Todas las funcionalidades principales pueden implementarse utilizando lógica tradicional y bases de datos no relacionales. La retroalimentación automática (ID 9) puede implementarse de forma básica, sin depender de IA externa.

## Product Backlog y Release Plan

## Product Backlog Inteligente

### Leyenda
- 🧠 = Historia implementada con IA
- 📝 = Historia implementada sin IA


### Historias de Usuario Detalladas

| ID | Historia | Descripción | Prioridad | Estimación | Dependencias | Criterios de aceptación | Pruebas sugeridas | IA |
|----|----------|-------------|-----------|------------|--------------|------------------------|-------------------|----|
| 1 | Como usuario nuevo, quiero registrarme para poder participar en partidas. | Permitir que nuevos usuarios creen una cuenta. | Alta | 2 pts | Ninguna | - El usuario puede registrarse con email y contraseña.<br>- El email no está repetido.<br>- Se envía confirmación de registro.<br>- El registro es seguro y cumple RGPD. | - Intentar registrar con email existente (debe fallar).<br>- Registrar usuario nuevo (debe funcionar). | 📝 |
| 2 | Como jugador, quiero iniciar sesión para acceder a mis partidas. | Permitir que los usuarios inicien sesión. | Alta | 2 pts | 1 | - El usuario puede iniciar sesión con email y contraseña.<br>- Se valida credenciales.<br>- Sesión segura y persistente. | - Iniciar sesión con credenciales incorrectas (debe fallar).<br>- Iniciar sesión con credenciales correctas (debe funcionar). | 📝 |
| 3 | Como jugador, quiero crear y unirme a partidas públicas o privadas para competir con otros. | Permitir que los usuarios creen partidas públicas o privadas y que otros jugadores puedan unirse. | Alta | 3 pts | 2 | - El usuario puede crear una partida pública o privada.<br>- Otros usuarios pueden unirse.<br>- Se gestiona el estado de la partida (espera, en curso, finalizada). | - Crear partida pública o privada y verificar que otros pueden unirse.<br>- Simular flujo de partida. | 📝 |
| 4 | Como jugador, quiero responder preguntas para probar mis conocimientos. | Consumir preguntas almacenadas en la base de datos que fueron creadas por el administrador. | Alta | 5 pts | 3 | - El jugador recibe preguntas con sus opciones de respuesta. <br>- Se valida la respuesta seleccionada y se informa si es correcta o incorrecta. <br>- Las preguntas provienen del banco gestionado por el administrador. | - El sistema muestre una pregunta con sus opciones al iniciar la partida.<br>-Confirmar que, al responder, el sistema indique si fue correcta o incorrecta. | 📝 |
| 5 | Como sistema, quiero almacenar usuarios, partidas y preguntas en Firebase para escalabilidad. | Guardar usuarios, partidas y preguntas en Firebase. | Alta | 3 pts | 1,3,4 | - Los datos se guardan y recuperan correctamente.<br>- Integridad y consistencia de datos.<br>- Escalabilidad comprobada. | - Crear, leer, actualizar y borrar datos.<br>- Pruebas de carga. | 📝 |
| 6 | Como jugador, quiero ver mi historial y estadísticas para medir mi progreso. | Mostrar a los usuarios su historial y estadísticas. | Media | 2 pts | 2,5 | - El usuario puede ver partidas jugadas y estadísticas.<br>- Datos actualizados en tiempo real.<br>- Visualización clara. | - Jugar partidas y verificar historial.<br>- Validar estadísticas. | 📝 |
| 7 | Como administrador, quiero gestionar preguntas para mantener el juego actualizado. | Permitir a administradores crear, editar y eliminar preguntas. | Media | 2 pts | 5 | - El administrador puede crear, editar y borrar preguntas.<br>- Validación de contenido.<br>- Cambios reflejados en el juego. | - Agregar y modificar preguntas desde el panel.<br>- Verificar actualización en partidas. | 📝 |
| 8 | Como jugador, quiero ver el ranking en tiempo real para saber mi posición. | Calcular y mostrar puntajes y posiciones de los jugadores. | Media | 2 pts | 3,5 | - El sistema actualiza puntajes en tiempo real.<br>- El ranking se muestra correctamente.<br>- Actualización automática. | - Simular partidas y verificar ranking.<br>- Validar actualización. | 📝 |
| 9 | Como usuario, quiero recibir retroalimentación después de responder. | Mostrar si la respuesta fue correcta o incorrecta y la opción correcta. | Media | 3 pts | 4 | - El sistema explica por qué una respuesta es correcta o incorrecta.<br>- Feedback relevante y claro.<br>- Las explicaciones se guardan en la base de datos al crear la pregunta. | - Responder preguntas y verificar feedback.<br>- Validar explicaciones. | 🧠 |
| 10 | Como jugador, quiero invitar amigos a partidas privadas. | Permitir invitar amigos mediante enlace o código único para partidas privadas. | Baja | 2 pts | 3 | - El usuario puede invitar amigos.<br>- Invitación por enlace o email.<br>- Acceso seguro. | - Invitar y verificar acceso.<br>- Validar privacidad. | 📝 |
| 11 | Como usuario, quiero recuperar mi contraseña si la olvido. | Permitir a los usuarios recuperar su contraseña. | Baja | 1 pt | 1 | - El usuario puede solicitar recuperación.<br>- Recibe instrucciones por email.<br>- Seguridad en el proceso. | - Solicitar recuperación y verificar email recibido.<br>- Intentar recuperación con email no registrado. | 📝 |
| 12 | Como jugador, quiero filtrar preguntas por categorías. | Filtrar preguntas según intereses del usuario. | Baja | 2 pts | 4 | - El sistema permite filtrar preguntas por categorías.<br>- Filtrado eficiente.<br>- Personalización por usuario. | - Seleccionar intereses y verificar sugerencias.<br>- Validar filtrado. | 📝 |
| 13 | Como jugador, quiero ver el tiempo restante para responder cada pregunta. | Mostrar tiempo restante para cada pregunta. | Baja | 1 pt | 3 | - El usuario ve un temporizador en cada pregunta.<br>- Temporizador preciso.<br>- Notificación al finalizar tiempo. | - Verificar temporizador en la interfaz.<br>- Simular expiración de tiempo. | 📝 |
| 14 | Como jugador, quiero ver el resumen de la partida al finalizar. | Mostrar resumen de resultados al terminar la partida. | Baja | 1 pt | 3,8 | - El usuario ve puntajes, respuestas y ranking final.<br>- Resumen claro y completo.<br>- Acceso al historial. | - Finalizar partida y verificar resumen.<br>- Validar acceso al historial. | 📝 |

---

#### Tareas técnicas sugeridas por historia de usuario

| ID | Tareas técnicas principales |
|----|----------------------------|
| 1  | Backend: API de registro de usuario, validación de email, almacenamiento seguro en base no relacional.<br>Frontend: Formulario de registro, validación de campos, mensajes de error y éxito.<br>Integración: Conexión con base de datos (Firebase/MongoDB). |
| 2  | Backend: API de autenticación, gestión de sesiones, validación de credenciales.<br>Frontend: Formulario de login, manejo de sesiones, feedback de autenticación.<br>Integración: Persistencia de sesión y tokens. |
| 3  | Backend: Endpoints para crear y unirse a partidas, lógica de salas públicas/privadas.<br>Frontend: UI para crear/unirse a partidas, visualización de estado de la sala.<br>Integración: Sincronización en tiempo real de estado de partidas. |
| 4  | Backend: API para servir preguntas, lógica de validación de respuestas.<br>Frontend: UI de preguntas y opciones, feedback inmediato.<br>Integración: Consumo de preguntas desde base de datos. |
| 5  | Backend: Modelos y endpoints CRUD para usuarios, partidas y preguntas.<br>Integración: Configuración y pruebas de escalabilidad en base no relacional. |
| 6  | Backend: Endpoints para historial y estadísticas.<br>Frontend: Visualización de historial y estadísticas.<br>Integración: Consultas agregadas a la base de datos. |
| 7  | Backend: API para gestión de preguntas (crear, editar, eliminar).<br>Frontend: Panel de administración.<br>Integración: Validación y actualización en base de datos. |
| 8  | Backend: Lógica de cálculo de ranking y puntajes.<br>Frontend: UI de ranking en tiempo real.<br>Integración: Actualización automática de datos. |
| 9  | Backend: Lógica de feedback y explicación de respuestas.<br>Frontend: Mensajes de retroalimentación.<br>Integración: Almacenamiento de explicaciones.<br>IA: Generación automática de feedback. |
| 10 | Backend: Generación y validación de enlaces/códigos de invitación.<br>Frontend: UI para invitar y unirse mediante enlace/código.<br>Integración: Seguridad en el acceso a partidas privadas. |
| 11 | Backend: Endpoint para recuperación de contraseña, envío de email.<br>Frontend: Formulario de recuperación.<br>Integración: Validación de usuario y flujo seguro. |
| 12 | Backend: Lógica de filtrado de categorías.<br>Frontend: UI de selección y filtrado.<br>Integración: Personalización por usuario. |
| 13 | Frontend: Temporizador visual en preguntas.<br>Backend: Lógica de expiración de tiempo.<br>Integración: Notificación y control de flujo. |
| 14 | Backend: Generación de resumen de partida.<br>Frontend: UI de resumen y acceso a historial.<br>Integración: Consulta y visualización de resultados. |
