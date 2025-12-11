import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Section component for consistent styling
function Section({ id, className, children }) {
  return (
    <section id={id} className={`section ${className || ''}`}>
      {children}
    </section>
  )
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Redirect to the intended page or admin dashboard
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Section id="login" className="hero">
        <div className="hero-inner">
          <h1 className="title">Admin Login</h1>
          <p className="subtitle">Please sign in to access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@biblestory.ph"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="demo-credentials">
            <h3>Demo Credentials</h3>
            <p><strong>Admin:</strong> admin@biblestory.ph / admin123</p>
            <p><strong>User:</strong> user@biblestory.ph / user123</p>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} The Bible Story — Admin Login</p>
        <div className="legal-links">
          <a href="/">Back to Home</a>
        </div>
      </footer>
    </div>
  )
}

export default Login