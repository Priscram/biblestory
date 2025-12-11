import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * MOCK_USERS - Default user database for development
 * In a production app, this would be replaced with backend API calls
 * @type {Array<{email: string, password: string, role: string, name: string}>}
 */
const MOCK_USERS = [
  {
    email: 'admin@biblestory.ph',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    email: 'user@biblestory.ph',
    password: 'user123',
    role: 'user',
    name: 'Regular User'
  }
]

/**
 * initializeMockUsers - Ensures mock user database exists in localStorage
 * This function checks if mock users are already initialized and creates them if not
 * Used to maintain consistent test data across sessions
 */
const initializeMockUsers = () => {
  const existingUsers = localStorage.getItem('mock_users')
  if (!existingUsers) {
    localStorage.setItem('mock_users', JSON.stringify(MOCK_USERS))
    console.log('✅ Mock users initialized in localStorage')
  }
}

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize mock users and check for existing session on mount
  useEffect(() => {
    const initializeAndCheckSession = () => {
      // Initialize mock users
      initializeMockUsers()

      const session = localStorage.getItem('auth_session')
      if (session) {
        try {
          const sessionData = JSON.parse(session)
          const now = new Date().getTime()

          // Check if session is expired (24 hours)
          if (now - sessionData.timestamp > 24 * 60 * 60 * 1000) {
            logout()
            return
          }

          setUser(sessionData.user)
        } catch (error) {
          console.error('Error parsing session:', error)
          logout()
        }
      }
      setLoading(false)
    }

    initializeAndCheckSession()
  }, [])

  /**
   * login - Authenticate user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authenticated user object
   * @throws {Error} If authentication fails
   */
  const login = async (email, password) => {
    // Simulate API call delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Find user in mock database (case-insensitive email)
    const foundUser = MOCK_USERS.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    )

    if (!foundUser) {
      throw new Error('Invalid email or password')
    }

    // Create session data (without sensitive information like password)
    const sessionData = {
      user: {
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      },
      timestamp: new Date().getTime() // Used for session expiration
    }

    // Store session in localStorage
    localStorage.setItem('auth_session', JSON.stringify(sessionData))
    setUser(sessionData.user)
    return sessionData.user
  }

  /**
   * logout - End current user session
   * Clears authentication data and resets user state
   */
  const logout = () => {
    localStorage.removeItem('auth_session')
    setUser(null)
  }

  /**
   * signup - Create new user account
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @param {string} userData.role - User role ('user' or 'admin')
   * @param {string} userData.name - User's full name
   * @returns {Promise<Object>} Signup result
   * @throws {Error} If email already exists
   */
  const signup = async (userData) => {
    // Simulate API call delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get current users from localStorage or initialize empty array
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]')

    // Check if user already exists (prevent duplicate emails)
    const userExists = users.some(user => user.email === userData.email)
    if (userExists) {
      throw new Error('User with this email already exists')
    }

    // Add new user to the database
    users.push(userData)
    localStorage.setItem('mock_users', JSON.stringify(users))

    console.log(`🎉 New ${userData.role} created: ${userData.email}`)
    return { success: true }
  }

  const hasRole = (role) => {
    return user && user.role === role
  }

  const isAuthenticated = () => {
    return !!user
  }

  const value = {
    user,
    login,
    logout,
    signup,
    hasRole,
    isAuthenticated,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}