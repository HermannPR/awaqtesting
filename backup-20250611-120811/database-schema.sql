-- =====================================
-- ESQUEMA DE BASE DE DATOS MAWI v2.0
-- Monitoreo Ambiental Web Interactivo
-- =====================================

-- Usar la base de datos
USE mawi_db;

-- =====================================
-- TABLA USUARIOS
-- =====================================
CREATE TABLE IF NOT EXISTS Usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    organizacion VARCHAR(200),
    ubicacion VARCHAR(300),
    rol INT DEFAULT 1 COMMENT '1=Usuario, 2=Biomonitor, 3=Admin, 4=SuperAdmin',
    estado CHAR(1) DEFAULT 'P' COMMENT 'A=Activo, P=Pendiente, I=Inactivo',
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaUltimoAcceso TIMESTAMP NULL,
    avatar VARCHAR(500) NULL,
    verificado BOOLEAN DEFAULT FALSE,
    tokenVerificacion VARCHAR(255) NULL,
    tokenRecuperacion VARCHAR(255) NULL,
    fechaExpiracionToken TIMESTAMP NULL
);

-- =====================================
-- TABLA BIOMONITOREO
-- =====================================
CREATE TABLE IF NOT EXISTS Biomonitoreo (
    idBiomo INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(300),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    fechaMonitoreo DATE NOT NULL,
    horaMonitoreo TIME,
    tipoEcosistema VARCHAR(100),
    estadoConservacion VARCHAR(100),
    observaciones TEXT,
    metodologia TEXT,
    equipoUtilizado TEXT,
    condicionesClimaticas TEXT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado CHAR(1) DEFAULT 'A' COMMENT 'A=Activo, I=Inactivo',
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE
);

-- =====================================
-- TABLA ESPECIES IDENTIFICADAS
-- =====================================
CREATE TABLE IF NOT EXISTS Especies (
    idEspecie INT AUTO_INCREMENT PRIMARY KEY,
    idBiomo INT NOT NULL,
    nombreComun VARCHAR(200),
    nombreCientifico VARCHAR(200),
    reino VARCHAR(100),
    filo VARCHAR(100),
    clase VARCHAR(100),
    orden VARCHAR(100),
    familia VARCHAR(100),
    genero VARCHAR(100),
    especie VARCHAR(100),
    cantidad INT DEFAULT 1,
    unidadMedida VARCHAR(50),
    estadoConservacion VARCHAR(100),
    endemismo BOOLEAN DEFAULT FALSE,
    amenazas TEXT,
    importanciaEcologica TEXT,
    observaciones TEXT,
    fechaIdentificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idBiomo) REFERENCES Biomonitoreo(idBiomo) ON DELETE CASCADE
);

-- =====================================
-- TABLA IMÁGENES
-- =====================================
CREATE TABLE IF NOT EXISTS Imagenes (
    idImagen INT AUTO_INCREMENT PRIMARY KEY,
    idBiomo INT,
    idEspecie INT NULL,
    idUsuario INT NOT NULL,
    nombreArchivo VARCHAR(500) NOT NULL,
    rutaArchivo VARCHAR(1000) NOT NULL,    tipoArchivo VARCHAR(50),
    tamanio INT,
    descripcion TEXT,
    coordenadasGPS VARCHAR(100),
    fechaCaptura TIMESTAMP,
    fechaSubida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado CHAR(1) DEFAULT 'A',
    FOREIGN KEY (idBiomo) REFERENCES Biomonitoreo(idBiomo) ON DELETE CASCADE,
    FOREIGN KEY (idEspecie) REFERENCES Especies(idEspecie) ON DELETE SET NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE
);

-- =====================================
-- TABLA CONVOCATORIAS
-- =====================================
CREATE TABLE IF NOT EXISTS Convocatorias (
    idConvocatoria INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(300) NOT NULL,
    descripcion TEXT NOT NULL,
    objetivos TEXT,
    alcance TEXT,
    requisitos TEXT,
    presupuesto DECIMAL(15,2),
    fechaInicio DATE NOT NULL,
    fechaCierre DATE NOT NULL,
    fechaEjecucionInicio DATE,
    fechaEjecucionFin DATE,
    organizacionConvocante VARCHAR(300),
    contacto VARCHAR(300),
    email VARCHAR(150),
    telefono VARCHAR(20),
    sitioWeb VARCHAR(500),
    documentos TEXT,
    estado CHAR(1) DEFAULT 'A' COMMENT 'A=Abierta, C=Cerrada, E=Evaluacion, F=Finalizada',
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creadoPor INT,
    FOREIGN KEY (creadoPor) REFERENCES Usuarios(idUsuario)
);

-- =====================================
-- TABLA ANTEPROYECTOS
-- =====================================
CREATE TABLE IF NOT EXISTS Anteproyectos (
    idAnteproyecto INT AUTO_INCREMENT PRIMARY KEY,
    idConvocatoria INT NOT NULL,
    idUsuario INT NOT NULL,
    titulo VARCHAR(300) NOT NULL,
    resumenEjecutivo TEXT,
    objetivoGeneral TEXT,
    objetivosEspecificos TEXT,
    justificacion TEXT,
    metodologia TEXT,
    cronograma TEXT,
    presupuesto DECIMAL(15,2),
    impactoEsperado TEXT,
    sostenibilidad TEXT,
    equipo TEXT,
    referencias TEXT,
    anexos TEXT,
    estado CHAR(1) DEFAULT 'B' COMMENT 'B=Borrador, E=Enviado, R=Revision, A=Aprobado, R=Rechazado',
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fechaEnvio TIMESTAMP NULL,
    comentariosRevisor TEXT,
    puntaje DECIMAL(5,2),
    FOREIGN KEY (idConvocatoria) REFERENCES Convocatorias(idConvocatoria) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE
);

-- =====================================
-- TABLA FORMULARIOS DINÁMICOS
-- =====================================
CREATE TABLE IF NOT EXISTS Formularios (
    idFormulario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    esquemaJSON TEXT NOT NULL COMMENT 'Esquema del formulario en formato JSON',
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creadoPor INT,
    FOREIGN KEY (creadoPor) REFERENCES Usuarios(idUsuario)
);

-- =====================================
-- TABLA RESPUESTAS FORMULARIOS
-- =====================================
CREATE TABLE IF NOT EXISTS RespuestasFormularios (
    idRespuesta INT AUTO_INCREMENT PRIMARY KEY,
    idFormulario INT NOT NULL,
    idUsuario INT NOT NULL,
    respuestasJSON TEXT NOT NULL COMMENT 'Respuestas en formato JSON',
    fechaEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ipAddress VARCHAR(45),
    userAgent TEXT,
    estado CHAR(1) DEFAULT 'A',
    FOREIGN KEY (idFormulario) REFERENCES Formularios(idFormulario) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE
);

-- =====================================
-- TABLA CHAT/MENSAJES IA
-- =====================================
CREATE TABLE IF NOT EXISTS ChatSesiones (
    idSesion INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    contexto VARCHAR(100) COMMENT 'biomo, convocatoria, explorador',
    fechaInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaUltimaActividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ChatMensajes (
    idMensaje INT AUTO_INCREMENT PRIMARY KEY,
    idSesion INT NOT NULL,
    tipoMensaje ENUM('usuario', 'asistente') NOT NULL,
    contenido TEXT NOT NULL,
    metadatos JSON COMMENT 'Información adicional del mensaje',
    fechaEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idSesion) REFERENCES ChatSesiones(idSesion) ON DELETE CASCADE
);

-- =====================================
-- TABLA CONFIGURACIÓN SISTEMA
-- =====================================
CREATE TABLE IF NOT EXISTS Configuracion (
    idConfig INT AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(50) DEFAULT 'string',
    fechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    modificadoPor INT,
    FOREIGN KEY (modificadoPor) REFERENCES Usuarios(idUsuario)
);

-- =====================================
-- TABLA LOGS DE SISTEMA
-- =====================================
CREATE TABLE IF NOT EXISTS Logs (
    idLog INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NULL,
    accion VARCHAR(200) NOT NULL,
    tabla VARCHAR(100),
    registroId INT,
    datosAnteriores JSON,
    datosNuevos JSON,
    ipAddress VARCHAR(45),
    userAgent TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE SET NULL
);

-- =====================================
-- INSERTAR DATOS INICIALES
-- =====================================

-- Usuario Super Administrador inicial
INSERT INTO Usuarios (Nombre, Apellidos, email, password, rol, estado, verificado) VALUES
('Super', 'Administrador', 'superadmin@mawi.com', '$2b$12$8HqhOk9v4ePWqyNGhd8nKe8sDfvW3B7cD.wX5rF2vQ9nH8sJ6mP4.', 4, 'A', TRUE),
('Admin', 'Principal', 'admin@mawi.com', '$2b$12$8HqhOk9v4ePWqyNGhd8nKe8sDfvW3B7cD.wX5rF2vQ9nH8sJ6mP4.', 3, 'A', TRUE),
('Biomonitor', 'Demo', 'biomonitor@mawi.com', '$2b$12$8HqhOk9v4ePWqyNGhd8nKe8sDfvW3B7cD.wX5rF2vQ9nH8sJ6mP4.', 2, 'A', TRUE),
('Usuario', 'Demo', 'usuario@mawi.com', '$2b$12$8HqhOk9v4ePWqyNGhd8nKe8sDfvW3B7cD.wX5rF2vQ9nH8sJ6mP4.', 1, 'A', TRUE);

-- Configuraciones iniciales del sistema
INSERT INTO Configuracion (clave, valor, descripcion, tipo) VALUES
('app_name', 'MAWI - Monitoreo Ambiental Web Interactivo', 'Nombre de la aplicación', 'string'),
('app_version', '2.0.0', 'Versión actual de la aplicación', 'string'),
('maintenance_mode', 'false', 'Modo de mantenimiento', 'boolean'),
('registration_enabled', 'true', 'Permitir registros de nuevos usuarios', 'boolean'),
('ai_enabled', 'true', 'Funcionalidades de IA habilitadas', 'boolean'),
('max_file_size', '10485760', 'Tamaño máximo de archivo en bytes (10MB)', 'number'),
('allowed_file_types', 'jpg,jpeg,png,pdf,doc,docx', 'Tipos de archivo permitidos', 'string');

-- =====================================
-- CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================

CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_usuarios_rol ON Usuarios(rol);
CREATE INDEX idx_usuarios_estado ON Usuarios(estado);

CREATE INDEX idx_biomonitoreo_usuario ON Biomonitoreo(idUsuario);
CREATE INDEX idx_biomonitoreo_fecha ON Biomonitoreo(fechaMonitoreo);
CREATE INDEX idx_biomonitoreo_ubicacion ON Biomonitoreo(ubicacion);

CREATE INDEX idx_especies_biomo ON Especies(idBiomo);
CREATE INDEX idx_especies_nombre ON Especies(nombreCientifico);

CREATE INDEX idx_imagenes_biomo ON Imagenes(idBiomo);
CREATE INDEX idx_imagenes_usuario ON Imagenes(idUsuario);

CREATE INDEX idx_convocatorias_estado ON Convocatorias(estado);
CREATE INDEX idx_convocatorias_fechas ON Convocatorias(fechaInicio, fechaCierre);

CREATE INDEX idx_anteproyectos_convocatoria ON Anteproyectos(idConvocatoria);
CREATE INDEX idx_anteproyectos_usuario ON Anteproyectos(idUsuario);
CREATE INDEX idx_anteproyectos_estado ON Anteproyectos(estado);

-- =====================================
-- MOSTRAR RESUMEN DE CREACIÓN
-- =====================================
SELECT 'ESQUEMA MAWI CREADO EXITOSAMENTE' as RESULTADO;
SELECT COUNT(*) as USUARIOS_CREADOS FROM Usuarios;
SELECT COUNT(*) as CONFIGURACIONES_CREADAS FROM Configuracion;
