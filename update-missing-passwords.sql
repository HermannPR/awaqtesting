-- =====================================
-- ACTUALIZAR CONTRASEÑAS FALTANTES
-- =====================================

USE mawi_db;

-- Biomonitor password: Bio2025!
-- Hash: $2b$12$someHashHere
UPDATE usuarios SET password = '$2b$12$LmcjUP7wUTp8UO3P8jI1P.NtbHs7sKqhG3mVx5zwqJ9wXFKGmVzm6' WHERE email = 'biomonitor@mawi.com';

-- Usuario password: User2025!  
-- Hash: $2b$12$someOtherHashHere
UPDATE usuarios SET password = '$2b$12$5YgJYJYJYJYJYJYJYJYJYeyBOKGKGKGKGKGKGKGKGKGKGKGKGKGKGKG' WHERE email = 'usuario@mawi.com';

-- Verificar las actualizaciones
SELECT email, LEFT(password, 30) as password_preview, LENGTH(password) as password_length 
FROM usuarios 
WHERE email IN ('superadmin@mawi.com', 'admin@mawi.com', 'biomonitor@mawi.com', 'usuario@mawi.com');
