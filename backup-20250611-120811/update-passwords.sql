-- Actualizar contraseñas de usuarios con hashes correctos
USE mawi_db;

UPDATE Usuarios SET password = '$2b$12$u0rFU4OjonUNVQkWPSMhfOitfD7.kjLtzvStabBW8Rj4qt9BRVI4u' WHERE email = 'superadmin@mawi.com';
UPDATE Usuarios SET password = '$2b$12$snRMjO8zVoQn7TW1mL2iYucz2bBXSlJYuA5WJP0oeIwGTeK7q1VAu' WHERE email = 'admin@mawi.com';
UPDATE Usuarios SET password = '$2b$12$z7wkyd6iIYt3pqRsxQ/8v.6jVNUP8RYxLMYFnatbld1g7XEjFCyWO' WHERE email = 'biomonitor@mawi.com';
UPDATE Usuarios SET password = '$2b$12$DDIQGQJmJyQo97d0O4HOyeTfysDY8ZABy7Ah3.6b9x1DoBVL04OYW' WHERE email = 'usuario@mawi.com';

SELECT 'CONTRASEÑAS ACTUALIZADAS CORRECTAMENTE' as RESULTADO;
SELECT email, rol, estado FROM Usuarios;
