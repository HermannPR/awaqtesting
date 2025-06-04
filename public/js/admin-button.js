/**
 * Script para agregar botón de administrador en sidebar de Mawi
 * Solo para usuarios con rol 3 (Admin) y rol 4 (Super Admin)
 * Incluir en: dashboard.html, biomo.html, explorador.html, convocatorias.html, perfil.html
 */

(function() {
    'use strict';

    // Función para verificar si el usuario es administrador
    function isAdmin() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userRole = payload.rol;
            
            // Verificar expiración del token
            const currentTime = Date.now() / 1000;
            if (payload.exp && payload.exp < currentTime) {
                return false;
            }

            // Solo rol 3 (Admin) y rol 4 (Super Admin)
            return userRole >= 3;
        } catch (error) {
            console.error('Error verificando rol de admin:', error);
            return false;
        }
    }

    // Función para obtener el tipo de administrador
    function getAdminType() {
        try {
            const token = localStorage.getItem('token');
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.rol;
        } catch (error) {
            return 3; // fallback a admin normal
        }
    }

    // Función para agregar botón de administrador
    function addAdminButton() {
        if (!isAdmin()) return;

        // Buscar la sidebar existente
        const sidebarNav = document.querySelector('.sidebar-nav');
        
        if (!sidebarNav) {
            console.warn('Sidebar no encontrada');
            return;
        }

        // Verificar si el botón ya existe para evitar duplicados
        if (document.getElementById('admin-return-btn')) return;

        // Crear separador
        const separator = document.createElement('div');
        separator.id = 'admin-separator';
        separator.style.cssText = `
            margin: 10px 20px;
            border-top: 1px solid #555;
            padding-top: 10px;
        `;

        // Crear botón de administrador
        const adminButton = document.createElement('a');
        adminButton.id = 'admin-return-btn';
        adminButton.href = '#';
        adminButton.className = 'sidebar-item';
        adminButton.style.cssText = `
            background-color: rgba(48, 160, 70, 0.1) !important;
            border-left: 3px solid #30a046;
            color: #30a046 !important;
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
        `;
        
        adminButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" 
                      stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Panel de Administrador
        `;

        // Evento click
        adminButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Verificar nuevamente que es admin antes de redirigir
            if (!isAdmin()) {
                alert('No tienes permisos de administrador');
                return;
            }

            // Redirigir según el tipo de administrador
            const adminType = getAdminType();
            if (adminType === 4) {
                window.location.href = 'indexSAdmin.html';
            } else {
                window.location.href = 'indexAdmin.html';
            }
        });

        // Agregar efectos hover
        adminButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(48, 160, 70, 0.2)';
        });
        
        adminButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(48, 160, 70, 0.1)';
        });

        // Insertar en la sidebar (al final de sidebarNav)
        sidebarNav.appendChild(separator);
        sidebarNav.appendChild(adminButton);

        console.log('Botón de administrador agregado a la sidebar');
    }

    // Función para remover botón de administrador
    function removeAdminButton() {
        const adminBtn = document.getElementById('admin-return-btn');
        const separator = document.getElementById('admin-separator');
        
        if (adminBtn) adminBtn.remove();
        if (separator) separator.remove();
        
        console.log('Botón de administrador removido');
    }    // Ejecutar cuando el DOM esté listo
    function initialize() {
        if (isAdmin()) {
            addAdminButton();
        }
    }

    // Escuchar el evento de sidebar cargada
    document.addEventListener('sidebarLoaded', function() {
        if (isAdmin()) {
            addAdminButton();
        }
    });

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Verificar periódicamente por cambios en autenticación
    setInterval(function() {
        const adminBtn = document.getElementById('admin-return-btn');
        
        if (adminBtn && !isAdmin()) {
            // Remover botón si ya no es admin o token expiró
            removeAdminButton();
        } else if (!adminBtn && isAdmin()) {
            // Agregar botón si se volvió admin
            addAdminButton();
        }
    }, 30000); // Verificar cada 30 segundos

})();
