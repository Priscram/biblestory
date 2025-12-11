import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

/**
 * Section - Reusable section component for consistent page layout
 * @param {Object} props - Component props
 * @param {string} props.id - HTML id attribute
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Section content
 * @returns {JSX.Element} Styled section element
 */
function Section({ id, className, children }) {
  return (
    <section id={id} className={`section ${className || ''}`}>
      {children}
    </section>
  )
}

/**
 * Signup - User registration component
 * Handles new user account creation with form validation and role selection
 * @returns {JSX.Element} Complete signup page
 */
function Signup() {
  const navigate = useNavigate()

  // Form state management
  const [formData, setFormData] = useState({
    name: '',           // User's full name
    email: '',          // Email address (used as username)
    password: '',       // Account password
    confirmPassword: '',// Password confirmation
    role: 'user'        // Account type: 'user' or 'admin'
  })
  const [error, setError] = useState('')      // Form validation errors
  const [success, setSuccess] = useState('')  // Success messages
  const [loading, setLoading] = useState(false)// Form submission state

  // Authentication functions from AuthContext
  const { signup, login } = useAuth()

  /**
   * handleChange - Update form field values
   * @param {Object} e - Form input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * handleSubmit - Process form submission
   * Validates input, creates user account, and handles authentication
   * @param {Object} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Client-side validation
    // 1. Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // 2. Check password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Prepare user data for registration
      const userData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,      // 'user' or 'admin'
        name: formData.name
      }

      // Call signup function from AuthContext
      await signup(userData)

      // Automatically log in the new user after successful registration
      await login(formData.email, formData.password)

      // Show success message and redirect based on user role
      setSuccess('Signup successful! Redirecting...')
      setTimeout(() => {
        // Admins go to admin dashboard, regular users go to home
        navigate(formData.role === 'admin' ? '/admin' : '/')
      }, 1500)

    } catch (err) {
      // Handle signup errors (e.g., duplicate email)
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false) // Always reset loading state
    }
  }

  return (
    <div className="page">
      <Section id="signup" className="hero">
        <div className="hero-inner">
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Sign up to access our platform</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password (min 6 characters)"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="user">Regular User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="login-link">
            <p>Already have an account? <a href="/login">Sign in</a></p>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} The Bible Story — Account Creation</p>
        <div className="legal-links">
          <a href="/">Back to Home</a>
        </div>
      </footer>
    </div>
  )
}

export default Signup