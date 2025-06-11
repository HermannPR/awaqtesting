-- Datos de prueba para Dashboard de Estadísticas MAWI
USE mawi_db;

-- Insertar datos de biomonitoreo de prueba
INSERT INTO Biomonitoreo (idUsuario, titulo, descripcion, ubicacion, latitud, longitud, fechaMonitoreo, horaMonitoreo, tipoEcosistema, estadoConservacion, observaciones) VALUES
(1, 'Monitoreo Bosque Amazónico', 'Evaluación de biodiversidad en zona protegida', 'Reserva Nacional Tambopata, Perú', -12.838, -69.317, '2024-11-15', '08:30:00', 'Bosque Tropical', 'Bueno', 'Alta diversidad de especies observadas'),
(2, 'Estudio Ecosistema Marino', 'Monitoreo de arrecifes de coral', 'Parque Nacional Marino Ballena, Costa Rica', 9.146, -83.740, '2024-11-10', '06:00:00', 'Marino', 'Regular', 'Blanqueamiento parcial observado'),
(1, 'Censo Aves Migratorias', 'Conteo anual de aves en humedal', 'Humedal La Cocha, Colombia', 1.157, -77.167, '2024-10-28', '05:45:00', 'Humedal', 'Excelente', 'Registro de 45 especies diferentes'),
(3, 'Monitoreo Páramo', 'Evaluación del estado del páramo después de incendio', 'Páramo de Sumapaz, Colombia', 4.209, -74.110, '2024-10-15', '07:00:00', 'Páramo', 'Regular', 'Regeneración natural en proceso'),
(2, 'Estudio Manglar', 'Monitoreo de recuperación post-tsunami', 'Reserva de Manglares, Ecuador', -2.183, -79.900, '2024-09-22', '09:15:00', 'Manglar', 'Bueno', 'Recuperación exitosa observada');

-- Insertar especies de prueba
INSERT INTO Especies (idBiomo, nombreComun, nombreCientifico, reino, filo, clase, orden, familia, genero, especie, cantidad, estadoConservacion, endemismo) VALUES
(1, 'Jaguar', 'Panthera onca', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Panthera', 'onca', 2, 'Vulnerable', FALSE),
(1, 'Guacamayo Rojo', 'Ara macao', 'Animalia', 'Chordata', 'Aves', 'Psittaciformes', 'Psittacidae', 'Ara', 'macao', 8, 'Preocupación Menor', FALSE),
(1, 'Ceiba', 'Ceiba pentandra', 'Plantae', 'Streptophyta', 'Magnoliopsida', 'Malvales', 'Malvaceae', 'Ceiba', 'pentandra', 12, 'Preocupación Menor', FALSE),
(2, 'Tortuga Verde', 'Chelonia mydas', 'Animalia', 'Chordata', 'Reptilia', 'Testudines', 'Cheloniidae', 'Chelonia', 'mydas', 3, 'En Peligro', FALSE),
(2, 'Coral Cerebro', 'Diploria labyrinthiformis', 'Animalia', 'Cnidaria', 'Anthozoa', 'Scleractinia', 'Mussidae', 'Diploria', 'labyrinthiformis', 15, 'Vulnerable', FALSE),
(3, 'Colibrí Chupasavia', 'Sappho sparganurus', 'Animalia', 'Chordata', 'Aves', 'Apodiformes', 'Trochilidae', 'Sappho', 'sparganurus', 6, 'Preocupación Menor', TRUE),
(3, 'Aliso de Montaña', 'Alnus acuminata', 'Plantae', 'Streptophyta', 'Magnoliopsida', 'Fagales', 'Betulaceae', 'Alnus', 'acuminata', 25, 'Preocupación Menor', FALSE),
(4, 'Frailejón', 'Espeletia grandiflora', 'Plantae', 'Streptophyta', 'Magnoliopsida', 'Asterales', 'Asteraceae', 'Espeletia', 'grandiflora', 180, 'Vulnerable', TRUE),
(4, 'Oso Andino', 'Tremarctos ornatus', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Ursidae', 'Tremarctos', 'ornatus', 1, 'Vulnerable', TRUE),
(5, 'Mangle Rojo', 'Rhizophora mangle', 'Plantae', 'Streptophyta', 'Magnoliopsida', 'Malpighiales', 'Rhizophoraceae', 'Rhizophora', 'mangle', 45, 'Preocupación Menor', FALSE);

-- Insertar convocatorias de prueba
INSERT INTO Convocatorias (titulo, descripcion, objetivos, presupuesto, fechaInicio, fechaCierre, organizacionConvocante, estado, creadoPor) VALUES
('Conservación de Biodiversidad Marina 2025', 'Proyecto para la protección de ecosistemas marinos en el Pacífico', 'Establecer áreas marinas protegidas y monitorear especies en peligro', 500000.00, '2024-01-15', '2024-12-31', 'Ministerio de Ambiente', 'A', 4),
('Restauración de Bosques Nativos', 'Iniciativa de reforestación con especies nativas', 'Restaurar 1000 hectáreas de bosque nativo degradado', 350000.00, '2024-03-01', '2025-02-28', 'ONG Verde Futuro', 'A', 4),
('Monitoreo Cambio Climático Páramos', 'Estudio del impacto del cambio climático en páramos andinos', 'Evaluar vulnerabilidad y proponer medidas de adaptación', 250000.00, '2024-06-01', '2024-11-30', 'Universidad Nacional', 'C', 4);

-- Insertar anteproyectos de prueba
INSERT INTO Anteproyectos (idConvocatoria, idUsuario, titulo, resumenEjecutivo, objetivoGeneral, presupuesto, estado) VALUES
(1, 1, 'Santuario Marino Golfo de Tribugá', 'Propuesta para crear área marina protegida en el Pacífico colombiano', 'Establecer un santuario marino de 50,000 hectáreas', 75000.00, 'E'),
(1, 2, 'Red de Monitoreo Tortuga Carey', 'Sistema de seguimiento satelital para tortugas marinas', 'Implementar tecnología de rastreo para conservación', 45000.00, 'A'),
(2, 1, 'Corredor Biológico Andino', 'Conexión de fragmentos boscosos mediante corredores', 'Restaurar conectividad ecológica en 500 hectáreas', 120000.00, 'R'),
(2, 3, 'Vivero Comunitario Especies Nativas', 'Establecimiento de vivero para producción masiva', 'Producir 100,000 plántulas anuales de especies nativas', 35000.00, 'E'),
(3, 2, 'Estaciones Meteorológicas Páramo', 'Red de monitoreo climático en alta montaña', 'Instalar 20 estaciones automáticas de monitoreo', 80000.00, 'B');

-- Insertar imágenes de prueba
INSERT INTO Imagenes (idBiomo, idUsuario, nombreArchivo, rutaArchivo, tipoArchivo, descripcion, fechaCaptura) VALUES
(1, 1, 'jaguar_sendero.jpg', '/uploads/biomonitoreo/1/jaguar_sendero.jpg', 'image/jpeg', 'Jaguar adulto observado en sendero principal', '2024-11-15 08:45:00'),
(1, 1, 'guacamayos_canopy.jpg', '/uploads/biomonitoreo/1/guacamayos_canopy.jpg', 'image/jpeg', 'Pareja de guacamayos en dosel del bosque', '2024-11-15 09:30:00'),
(2, 2, 'tortuga_anidacion.jpg', '/uploads/biomonitoreo/2/tortuga_anidacion.jpg', 'image/jpeg', 'Tortuga verde durante proceso de anidación', '2024-11-10 06:20:00'),
(3, 1, 'colibri_alimentacion.jpg', '/uploads/biomonitoreo/3/colibri_alimentacion.jpg', 'image/jpeg', 'Colibrí chupasavia alimentándose', '2024-10-28 07:15:00'),
(4, 3, 'frailejon_regeneracion.jpg', '/uploads/biomonitoreo/4/frailejon_regeneracion.jpg', 'image/jpeg', 'Frailejones en proceso de regeneración', '2024-10-15 08:00:00');

-- Actualizar fechas para que sean más recientes y generen mejor actividad
UPDATE Biomonitoreo SET fechaCreacion = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 90) DAY);
UPDATE Anteproyectos SET fechaCreacion = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 60) DAY);
UPDATE Usuarios SET fechaRegistro = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 120) DAY);

-- Verificar datos insertados
SELECT 'DATOS DE PRUEBA INSERTADOS CORRECTAMENTE' as RESULTADO;
SELECT 
    (SELECT COUNT(*) FROM Biomonitoreo) as total_biomonitoreos,
    (SELECT COUNT(*) FROM Especies) as total_especies,
    (SELECT COUNT(*) FROM Convocatorias) as total_convocatorias,
    (SELECT COUNT(*) FROM Anteproyectos) as total_anteproyectos,
    (SELECT COUNT(*) FROM Imagenes) as total_imagenes;
