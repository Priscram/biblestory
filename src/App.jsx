/**
 * Bible Story Sales Page - React Application with Authentication
 *
 * A multi-page React application featuring:
 * - User authentication system (login/signup)
 * - Role-based access control (admin vs regular users)
 * - Video unlock mechanism for sales page
 * - Protected admin dashboard
 * - Policy pages (privacy, terms, etc.)
 *
 * @file App.jsx - Main application entry point with routing configuration
 *
 * Setup Instructions:
 * 1. Place promo video at /public/bible-story-intro.mp4
 * 2. Install dependencies: `npm install`
 * 3. Start dev server: `npm run dev`
 * 4. Build for production: `npm run build`
 *
 * Key Features:
 * - React Router v6 for navigation
 * - Context API for state management
 * - LocalStorage for session persistence
 * - Mock authentication system (replace with real backend in production)
 * - Responsive design with CSS
 *
 * Routes:
 * - /              : Home page (public)
 * - /login         : User login (public)
 * - /signup        : User registration (public) - NEW!
 * - /admin         : Admin dashboard (protected, admin only)
 * - /privacy       : Privacy policy (public)
 * - /terms         : Terms of service (public)
 * - /refund        : Refund policy (public)
 * - /cookies       : Cookie policy (public)
 * - /tracker       : Shipping tracker (public)
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'
import RefundPolicy from './RefundPolicy'
import CookiePolicy from './CookiePolicy'
import ShippingTracker from './ShippingTracker'
import AdminDashboard from './AdminDashboard'
import Login from './Login'
import Signup from './Signup'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from './AuthContext'
import './styles.css'

/**
 * App - Main application component
 * Sets up routing and authentication context
 * @returns {JSX.Element} Complete application with routes
 */
function App() {
  return (
    // AuthProvider wraps the entire app to provide authentication context
    <AuthProvider>
      {/* React Router setup for client-side navigation */}
      {/* Note: basename must match the base path in vite.config.js for GitHub Pages */}
      <Router basename="/biblestory/">
        <Routes>
          {/* Public Routes - Accessible to all users */}
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/tracker" element={<ShippingTracker />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* NEW! User registration */}

          {/* Protected Routes - Require authentication and specific roles */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Add more protected routes here as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App