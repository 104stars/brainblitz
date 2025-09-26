# Pasos de Configuración - BrainBlitz Frontend

## 🚀 **Configuración Inicial del Proyecto**

### **1. Crear el Proyecto Next.js**
- Ejecutar `npx create-next-app@latest frontend` con opciones: Tailwind, ESLint, App Router, src-dir, JavaScript
- Navegar al directorio `frontend`

### **2. Instalar Dependencias Adicionales**
- Instalar: axios, socket.io-client, zustand, phosphor-icons
- Instalar Firebase para autenticación
- Instalar dependencias de desarrollo opcionales

### **3. Configurar ShadCN/UI**
- Inicializar ShadCN con configuración para JavaScript
- Seleccionar: No TypeScript, Style Default, CSS variables Yes
- Configurar componentes en `src/components` y utils en `src/lib/utils`

### **4. Instalar Componentes ShadCN Necesarios**
- Instalar componentes base: button, card, input, label, select
- Instalar componentes adicionales: toast, dialog, progress, badge, avatar, separator

### **5. Configurar Variables de Entorno**
- Crear archivo `.env.local` en carpeta `frontend/`
- Configurar URLs del backend (API y Socket)
- Configurar credenciales de Firebase

### **6. Configurar Next.js**
- Actualizar `next.config.js` con variables de entorno
- Configurar dominios de imágenes
- Configurar configuración de producción

### **7. Crear Estructura de Carpetas**
- Crear carpetas: components/{ui,auth,game,dashboard,common}, lib, hooks, store, constants
- Crear archivos base: firebase.js, api.js, socket.js, utils.js
- Crear hooks: useAuth.js, useSocket.js, useGame.js, useAPI.js
- Crear stores: authStore.js, gameStore.js, uiStore.js

### **8. Configurar Firebase**
- Crear `src/lib/firebase.js` con configuración de Firebase
- Configurar autenticación con Firebase Auth
- Exportar instancia de auth

### **9. Configurar Cliente API**
- Crear `src/lib/api.js` con configuración de Axios
- Configurar base URL del backend
- Implementar interceptor para autenticación automática

### **10. Configurar WebSocket**
- Crear `src/lib/socket.js` con clase SocketClient
- Implementar métodos: connect, disconnect, emit, on, off
- Configurar reconexión automática

### **11. Configurar Layout Principal**
- Actualizar `src/app/layout.js` con metadata
- Configurar fuente Inter
- Configurar idioma español

### **12. Configurar Tailwind CSS**
- Actualizar `src/app/globals.css` con variables CSS
- Configurar tema de colores para ShadCN
- Configurar estilos base

### **13. Crear Página de Inicio Básica**
- Actualizar `src/app/page.js` con página de bienvenida
- Implementar diseño responsive
- Agregar indicador de configuración completada

### **14. Verificar Configuración**
- Ejecutar `npm run dev`
- Verificar que la aplicación carga en `http://localhost:3000`
- Confirmar que no hay errores en consola

### **15. Scripts Útiles para el Monorepo**
- Crear `package.json` en la raíz del proyecto
- Configurar scripts para desarrollo simultáneo de backend y frontend
- Instalar concurrently para ejecutar múltiples procesos

## ✅ **Verificación Final**

Después de estos pasos deberías tener:

1. ✅ Next.js 14+ funcionando
2. ✅ Tailwind CSS configurado
3. ✅ ShadCN/UI instalado
4. ✅ Firebase configurado
5. ✅ Cliente API configurado
6. ✅ WebSocket configurado
7. ✅ Estructura de carpetas creada
8. ✅ Variables de entorno configuradas

**¡Listo para empezar a implementar las funcionalidades del plan!** 🎉

## 📝 **Notas Importantes**

- **Firebase:** Necesitarás obtener las credenciales de tu proyecto Firebase
- **Backend:** Asegúrate de que el backend esté funcionando en la URL especificada
- **Variables de entorno:** No olvides configurar todas las variables necesarias
- **Estructura:** La estructura de carpetas está optimizada para el proyecto BrainBlitz
