import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ParcelMap from './ParcelMap'
import useRealTimeTracking from './useRealTimeTracking'
import { useAuth } from './AuthContext'

// Section component for consistent styling
function Section({ id, className, children }) {
  return (
    <section id={id} className={`section ${className || ''}`}>
      {children}
    </section>
  )
}

function ShippingTracker() {
  const [searchParams] = useSearchParams()
  const [searchId, setSearchId] = useState('')
  const [trackingResult, setTrackingResult] = useState(null)
  const [error, setError] = useState('')
  const { hasRole } = useAuth()

  // Real-time tracking hook - activated when status is "Road Map"
  const isRealTimeActive = trackingResult?.status === 'Road Map'
  const {
    trackingData,
    realTimeLocation,
    isLoading: trackingLoading,
    error: trackingError,
    isConnected,
    refresh: refreshTracking
  } = useRealTimeTracking(trackingResult?.trackingNumber, trackingResult?.courier, isRealTimeActive)

  // Auto-fill and search if order ID is provided in URL
  useEffect(() => {
    const orderId = searchParams.get('id')
    if (orderId) {
      setSearchId(orderId)
      // Auto-search after a brief delay to allow state to update
      setTimeout(() => {
        handleAutoSearch(orderId)
      }, 100)
    }
  }, [searchParams])

  const handleAutoSearch = (orderId) => {
    performSearch(orderId)
  }

  const performSearch = (orderId) => {
    setError('')
    setTrackingResult(null)

    // Ensure the search starts with ORD-
    let fullOrderId = orderId.trim()
    if (!fullOrderId.startsWith('ORD-')) {
      fullOrderId = 'ORD-' + fullOrderId
    }

    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const order = orders.find(o => o.id === fullOrderId)

    if (!order) {
      setError('Order not found. Please check your Order ID.')
      return
    }

    // Simulate tracking status based on time since submission
    const submittedTime = new Date(order.timestamps.submitted)
    const now = new Date()
    const hoursSince = (now - submittedTime) / (1000 * 60 * 60)

    let status, location, estimatedDelivery

    // Use the actual status from the order
    status = order.status

    if (status === 'Packing') {
      location = 'Warehouse - Preparing Package'
      estimatedDelivery = '2-3 business days'
    } else if (status === 'Courier') {
      location = 'Picked up by ' + order.courier
      estimatedDelivery = '1-2 business days'
    } else if (status === 'Road Map') {
      location = 'In Transit - ' + order.courier
      estimatedDelivery = '1-2 business days'
    } else if (status === 'Delivery Hubs') {
      location = 'Arrived at Local Delivery Hub'
      estimatedDelivery = 'Today'
    } else if (status === 'Delivered') {
      location = 'Delivered to recipient'
      estimatedDelivery = 'Delivered'
    } else {
      location = 'Unknown'
      estimatedDelivery = 'Pending'
    }

    setTrackingResult({
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      courier: order.courier,
      status,
      location,
      estimatedDelivery,
      orderDetails: order.orderDetails
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch(searchId)
  }

  return (
    <div className="page">
      <Section id="tracker" className="hero">
        <div className="hero-inner">
          <h1 className="title">Shipping Tracker</h1>
          <p className="subtitle">Track your parcel location using your Order ID</p>

          {/* Admin Navigation Button */}
          {hasRole('admin') && (
            <div className="admin-nav" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <Link to="/admin" className="btn primary">
                ← Back to Admin Dashboard
              </Link>
            </div>
          )}

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <span className="prefix">ORD-</span>
              <input
                type="text"
                value={searchId.replace('ORD-', '')}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter your Order ID (without ORD-)"
                className="search-input"
                required
              />
            </div>
            <button type="submit" className="btn primary">Track Order</button>
          </form>

          {error && <p className="error">{error}</p>}

          {trackingResult && (
            <div className="tracking-result">
              <h2>Tracking Information</h2>
              <div className="tracking-details">
                <p><strong>Order ID:</strong> {trackingResult.orderId}</p>
                <p><strong>Tracking Number:</strong> {trackingResult.trackingNumber}</p>
                <p><strong>Courier:</strong> {trackingResult.courier}</p>
                <p><strong>Status:</strong> {trackingResult.status}</p>
                <p><strong>Location:</strong> {trackingResult.location}</p>
                <p><strong>Estimated Delivery:</strong> {trackingResult.estimatedDelivery}</p>
              </div>

              <div className="order-details">
                <h3>Order Details</h3>
                <p><strong>Name:</strong> {trackingResult.orderDetails.fullname}</p>
                <p><strong>Address:</strong> {trackingResult.orderDetails.address}, {trackingResult.orderDetails.city}, {trackingResult.orderDetails.region}</p>
                <p><strong>Contact:</strong> {trackingResult.orderDetails.contact}</p>
                {trackingResult.orderDetails.notes && <p><strong>Notes:</strong> {trackingResult.orderDetails.notes}</p>}
              </div>

              {/* Real-time Map Tracking - only show when status is Road Map */}
              {trackingResult.status === 'Road Map' && (
                <div className="realtime-tracking-section">
                  <h3>Real-Time Location Tracking</h3>
                  {!isConnected && !trackingLoading && (
                    <div className="connection-status">
                      <p style={{ color: '#dc2626', fontSize: '14px' }}>
                        ⚠️ Unable to connect to tracking service. Using cached data.
                      </p>
                    </div>
                  )}
                  {isConnected && (
                    <div className="connection-status">
                      <p style={{ color: '#059669', fontSize: '14px' }}>
                        🔴 LIVE • Last updated: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                  <ParcelMap
                    trackingData={trackingData}
                    realTimeLocation={realTimeLocation}
                    isLoading={trackingLoading}
                    error={trackingError}
                  />
                  <div className="tracking-controls">
                    <button
                      onClick={refreshTracking}
                      className="btn primary"
                      disabled={trackingLoading}
                    >
                      {trackingLoading ? 'Refreshing...' : 'Refresh Location'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} The Bible Story — Sales Page Demo</p>
        <p>Contact: <a href="mailto:marketing@biblestory.ph">marketing@biblestory.ph</a></p>
        <div className="legal-links">
          <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link> | <Link to="/refund">Refund Policy</Link> | <Link to="/cookies">Cookie Policy</Link>
        </div>
        <p className="small">Developer notes: This tracker simulates shipping status based on order submission time.</p>
      </footer>
    </div>
  )
}

export default ShippingTracker