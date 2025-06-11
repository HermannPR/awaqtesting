-- =====================================
-- ACTUALIZAR CONTRASEÑAS FALTANTES CON BCRYPT
-- =====================================

USE mawi_db;

-- Biomonitor password: Bio2025!
-- Bcrypt hash: $2b$12$nEAfO6Ss6kGGi9KzDtSj5OJukScZWiCdaKyAQ2JrB1bw33WiRX0Li
UPDATE usuarios SET password = '$2b$12$nEAfO6Ss6kGGi9KzDtSj5OJukScZWiCdaKyAQ2JrB1bw33WiRX0Li' WHERE email = 'biomonitor@mawi.com';

-- Usuario password: User2025!
-- Bcrypt hash: $2b$12$mMeyk4bJ7XwnkF9QmuwvlOiABTSUG9GCiMF8VInCTV44mAZYUrnUS  
UPDATE usuarios SET password = '$2b$12$mMeyk4bJ7XwnkF9QmuwvlOiABTSUG9GCiMF8VInCTV44mAZYUrnUS' WHERE email = 'usuario@mawi.com';

-- Verificar las actualizaciones
SELECT email, LEFT(password, 30) as password_preview, LENGTH(password) as password_length 
FROM usuarios 
WHERE email IN ('superadmin@mawi.com', 'admin@mawi.com', 'biomonitor@mawi.com', 'usuario@mawi.com');

SELECT '=== PASSWORDS UPDATED SUCCESSFULLY ===' as status;
