/**
 * MAWI Super Admin Dashboard JavaScript
 * Handles super admin functionality, statistics, and system management
 */

class SuperAdminDashboard {
    constructor() {
        this.apiBase = '/Consultas/api';
        this.token = localStorage.getItem('token');
        this.refreshInterval = null;
        
        this.init();
    }

    init() {
        this.loadSidebar();
        this.setupSidebarToggle();
        this.loadSystemStats();
        this.loadUserInfo();
        this.setupAutoRefresh();
        this.checkSystemStatus();
    }

    // Load sidebar component
    async loadSidebar() {
        try {
            const response = await fetch('components/admin-sidebar.html');
            const sidebarHtml = await response.text();
            document.getElementById('sidebar-container').innerHTML = sidebarHtml;
            
            // Set active menu item for super admin
            setTimeout(() => {
                const menuItems = document.querySelectorAll('.menu-item');
                menuItems.forEach(item => {
                    if (item.href && item.href.includes('indexSAdmin.html')) {
                        item.classList.add('active');
                    }
                });
            }, 100);
        } catch (error) {
            console.error('Error loading sidebar:', error);
        }
    }

    // Setup sidebar toggle functionality
    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.admin-sidebar');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                if (sidebar) {
                    sidebar.classList.toggle('expanded');
                    sidebarToggle.classList.toggle('sidebar-open');
                }
            });
        }
    }

    // Load system statistics
    async loadSystemStats() {
        try {
            if (!this.token) {
                window.location.href = 'login.html';
                return;
            }

            // Load general stats
            const response = await fetch(`${this.apiBase}/stats/general`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const stats = await response.json();
                this.displayStats(stats);
            } else {
                console.error('Failed to load stats');
                this.displayDefaultStats();
            }

            // Load user counts
            await this.loadUserCounts();

        } catch (error) {
            console.error('Error loading system stats:', error);
            this.displayDefaultStats();
        }
    }

    // Load user counts for pending and rejected users
    async loadUserCounts() {
        try {
            // Get pending users count
            const pendingResponse = await fetch(`${this.apiBase}/admin/users/pendingCount`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (pendingResponse.ok) {
                const pendingData = await pendingResponse.json();
                const pendingCount = pendingData.count || 0;
                
                this.updateElement('pendingUsers', pendingCount);
                this.updateElement('pendingCount', pendingCount);
                
                // Update status message
                const pendingChange = document.getElementById('pendingChange');
                if (pendingChange) {
                    pendingChange.textContent = pendingCount > 0 ? 'Requieren aprobación' : 'Ninguno pendiente';
                }
            }

            // Get rejected users count
            const rejectedResponse = await fetch(`${this.apiBase}/admin/users/rechazadosCount`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (rejectedResponse.ok) {
                const rejectedData = await rejectedResponse.json();
                const rejectedCount = rejectedData.count || 0;
                
                this.updateElement('rejectedUsers', rejectedCount);
                this.updateElement('rejectedCount', rejectedCount);
                
                // Update status message
                const rejectedChange = document.getElementById('rejectedChange');
                if (rejectedChange) {
                    rejectedChange.textContent = rejectedCount > 0 ? 'Para revisar' : 'Ninguno rechazado';
                }
            }

        } catch (error) {
            console.error('Error loading user counts:', error);
        }
    }

    // Display statistics on the dashboard
    displayStats(stats) {
        if (stats.usuarios) {
            this.updateElement('totalUsers', stats.usuarios.total || 0);
            this.updateElement('activeUsers', stats.usuarios.activos || 0);
            
            const usersChange = document.getElementById('usersChange');
            if (usersChange) {
                usersChange.textContent = `${stats.usuarios.activos || 0} activos`;
            }
        }

        if (stats.biomonitoreo) {
            this.updateElement('totalBiomonitoreos', stats.biomonitoreo.total || 0);
        }

        if (stats.anteproyectos) {
            this.updateElement('totalProjectsCount', stats.anteproyectos.total || 0);
        }

        if (stats.especies) {
            this.updateElement('totalSpeciesCount', stats.especies.total || 0);
        }
    }

    // Display default stats when API fails
    displayDefaultStats() {
        this.updateElement('totalUsers', '--');
        this.updateElement('pendingUsers', '--');
        this.updateElement('rejectedUsers', '--');
        this.updateElement('totalBiomonitoreos', '--');
        this.updateElement('activeUsers', '--');
        this.updateElement('totalProjectsCount', '--');
        this.updateElement('totalSpeciesCount', '--');
    }

    // Utility function to update element content safely
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // Load user information
    async loadUserInfo() {
        try {
            if (!this.token) return;

            // Set default super admin info
            this.updateElement('userName', 'Super Admin');
            this.updateElement('userRole', 'Sistema');
            this.updateElement('userAvatar', 'SA');

        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }

    // Check system status
    async checkSystemStatus() {
        try {
            const response = await fetch('/health');
            const statusIndicator = document.getElementById('systemStatus');
            const dbStatus = document.getElementById('dbStatus');
            const apiStatus = document.getElementById('apiStatus');
            const storageStatus = document.getElementById('storageStatus');

            if (response.ok) {
                if (statusIndicator) {
                    statusIndicator.innerHTML = `
                        <span class="status-dot status-online"></span>
                        <span class="status-text">Sistema Online</span>
                    `;
                }
                this.updateElement('dbStatus', 'Conectada');
                this.updateElement('apiStatus', 'Operacional');
                this.updateElement('storageStatus', 'Normal');
            } else {
                throw new Error('System check failed');
            }

        } catch (error) {
            const statusIndicator = document.getElementById('systemStatus');
            if (statusIndicator) {
                statusIndicator.innerHTML = `
                    <span class="status-dot status-error"></span>
                    <span class="status-text">Sistema con problemas</span>
                `;
            }
            this.updateElement('dbStatus', 'Error');
            this.updateElement('apiStatus', 'Error');
            this.updateElement('storageStatus', 'Error');
        }
    }

    // Setup auto-refresh for real-time data
    setupAutoRefresh() {
        // Refresh stats every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadSystemStats();
            this.checkSystemStatus();
        }, 30000);
    }

    // Cleanup when leaving page
    cleanup() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Initialize dashboard when DOM is loaded
function initializeSuperAdminDashboard() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SuperAdminDashboard();
        });
    } else {
        new SuperAdminDashboard();
    }
}

// Function to load system stats (called from HTML)
function loadSystemStats() {
    if (window.superAdminDashboard) {
        window.superAdminDashboard.loadSystemStats();
    }
}

// Create global instance
window.superAdminDashboard = null;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    window.superAdminDashboard = new SuperAdminDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.superAdminDashboard) {
        window.superAdminDashboard.cleanup();
    }
});
