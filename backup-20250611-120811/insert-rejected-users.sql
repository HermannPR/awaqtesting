-- Insertar usuarios de prueba con estado rechazado
-- Para probar la funcionalidad de usuarios rechazados

USE mawi_db;

-- Insertar usuarios rechazados (estado = 'I')
INSERT INTO Usuarios (Nombre, Apellidos, email, password, telefono, organizacion, ubicacion, rol, estado, fechaRegistro) VALUES
('Carlos', 'Mendoza', 'carlos.mendoza@test.com', '$2b$10$example.hash.here', '555-0123', 'Universidad Test', 'Ciudad de México', 1, 'I', '2025-06-10 10:00:00'),
('Ana', 'García', 'ana.garcia@test.com', '$2b$10$example.hash.here', '555-0124', 'Instituto Nacional', 'Guadalajara', 2, 'I', '2025-06-09 15:30:00'),
('Roberto', 'Silva', 'roberto.silva@test.com', '$2b$10$example.hash.here', '555-0125', 'Centro de Investigación', 'Monterrey', 1, 'I', '2025-06-08 09:15:00');

-- Insertar algunos usuarios pendientes adicionales
INSERT INTO Usuarios (Nombre, Apellidos, email, password, telefono, organizacion, ubicacion, rol, estado, fechaRegistro) VALUES
('María', 'López', 'maria.lopez@test.com', '$2b$10$example.hash.here', '555-0126', 'Universidad Nacional', 'Puebla', 2, 'P', '2025-06-11 08:00:00'),
('Pedro', 'Ramírez', 'pedro.ramirez@test.com', '$2b$10$example.hash.here', '555-0127', 'Instituto Tecnológico', 'Tijuana', 1, 'P', '2025-06-11 09:30:00');

-- Actualizar contraseñas con hash real para que puedan hacer login
UPDATE Usuarios SET password = '$2b$10$rKz8fYGdGGfOYr8nJOKk7uuUY7bCgS0xzGKMoXOXhwvfZIZUBq1QK' WHERE email IN (
    'carlos.mendoza@test.com',
    'ana.garcia@test.com', 
    'roberto.silva@test.com',
    'maria.lopez@test.com',
    'pedro.ramirez@test.com'
);

-- Verificar que se insertaron correctamente
SELECT idUsuario, Nombre, Apellidos, email, rol, estado, fechaRegistro 
FROM Usuarios 
WHERE estado IN ('I', 'P') 
ORDER BY fechaRegistro DESC;
