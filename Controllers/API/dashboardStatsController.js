// API Controller para Dashboard de Estadísticas MAWI
const mysql = require('../../Datasource/MySQLMngr');

/**
 * Obtener estadísticas generales del sistema
 */
async function getGeneralStats(req, res) {
    try {
        console.log('📊 Obteniendo estadísticas generales...');

        // Estadísticas de usuarios por rol
        const usersQuery = `
            SELECT 
                rol,
                COUNT(*) as cantidad,
                CASE 
                    WHEN rol = 1 THEN 'Usuarios'
                    WHEN rol = 2 THEN 'Biomonitores'
                    WHEN rol = 3 THEN 'Administradores'
                    WHEN rol = 4 THEN 'Super Administradores'
                    ELSE 'Otros'
                END as tipo_usuario,
                CASE 
                    WHEN rol = 1 THEN '#28a745'
                    WHEN rol = 2 THEN '#17a2b8'
                    WHEN rol = 3 THEN '#ffc107'
                    WHEN rol = 4 THEN '#dc3545'
                    ELSE '#6c757d'
                END as color
            FROM Usuarios 
            WHERE estado = 'A'
            GROUP BY rol
            ORDER BY rol
        `;

        // Estadísticas de biomonitoreo
        const biomoQuery = `
            SELECT 
                COUNT(*) as total_biomos,
                COUNT(DISTINCT idUsuario) as usuarios_activos,
                MONTH(fechaMonitoreo) as mes,
                YEAR(fechaMonitoreo) as anio
            FROM Biomonitoreo 
            WHERE estado = 'A'
            AND fechaMonitoreo >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY YEAR(fechaMonitoreo), MONTH(fechaMonitoreo)
            ORDER BY anio DESC, mes DESC
            LIMIT 12
        `;

        // Estadísticas de anteproyectos
        const proyectosQuery = `
            SELECT 
                estado,
                COUNT(*) as cantidad,
                CASE 
                    WHEN estado = 'B' THEN 'Borrador'
                    WHEN estado = 'E' THEN 'Enviado'
                    WHEN estado = 'R' THEN 'En Revisión'
                    WHEN estado = 'A' THEN 'Aprobado'
                    WHEN estado = 'X' THEN 'Rechazado'
                    ELSE 'Otros'
                END as estado_nombre,
                CASE 
                    WHEN estado = 'B' THEN '#6c757d'
                    WHEN estado = 'E' THEN '#17a2b8'
                    WHEN estado = 'R' THEN '#ffc107'
                    WHEN estado = 'A' THEN '#28a745'
                    WHEN estado = 'X' THEN '#dc3545'
                    ELSE '#6c757d'
                END as color
            FROM Anteproyectos 
            GROUP BY estado
            ORDER BY cantidad DESC
        `;

        // Estadísticas de especies por reino
        const especiesQuery = `
            SELECT 
                COALESCE(reino, 'No Clasificado') as reino,
                COUNT(*) as cantidad,
                CASE 
                    WHEN reino = 'Animalia' THEN '#FF6B35'
                    WHEN reino = 'Plantae' THEN '#28a745'
                    WHEN reino = 'Fungi' THEN '#6f42c1'
                    WHEN reino = 'Bacteria' THEN '#17a2b8'
                    WHEN reino = 'Protista' THEN '#ffc107'
                    ELSE '#6c757d'
                END as color
            FROM Especies 
            GROUP BY reino
            ORDER BY cantidad DESC
        `;        // Resumen general
        const resumenQuery = `
            SELECT 
                (SELECT COUNT(*) FROM Usuarios WHERE estado = 'A') as total_usuarios,
                (SELECT COUNT(*) FROM Usuarios WHERE estado = 'P') as usuarios_pendientes,
                (SELECT COUNT(*) FROM Usuarios WHERE estado = 'I') as usuarios_rechazados,
                (SELECT COUNT(*) FROM Biomonitoreo WHERE estado = 'A') as total_biomos,
                (SELECT COUNT(*) FROM Anteproyectos) as total_proyectos,
                (SELECT COUNT(*) FROM Convocatorias WHERE estado = 'A') as total_convocatorias,
                (SELECT COUNT(*) FROM Especies) as total_especies,
                (SELECT COUNT(*) FROM Imagenes WHERE estado = 'A') as total_imagenes
        `;

        // Ejecutar todas las consultas
        const [usuarios, biomonitoreo, proyectos, especies, resumen] = await Promise.all([
            mysql.getData(usersQuery),
            mysql.getData(biomoQuery),
            mysql.getData(proyectosQuery),
            mysql.getData(especiesQuery),
            mysql.getData(resumenQuery)
        ]);

        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            data: {
                resumen: resumen.getRows()[0] || {},
                usuarios: usuarios.getRows() || [],
                biomonitoreo: biomonitoreo.getRows() || [],
                proyectos: proyectos.getRows() || [],
                especies: especies.getRows() || []
            }
        };

        console.log('✅ Estadísticas obtenidas exitosamente');
        res.status(200).json(response);

    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
}

/**
 * Obtener estadísticas de actividad reciente
 */
async function getRecentActivity(req, res) {
    try {
        console.log('🔄 Obteniendo actividad reciente...');

        const activityQuery = `
            SELECT 
                'biomonitoreo' as tipo,
                b.titulo as titulo,
                u.Nombre as usuario,
                b.fechaCreacion as fecha,
                b.ubicacion as detalle
            FROM Biomonitoreo b
            JOIN Usuarios u ON b.idUsuario = u.idUsuario
            WHERE b.estado = 'A'
            UNION ALL
            SELECT 
                'anteproyecto' as tipo,
                a.titulo as titulo,
                u.Nombre as usuario,
                a.fechaCreacion as fecha,
                CONCAT('Estado: ', a.estado) as detalle
            FROM Anteproyectos a
            JOIN Usuarios u ON a.idUsuario = u.idUsuario
            UNION ALL
            SELECT 
                'usuario' as tipo,
                CONCAT(u.Nombre, ' ', u.Apellidos) as titulo,
                'Sistema' as usuario,
                u.fechaRegistro as fecha,
                CONCAT('Rol: ', u.rol) as detalle
            FROM Usuarios u
            WHERE u.estado = 'A'
            ORDER BY fecha DESC
            LIMIT 20
        `;

        const activity = await mysql.getData(activityQuery);

        res.status(200).json({
            success: true,
            data: activity.getRows() || []
        });

    } catch (error) {
        console.error('❌ Error obteniendo actividad reciente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
}

/**
 * Obtener estadísticas por período de tiempo
 */
async function getTimeSeriesStats(req, res) {
    try {
        const { period = '12m', type = 'biomonitoreo' } = req.query;
        
        console.log(`📈 Obteniendo estadísticas de ${type} para período ${period}...`);
        
        let dateFilter = '';
        switch(period) {
            case '7d':
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
                break;
            case '30d':
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
                break;
            case '12m':
            default:
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 12 MONTH)';
                break;
        }

        let query = '';
        if (type === 'biomonitoreo') {
            query = `
                SELECT 
                    DATE(fechaMonitoreo) as fecha,
                    COUNT(*) as cantidad
                FROM Biomonitoreo 
                WHERE estado = 'A' 
                AND fechaMonitoreo >= ${dateFilter}
                GROUP BY DATE(fechaMonitoreo)
                ORDER BY fecha DESC
                LIMIT 100
            `;
        } else if (type === 'usuarios') {
            query = `
                SELECT 
                    DATE(fechaRegistro) as fecha,
                    COUNT(*) as cantidad
                FROM Usuarios 
                WHERE estado = 'A' 
                AND fechaRegistro >= ${dateFilter}
                GROUP BY DATE(fechaRegistro)
                ORDER BY fecha DESC
                LIMIT 100
            `;
        }

        const results = await mysql.getData(query);

        res.status(200).json({
            success: true,
            data: results.getRows() || []
        });

    } catch (error) {
        console.error('❌ Error obteniendo estadísticas de series de tiempo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
}

/**
 * Obtener estadísticas de actividad del sistema
 */
async function getActivityStats(req, res) {
    try {
        console.log('🔄 Obteniendo estadísticas de actividad...');

        // Actividad reciente del sistema (mock data por ahora)
        const mockActivities = [
            {
                tipo: 'usuario',
                titulo: 'Nuevo usuario registrado',
                descripcion: 'Usuario se registró como biomonitor',
                timestamp: new Date(Date.now() - 300000) // 5 minutes ago
            },
            {
                tipo: 'biomonitoreo',
                titulo: 'Nuevo biomonitoreo enviado',
                descripcion: 'Registro de especies en área protegida',
                timestamp: new Date(Date.now() - 900000) // 15 minutes ago
            },
            {
                tipo: 'sistema',
                titulo: 'Backup completado',
                descripcion: 'Respaldo automático del sistema ejecutado exitosamente',
                timestamp: new Date(Date.now() - 3600000) // 1 hour ago
            },
            {
                tipo: 'anteproyecto',
                titulo: 'Nuevo anteproyecto enviado',
                descripcion: 'Propuesta de investigación ambiental recibida',
                timestamp: new Date(Date.now() - 7200000) // 2 hours ago
            }
        ];

        res.json(mockActivities);
    } catch (error) {
        console.error('❌ Error en getActivityStats:', error);
        res.status(500).json({ 
            error: 'Error al obtener estadísticas de actividad',
            details: error.message 
        });
    }
}

/**
 * Obtener usuarios pendientes de aprobación
 */
async function getPendingUsers(req, res) {
    try {
        console.log('👥 Obteniendo usuarios pendientes...');

        // Query para obtener usuarios pendientes
        const pendingQuery = `
            SELECT COUNT(*) as count
            FROM Usuarios 
            WHERE estado = 'P'
        `;

        const result = await mysql.getDataWithParams(pendingQuery, []);
        
        if (result.getStatus()) {
            const count = result.getRows()[0]?.count || 0;
            res.json({ count: count });
        } else {
            throw new Error('Error al obtener usuarios pendientes');
        }
    } catch (error) {
        console.error('❌ Error en getPendingUsers:', error);
        res.status(500).json({ 
            error: 'Error al obtener usuarios pendientes',
            details: error.message 
        });
    }
}

/**
 * Aprobar todos los usuarios pendientes
 */
async function approveAllUsers(req, res) {
    try {
        console.log('✅ Aprobando todos los usuarios pendientes...');

        // Query para aprobar todos los usuarios pendientes
        const approveQuery = `
            UPDATE Usuarios 
            SET estado = 'A' 
            WHERE estado = 'P'
        `;

        const result = await mysql.updateData(approveQuery, []);
        
        if (result.getStatus()) {
            const affected = result.getRows();
            console.log(`✅ ${affected} usuarios aprobados`);
            res.json({ 
                status: 'success',
                message: `${affected} usuarios aprobados exitosamente`,
                approved: affected
            });
        } else {
            throw new Error('Error al aprobar usuarios');
        }
    } catch (error) {
        console.error('❌ Error en approveAllUsers:', error);
        res.status(500).json({ 
            error: 'Error al aprobar usuarios',
            details: error.message 
        });
    }
}

/**
 * Obtener perfil del usuario actual
 */
async function getUserProfile(req, res) {
    try {
        console.log('👤 Obteniendo perfil de usuario...');

        const userId = req.user.id;
        
        const profileQuery = `
            SELECT idUsuario, nombre, apellidos, email, rol, estado, fechaRegistro
            FROM Usuarios 
            WHERE idUsuario = ?
        `;

        const result = await mysql.getDataWithParams(profileQuery, [userId]);
        
        if (result.getStatus() && result.getRows().length > 0) {
            const user = result.getRows()[0];
            res.json({
                id: user.idUsuario,
                nombre: user.nombre + ' ' + (user.apellidos || ''),
                email: user.email,
                rol: user.rol,
                estado: user.estado,
                fechaRegistro: user.fechaRegistro
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('❌ Error en getUserProfile:', error);
        res.status(500).json({ 
            error: 'Error al obtener perfil de usuario',
            details: error.message 
        });
    }
}

/**
 * Obtener estadísticas específicas para el panel de Super Admin
 */
async function getSuperAdminStats(req, res) {
    try {
        console.log('📊 Obteniendo estadísticas de Super Admin...');

        // Consulta para obtener todas las estadísticas de super admin
        const statsQuery = `
            SELECT 
                (SELECT COUNT(*) FROM Usuarios WHERE estado = 'P') as usuariosPendientes,
                (SELECT COUNT(*) FROM Usuarios WHERE estado = 'A') as usuariosActivos,
                (SELECT COUNT(*) FROM Usuarios WHERE estado = 'I') as usuariosRechazados,
                (SELECT COUNT(*) FROM Biomonitoreo WHERE estado = 'A') as biomonitoreos,
                (SELECT COUNT(*) FROM Anteproyectos) as anteproyectos,
                (SELECT COUNT(*) FROM Convocatorias WHERE estado = 'A') as convocatorias,
                (SELECT COUNT(*) FROM Especies) as especies,
                (SELECT COUNT(*) FROM Imagenes WHERE estado = 'A') as imagenes,
                (SELECT COUNT(*) FROM Usuarios) as totalUsuarios,
                (SELECT COUNT(*) FROM Biomonitoreo) + (SELECT COUNT(*) FROM Anteproyectos) + (SELECT COUNT(*) FROM Convocatorias) as totalRegistros
        `;

        const result = await mysql.getData(statsQuery);
        const stats = result.getRows()[0] || {};

        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            data: {
                usuariosPendientes: stats.usuariosPendientes || 0,
                usuariosActivos: stats.usuariosActivos || 0,
                usuariosRechazados: stats.usuariosRechazados || 0,
                biomonitoreos: stats.biomonitoreos || 0,
                anteproyectos: stats.anteproyectos || 0,
                convocatorias: stats.convocatorias || 0,
                especies: stats.especies || 0,
                imagenes: stats.imagenes || 0,
                totalUsuarios: stats.totalUsuarios || 0,
                totalRegistros: stats.totalRegistros || 0,
                estadoSistema: '🟢',
                ultimoBackup: new Date().toLocaleDateString()
            }
        };

        console.log('✅ Estadísticas de Super Admin obtenidas exitosamente');
        res.status(200).json(response);

    } catch (error) {
        console.error('❌ Error obteniendo estadísticas de Super Admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
}

module.exports = {
    getGeneralStats,
    getRecentActivity,
    getTimeSeriesStats,
    getActivityStats,
    getPendingUsers,
    approveAllUsers,
    getUserProfile,
    getSuperAdminStats
};
