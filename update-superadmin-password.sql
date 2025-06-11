-- Actualizar contraseña del Super Admin
USE mawi_db;

-- Actualizar la contraseña del super admin con el nuevo hash
UPDATE Usuarios 
SET password = '$2b$12$6Y4zR8LDRRip4VQcm.X8X.MUUwNAlISGK3N7nI1hQSNuxwK2QfWqi' 
WHERE email = 'superadmin@mawi.com';

-- Verificar la actualización
SELECT idUsuario, Nombre, email, rol, estado, 
       LEFT(password, 20) as password_preview
FROM Usuarios 
WHERE email = 'superadmin@mawi.com';
