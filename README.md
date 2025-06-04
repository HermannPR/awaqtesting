# 🌿 MAWI - Monitoreo Ambiental Web Interactivo v2.0

> **Plataforma completa de biomonitoreo con arquitectura empresarial y tecnologías modernas**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen.svg)
![MySQL](https://img.shields.io/badge/database-MySQL-orange.svg)

---

## 🚀 ¿Qué es MAWI?

MAWI es una **plataforma web empresarial** diseñada para el biomonitoreo y gestión de datos ambientales. Esta versión 2.0 representa una **reingeniería completa** del proyecto original, transformándolo de una aplicación básica HTML/CSS/JS a un sistema robusto con arquitectura backend completa.

### 🎯 Funcionalidades Principales

- 📊 **Dashboard Interactivo** con métricas en tiempo real
- 🔐 **Sistema de Autenticación Multi-Rol** (Usuario, Biomonitor, Admin, Super Admin)
- 📝 **Formularios Dinámicos** para captura de datos de biodiversidad
- 🤖 **Asistente de IA** para biomonitoreo inteligente
- 👥 **Panel de Super Administración** con gestión completa de usuarios
- 📱 **Diseño Responsive Mobile-First**
- 🔧 **Sistema de Componentes Reutilizables**
- 📁 **Gestión de Archivos e Imágenes**

---

## 🏗️ Arquitectura Técnica

### Backend (Node.js + Express)
```
├── Controllers/         # Controladores MVC
│   ├── API/            # REST API Controllers
│   └── router.js       # Sistema de rutas
├── Service/            # Lógica de negocio
├── Datasource/         # Gestión de base de datos
└── webserver.js        # Servidor principal
```

### Frontend (Componentes Modulares)
```
├── public/
│   ├── components/     # Componentes reutilizables
│   ├── css/           # Estilos modulares
│   ├── js/            # JavaScript avanzado
│   └── *.html         # Páginas de la aplicación
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime del servidor |
| **Express.js** | 4.18+ | Framework web |
| **MySQL** | 8.0+ | Base de datos |
| **JWT** | 9.0+ | Autenticación |
| **Multer** | 1.4+ | Upload de archivos |
| **bcryptjs** | 2.4+ | Encriptación |
| **OpenAI API** | Latest | Integración de IA |

---

## ⚡ Instalación Rápida

### 1. Requisitos Previos
- Node.js 18+
- MySQL 8.0+
- Git

### 2. Clonación e Instalación
```bash
# Clonar repositorio
git clone https://github.com/HermannPR/AWAQ.git
cd AWAQ

# Instalar dependencias
npm install
```

### 3. Configuración de Entorno
Crea un archivo `.env` con:
```env
# Base de Datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=mawi_db

# JWT
JWT_SECRET=tu_clave_secreta_super_segura

# IA (Opcional)
AI_API_KEY=tu_openai_api_key

# Puertos
PORT=3000
CHATBOT_PORT=3001
```

### 4. Configuración de Base de Datos
```sql
-- Crear base de datos
CREATE DATABASE mawi_db;

-- Crear tabla de usuarios (ejemplo)
CREATE TABLE Usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    Apellidos VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    rol INT DEFAULT 1,
    estado CHAR(1) DEFAULT 'P'
);
```

### 5. Ejecutar la Aplicación
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

**🌐 Accede a**: `http://localhost:3000`

---

## 👥 Sistema de Roles

| Rol | Nivel | Permisos |
|-----|-------|----------|
| **Usuario** | 1 | Dashboard, formularios básicos |
| **Biomonitor** | 2 | Acceso a herramientas de monitoreo |
| **Administrador** | 3 | Panel admin, gestión de registros |
| **Super Admin** | 4 | Control total, gestión de usuarios |

---

## 📊 Funcionalidades por Módulo

### 🏠 Dashboard
- Métricas en tiempo real
- Gráficos interactivos
- Resumen de actividades
- Enlaces rápidos por rol

### 👤 Gestión de Usuarios
- Registro y autenticación
- Perfiles personalizables
- Sistema de aprobación
- Control de estados (Activo/Pendiente/Inactivo)

### 📝 Formularios de Biomonitoreo
- **Variables Climáticas**: Temperatura, humedad, precipitación
- **Cámaras Trampa**: Gestión de capturas de fauna
- **Fauna**: Búsqueda libre, punto conteo, transectos
- **Vegetación**: Parcelas de vegetación, cobertura

### 🤖 Asistente de IA
- Chat inteligente para consultas
- Ayuda contextual
- Recomendaciones automáticas

### ⚙️ Panel de Administración
- Gestión completa de usuarios
- Aprobación/rechazo de registros
- Estadísticas del sistema
- Configuraciones avanzadas

---

## 🔌 API REST

### Autenticación
```
POST /Consultas/api/login
```

### Usuarios
```
GET    /Consultas/api/getusers
POST   /Consultas/api/insertUser
PUT    /Consultas/api/updateUser
DELETE /Consultas/api/deleteUser
```

### Super Admin
```
GET  /Consultas/api/getUsersNA
POST /Consultas/api/aceptarUsuario/:id
POST /Consultas/api/rechazarUsuario/:id
```

### Formularios
```
POST /Consultas/api/insertVClimaticas
POST /Consultas/api/insertCamarasTrampa
POST /Consultas/api/insertFaunaBusquedaLibre
# ... y más
```

---

## 🧪 Testing

### Páginas de Prueba
- **Test Sidebar**: `http://localhost:3000/test-sidebar.html`
- **Test Admin**: `http://localhost:3000/test-admin.html`

### Usuarios de Prueba
```
Super Admin: admin@mawi.com / password123
Admin: manager@mawi.com / password123
Usuario: user@mawi.com / password123
```

---

## 📁 Estructura del Proyecto

<details>
<summary>Ver estructura completa</summary>

```
MAWI-NEW/
├── 📊 CHANGELOG.md              # Historial de cambios
├── 📚 README.md                 # Este archivo
├── ⚙️ package.json              # Dependencias
├── 🚀 main.js                   # Punto de entrada
├── 🌐 webserver.js              # Servidor web
├── 🤖 chatbot-server.js         # Servidor IA
├── 📐 constants.js              # Constantes
│
├── 🎛️ Controllers/               # Controladores
│   ├── 🔀 router.js             # Enrutador principal
│   └── 📡 API/                  # API Controllers
│       ├── usersRestController.js
│       ├── SAdminRestController.js
│       ├── formRestController.js
│       ├── imageRestController.js
│       └── aiChatController.js
│
├── 🔧 Service/                  # Servicios de negocio
│   ├── usersService.js
│   ├── SAdminService.js
│   ├── formsService.js
│   ├── imageUploadService.js
│   └── hashPassword.js
│
├── 🗄️ Datasource/               # Gestión de datos
│   └── MySQLMngr.js
│
└── 🌐 public/                   # Frontend
    ├── 🧩 components/           # Componentes
    ├── 🎨 css/                  # Estilos
    ├── ⚡ js/                   # JavaScript
    └── 📄 *.html                # Páginas
```

</details>

---

## 🤝 Contribución

### Cómo Contribuir
1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Desarrollo
- Seguir el patrón MVC establecido
- Documentar nuevas funcionalidades
- Mantener compatibilidad con el sistema de roles
- Escribir tests para nuevas características

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 📞 Contacto y Soporte

- **Repositorio**: [https://github.com/HermannPR/AWAQ](https://github.com/HermannPR/AWAQ)
- **Issues**: [Reportar Problemas](https://github.com/HermannPR/AWAQ/issues)
- **Documentación**: Ver archivos `CHANGELOG.md` y `SIDEBAR_IMPLEMENTATION_SUMMARY.md`

---

## 🎉 Reconocimientos

- Proyecto original: [TC2005B_AWAQ](https://github.com/Abelcam29/TC2005B_AWAQ)
- Desarrollado como evolución completa del sistema original
- Implementación de arquitectura empresarial moderna

---

<div align="center">

**🌿 MAWI v2.0 - Transformando el biomonitoreo con tecnología moderna 🌿**

[![Stars](https://img.shields.io/github/stars/HermannPR/AWAQ?style=social)](https://github.com/HermannPR/AWAQ)
[![Forks](https://img.shields.io/github/forks/HermannPR/AWAQ?style=social)](https://github.com/HermannPR/AWAQ)

</div>
# TC2005B_AWAQ
# TC2005B_AWAQ
