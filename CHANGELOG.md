# MAWI Project - Changelog (v2.0)

## 🚀 Actualización Completa: De TC2005B_AWAQ a MAWI-NEW

### 📊 Resumen General
Esta versión representa una **reingeniería completa** del proyecto original, transformándolo de una aplicación básica HTML/CSS/JS a un sistema web completo con arquitectura backend robusta y frontend modular.

---

## 🔧 CAMBIOS EN BACKEND

### 1. **Nueva Arquitectura de Servidor**
- **Antes**: Simple archivo `index.js` con HTML estático
- **Ahora**: Arquitectura completa Node.js/Express con múltiples servidores

#### Nuevos Archivos de Servidor:
- `main.js` - Servidor principal
- `webserver.js` - Servidor web con Express
- `chatbot-server.js` - Servidor dedicado para AI Chat
- `constants.js` - Constantes de configuración

### 2. **Sistema de Base de Datos**
- **Nuevo**: Integración completa con MySQL
- **Archivo**: `Datasource/MySQLMngr.js`
- **Funcionalidades**:
  - Pool de conexiones
  - Manejo de transacciones
  - Queries preparados
  - Error handling robusto

### 3. **Sistema de Autenticación y Autorización**
#### Nuevos Servicios:
- `Service/usersService.js` - Gestión de usuarios
- `Service/hashPassword.js` - Encriptación de contraseñas
- **Roles implementados**:
  - Usuario regular (rol 1)
  - Biomonitor (rol 2)
  - Administrador (rol 3)
  - Super Administrador (rol 4)

#### Controllers de Autenticación:
- `Controllers/API/usersRestController.js`
  - Login con JWT
  - Middleware de autenticación por roles
  - CRUD de usuarios
  - Gestión de perfiles

### 4. **Sistema de Administración Completo**
#### Super Admin System:
- `Service/SAdminService.js`
- `Controllers/API/SAdminRestController.js`
- **Funcionalidades**:
  - Aprobación/rechazo de usuarios pendientes
  - Gestión de registros por usuario
  - Consultas administrativas
  - Control de estados de usuario (A/P/I)

### 5. **Sistema de Formularios Dinámicos**
- `Service/formsService.js`
- `Controllers/API/formRestController.js`
- **Tipos de formularios**:
  - Variables Climáticas
  - Cámaras Trampa
  - Fauna (Búsqueda Libre, Punto Conteo, Transecto)
  - Validación de Cobertura
  - Parcela de Vegetación

### 6. **Sistema de Gestión de Imágenes**
- `Service/imageUploadService.js`
- `Controllers/API/imageRestController.js`
- **Funcionalidades**:
  - Upload con Multer
  - Validación de tipos de archivo
  - Procesamiento de imágenes
  - Almacenamiento seguro

### 7. **Integración con IA (ChatBot)**
- `Controllers/API/aiChatController.js`
- **Características**:
  - Chat inteligente para asistencia
  - Configuración dinámica
  - API REST para comunicación

### 8. **Sistema de Routing Avanzado**
- `Controllers/router.js`
- **Rutas implementadas**:
  - Autenticación: `/api/login`
  - Usuarios: `/api/getusers`, `/api/insertUser`, `/api/updateUser`
  - Formularios: 7 endpoints específicos por tipo
  - Admin: `/api/getRegistrosPorUsuario`, `/api/getRegistros`
  - Super Admin: `/api/getUsersNA`, `/api/aceptarUsuario`, `/api/rechazarUsuario`
  - Imágenes: `/api/imageUpload`
  - AI Chat: `/api/ai-chat`, `/api/ai-config`

---

## 🎨 CAMBIOS EN FRONTEND

### 1. **Sistema de Componentes Modulares**
#### Antes:
- HTML estático duplicado
- Sin sistema de componentes
- Código repetitivo

#### Ahora:
- **Componente Sidebar**: `public/components/sidebar.html`
- **Cargador dinámico**: `public/js/sidebar-loader.js`
- **Sistema de roles**: `public/js/admin-button.js`
- **Estilos unificados**: `public/css/sidebar-styles.css`

### 2. **Páginas Completamente Rediseñadas**
#### Páginas Actualizadas:
- `dashboard.html` - Dashboard principal con métricas
- `biomo.html` - Asistente de biomonitoreo con IA
- `explorador.html` - Explorador de datos interactivo
- `convocatorias.html` - Gestión de convocatorias
- `perfil.html` - Perfil de usuario avanzado

#### Nuevas Páginas:
- `indexAdmin.html` - Panel de administrador
- `indexSAdmin.html` - Panel de super administrador
- `SAaceptarusuarios.html` - Aprobación de usuarios
- `AdmUpReguser.html` - Gestión de usuarios registrados
- `chatbot.html` - Interfaz de chat con IA
- `test-sidebar.html` - Página de testing

### 3. **Sistema de Estilos Avanzado**
- `public/css/admin-styles.css` - Estilos para paneles admin
- `public/css/sidebar-styles.css` - Sistema de sidebar responsive
- Diseño mobile-first
- Animaciones y transiciones suaves
- Sistema de colores consistente

### 4. **Funcionalidades JavaScript Avanzadas**
- Autenticación JWT en frontend
- Manejo de estados de usuario
- AJAX para comunicación con API
- Validación de formularios
- Manejo de errores robusto

---

## 📦 DEPENDENCIAS Y CONFIGURACIÓN

### Nuevas Dependencias (package.json):
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  }
}
```

### Configuración de Entorno:
- Archivo `.env` para variables de entorno
- Configuración de base de datos
- Claves JWT
- Configuración de puertos

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tablas Principales:
1. **Usuarios**
   - Campos: idUsuario, Nombre, Apellidos, email, password, rol, estado
   - Estados: A (Activo), P (Pendiente), I (Inactivo)

2. **Registros de Biomonitoreo**
   - Variables climáticas
   - Datos de fauna
   - Información de vegetación
   - Registros de cámaras trampa

3. **Gestión Administrativa**
   - Logs de actividad
   - Aprobaciones de usuarios
   - Configuraciones del sistema

---

## 🔒 SEGURIDAD IMPLEMENTADA

### Autenticación:
- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Middleware de autenticación por rutas
- Validación de roles por endpoint

### Autorización:
- Sistema de roles jerárquico (1-4)
- Middleware específico por nivel de acceso
- Validación de permisos en frontend

### Validación de Datos:
- Sanitización de inputs
- Validación de tipos de archivo
- Prevención de inyección SQL
- Headers de seguridad

---

## 📱 MEJORAS EN UX/UI

### Responsive Design:
- Mobile-first approach
- Breakpoints optimizados
- Touch-friendly interfaces

### Navegación:
- Sidebar colapsible
- Navegación por roles
- Estados activos dinámicos
- Breadcrumbs

### Feedback al Usuario:
- Mensajes de éxito/error
- Loading states
- Confirmaciones de acciones
- Notificaciones toast

---

## 🧪 TESTING Y CALIDAD

### Archivos de Testing:
- `test-sidebar.html` - Testing de componentes
- `test-admin.html` - Testing de funcionalidades admin
- Logging extensivo en consola
- Error handling completo

---

## 🚀 DEPLOYMENT Y CONFIGURACIÓN

### Servidor de Desarrollo:
```bash
npm install
npm run dev
```

### Puertos de Configuración:
- Puerto principal: 3000
- Puerto chatbot: 3001
- Base de datos: Configurable via .env

### Variables de Entorno Requeridas:
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET
- AI_API_KEY (para funcionalidades de IA)

---

## 📈 MÉTRICAS DE MEJORA

### Antes (Versión Original):
- 📄 ~10 archivos HTML estáticos
- 🎨 CSS básico sin organización
- ⚡ JavaScript mínimo
- 🔒 Sin autenticación
- 📊 Sin base de datos

### Ahora (MAWI v2.0):
- 📄 25+ archivos organizados en arquitectura MVC
- 🎨 Sistema de estilos modular y responsive
- ⚡ JavaScript avanzado con APIs REST
- 🔒 Sistema completo de autenticación/autorización
- 📊 Base de datos completa con múltiples tablas
- 🤖 Integración con IA
- 📱 Diseño responsive completo
- 🔧 Sistema de componentes reutilizables

---

## 🎯 FUNCIONALIDADES CLAVE NUEVAS

1. **Sistema de Usuarios Multi-Rol**
2. **Dashboard Interactivo con Métricas**
3. **Asistente de IA para Biomonitoreo**
4. **Panel de Super Administración**
5. **Sistema de Formularios Dinámicos**
6. **Gestión de Imágenes y Archivos**
7. **Autenticación JWT Completa**
8. **API REST Robusta**
9. **Componentes Reutilizables**
10. **Diseño Responsive Mobile-First**

---

## 🏁 CONCLUSIÓN

La transformación de TC2005B_AWAQ a MAWI representa un **upgrade completo** de una aplicación web básica a un **sistema empresarial robusto** con todas las características necesarias para un proyecto de biomonitoreo de clase mundial.

### Líneas de Código:
- **Antes**: ~500 líneas
- **Ahora**: ~15,000+ líneas de código profesional

### Funcionalidades:
- **Antes**: Páginas estáticas
- **Ahora**: Sistema completo con backend, frontend, base de datos, autenticación, IA y más.

---

**Versión**: 2.0.0  
**Fecha**: Junio 2025  
**Tipo de Release**: Major Version - Complete Rewrite
