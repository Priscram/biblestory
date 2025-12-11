import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="page">
        <div className="hero">
          <div className="hero-inner">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="page">
        <div className="hero">
          <div className="hero-inner">
            <h1 className="title">Access Denied</h1>
            <p className="subtitle">You don't have permission to access this page.</p>
            <a href="/" className="btn primary">Go to Home</a>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute