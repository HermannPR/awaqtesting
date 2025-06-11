# 🧪 MAWI Development Testing Tool

## Overview
The `dev-testing.html` file is a comprehensive testing interface designed for developers working on the MAWI (Monitoreo Ambiental Web Interactivo) project. It provides an easy-to-use interface for testing various APIs, authentication flows, and system functionality.

## Features

### 🔐 Authentication Testing
- **Login Testing**: Test login with predefined credentials for all user types
- **Auto-Testing**: Automatically test all user types in sequence
- **Invalid Login Testing**: Test invalid credentials to ensure proper error handling
- **Token Management**: View, validate, and clear JWT tokens

#### Predefined Test Credentials
- **Super Admin**: superadmin@mawi.com / SuperAdmin2025!
- **Admin**: admin@mawi.com / Admin2025!
- **Biomonitor**: biomonitor@mawi.com / Bio2025!
- **Regular User**: usuario@mawi.com / User2025!

### 🔌 API Testing
- **Dashboard APIs**: Test all dashboard statistics endpoints
- **User Management APIs**: Test user management and administration endpoints
- **Comprehensive Testing**: Test all API endpoints in sequence
- **Health Check**: Perform complete system health checks

#### Tested Endpoints
```
Authentication:
- POST /api/users/login

Dashboard Stats:
- GET /api/stats/general
- GET /api/stats/activity  
- GET /api/stats/timeseries
- GET /api/stats/superadmin

User Management:
- GET /api/admin/users/pending
- GET /api/admin/users/rechazados
- GET /api/admin/users/pendingCount
- GET /api/admin/users/rechazadosCount

Server Health:
- GET /health
```

### 📊 Real-time Monitoring
- **Continuous Monitoring**: Monitor server status every 3 seconds
- **Uptime Tracking**: Calculate system uptime percentage
- **Response Time Tracking**: Monitor API response times
- **Statistics**: Track successful vs failed requests

### 🛠️ Server & Database Testing
- **Server Connection**: Test basic server connectivity
- **Database Connection**: Verify database connectivity
- **Server Status**: Real-time server status indicators

## How to Use

### 1. Open the Testing Tool
```
http://localhost:5000/dev-testing.html
```
or open the file directly in your browser.

### 2. Login Testing
1. Click any of the "Quick Fill" buttons to populate credentials
2. Click "🔑 Test Login" to authenticate
3. Or use "Test Todos los Usuarios" for automated testing

### 3. API Testing
1. Ensure you're logged in (green token status)
2. Use the API testing buttons to test specific endpoints
3. View detailed results in the JSON output areas

### 4. Real-time Monitoring
1. Click "▶️ Iniciar Monitoreo" to start continuous monitoring
2. View real-time uptime statistics and response times
3. Click "⏹️ Detener Monitoreo" to stop

### 5. Health Checks
1. Use "💚 Health Check Completo" for comprehensive system analysis
2. View detailed health reports including server, database, and API status

## Configuration

### API Base URL
The tool is configured to use:
```javascript
const API_BASE = 'http://localhost:5000/Consultas/api';
```

### Token Storage
JWT tokens are automatically stored in `localStorage` for persistent testing sessions.

## Output and Results

### Status Indicators
- 🟢 **Green**: Success/Online
- 🔴 **Red**: Error/Offline  
- 🟡 **Yellow**: Loading/Warning

### JSON Results
All API responses are displayed in formatted JSON for easy debugging and analysis.

### Monitoring Data
Real-time monitoring provides:
- Uptime percentage
- Average response time
- Total number of checks
- Success/failure statistics

## Developer Benefits

### Quick Testing
- No need to manually input credentials
- One-click testing of all user types
- Automated API endpoint testing

### Debugging
- Detailed error messages and status codes
- Complete request/response data
- Token validation and management

### Monitoring
- Real-time system health monitoring
- Performance metrics tracking
- Continuous uptime monitoring

### Documentation
- Visual interface for API exploration
- Clear status indicators
- Comprehensive result reporting

## Technical Details

### Built With
- **HTML5**: Modern semantic markup
- **CSS3**: Responsive design with orange theme (#FF6B35)
- **Vanilla JavaScript**: No external dependencies
- **Fetch API**: Modern HTTP requests
- **LocalStorage**: Token persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Security Features
- JWT token validation
- Automatic token cleanup
- Secure credential handling

## Usage Examples

### Test Sequence for New Developers
1. Open dev-testing.html
2. Click "👑 Test Super Admin Login"
3. Click "📊 Test Dashboard Stats"
4. Click "👥 Test User Management"
5. Click "🎯 Test Todos los APIs"
6. Start monitoring with "▶️ Iniciar Monitoreo"

### Debugging API Issues
1. Login with appropriate user role
2. Test specific API category (Dashboard/User Management)
3. Review JSON output for error details
4. Use Health Check for system-wide issues

### Performance Testing
1. Start real-time monitoring
2. Run comprehensive API tests
3. Monitor response times and success rates
4. Use data for performance optimization

## File Location
```
public/dev-testing.html
```

## Dependencies
- Requires MAWI backend server running on localhost:5000
- Requires database connection for full functionality
- No external JavaScript libraries required

---

**Note**: This tool is designed for development and testing purposes only. Do not use in production environments.
