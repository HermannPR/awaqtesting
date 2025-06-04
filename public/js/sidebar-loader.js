/**
 * Script para cargar la sidebar de forma dinámica
 * Incluir este script en páginas que necesiten sidebar
 */

(function() {
    'use strict';

    // Función para cargar la sidebar
    async function loadSidebar() {
        try {
            const response = await fetch('components/sidebar.html');
            if (!response.ok) {
                throw new Error('No se pudo cargar la sidebar');
            }
              const sidebarHTML = await response.text();
            
            // Buscar el contenedor donde insertar la sidebar
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = sidebarHTML;
                console.log('Sidebar cargada exitosamente');
                  // Disparar evento personalizado para notificar que la sidebar se cargó
                document.dispatchEvent(new CustomEvent('sidebarLoaded'));
                
                // Inicializar funcionalidad del toggle después de cargar la sidebar
                setTimeout(() => {
                    setActiveMenuItem();
                    initializeSidebarToggle();
                }, 100);
            } else {
                console.warn('Contenedor #sidebar-container no encontrado');
            }
            
        } catch (error) {
            console.error('Error cargando sidebar:', error);
            // Fallback: mostrar sidebar básica
            createFallbackSidebar();
        }
    }

    // Función de respaldo para crear sidebar básica
    function createFallbackSidebar() {        const sidebarContainer = document.getElementById('sidebar-container');
        if (!sidebarContainer) return;
        
        const fallbackHTML = `
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-toggle-btn" onclick="toggleSidebar()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <nav class="sidebar-nav">
                    <a href="dashboard.html" class="sidebar-item" data-page="dashboard">
                        <span class="sidebar-icon">🏠</span>
                        <span class="sidebar-text">Inicio</span>
                    </a>
                    <a href="biomo.html" class="sidebar-item" data-page="biomo">
                        <span class="sidebar-icon">🌿</span>
                        <span class="sidebar-text">Asistente de Mi Biomo</span>
                    </a>
                    <a href="explorador.html" class="sidebar-item" data-page="explorador">
                        <span class="sidebar-icon">📄</span>
                        <span class="sidebar-text">Asistente Explorador de Anteproyectos</span>
                    </a>
                    <a href="convocatorias.html" class="sidebar-item" data-page="convocatorias">
                        <span class="sidebar-icon">📋</span>
                        <span class="sidebar-text">Asistente de Convocatorias</span>
                    </a>
                    <a href="perfil.html" class="sidebar-item" data-page="perfil">
                        <span class="sidebar-icon">👤</span>
                        <span class="sidebar-text">Mi Perfil</span>
                    </a>
                </nav>
                <div class="sidebar-footer">
                    <a href="#" class="support-link">
                        <img src="support-icon.svg" alt="Soporte" />
                        <span class="sidebar-text">Contacta con el soporte</span>
                    </a>
                </div>
            </aside>
        `;
        
        sidebarContainer.innerHTML = fallbackHTML;
        console.log('Sidebar fallback creada');
    }

    // Función para marcar el elemento activo
    function setActiveMenuItem() {
        const currentPage = document.body.getAttribute('data-page');
        if (!currentPage) return;

        // Esperar un poco para que la sidebar se cargue
        setTimeout(() => {
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
                
                // Verificar si el href coincide con la página actual
                const href = item.getAttribute('href');
                if (href && href.includes(currentPage)) {
                    item.classList.add('active');
                }
            });
        }, 100);
    }    // Función para inicializar el toggle de la sidebar
    function initializeSidebarToggle() {
        const toggleButton = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const appContent = document.querySelector('.app-content');
        
        console.log('Initializing sidebar toggle...', {
            toggleButton: !!toggleButton,
            sidebar: !!sidebar,
            appContent: !!appContent
        });
        
        if (toggleButton && sidebar && appContent) {
            // Estado inicial - sidebar cerrada
            sidebar.classList.add('collapsed');
            appContent.classList.remove('with-sidebar');
            toggleButton.classList.add('collapsed');
            let isOpen = false;
            
            toggleButton.addEventListener('click', function() {
                console.log('Toggle clicked, current state:', isOpen);
                isOpen = !isOpen;
                
                if (isOpen) {
                    sidebar.classList.remove('collapsed');
                    appContent.classList.add('with-sidebar');
                    toggleButton.classList.remove('collapsed');
                    console.log('Sidebar opened');
                } else {
                    sidebar.classList.add('collapsed');
                    appContent.classList.remove('with-sidebar');
                    toggleButton.classList.add('collapsed');
                    console.log('Sidebar closed');
                }
            });
            
            console.log('Sidebar toggle initialized successfully');
        } else {
            console.warn('Toggle button or sidebar elements not found:', {
                toggleButton: !!toggleButton,
                sidebar: !!sidebar,
                appContent: !!appContent
            });
        }
    }// Cargar sidebar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSidebar);
    } else {
        loadSidebar();
    }

})();