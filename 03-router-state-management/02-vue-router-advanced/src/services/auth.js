// Mock authentication service
// In a real app, this would make API calls to your backend

const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    permissions: ['users.read', 'users.write', 'settings.read', 'settings.write', 'reports.read']
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    permissions: ['reports.read']
  }
]

class AuthService {
  constructor() {
    this.currentUser = null
    this.token = null
    this.loadFromStorage()
  }

  loadFromStorage() {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('auth_user')

    if (token && userStr) {
      this.token = token
      this.currentUser = JSON.parse(userStr)
    }
  }

  async login(username, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = MOCK_USERS.find(
      u => u.username === username && u.password === password
    )

    if (!user) {
      throw new Error('Invalid username or password')
    }

    // Don't include password in stored user
    const { password: _, ...userWithoutPassword } = user
    this.currentUser = userWithoutPassword

    // Generate mock token
    this.token = `mock-token-${user.id}-${Date.now()}`

    // Store in localStorage
    localStorage.setItem('auth_token', this.token)
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  }

  logout() {
    this.currentUser = null
    this.token = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  isAuthenticated() {
    return !!this.token && !!this.currentUser
  }

  isAdmin() {
    return this.currentUser?.role === 'admin'
  }

  hasPermission(permission) {
    return this.currentUser?.permissions.includes(permission) || false
  }

  getUser() {
    return this.currentUser
  }

  getToken() {
    return this.token
  }
}

// Export singleton instance
export const authService = new AuthService()
