import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Section component for consistent styling
function Section({ id, className, children }) {
  return (
    <section id={id} className={`section ${className || ''}`}>
      {children}
    </section>
  )
}

const statusOptions = ['Packing', 'Courier', 'Road Map', 'Delivery Hubs', 'Delivered']

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [searchId, setSearchId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800))

      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      setOrders(storedOrders)
      setFilteredOrders(storedOrders)
      setIsLoading(false)
    }
    loadOrders()
  }, [])

  // Filter and search orders
  useEffect(() => {
    let filtered = orders

    if (filterStatus) {
      filtered = filtered.filter(order => order.status === filterStatus)
    }

    if (searchId) {
      const searchTerm = searchId.toLowerCase()
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.orderDetails.fullname.toLowerCase().includes(searchTerm)
      )
    }

    setFilteredOrders(filtered)
  }, [orders, filterStatus, searchId])

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus }
        // Add timestamp for the new status
        const statusKey = newStatus.toLowerCase().replace(' ', '')
        updatedOrder.timestamps = {
          ...order.timestamps,
          [statusKey]: new Date().toISOString()
        }
        return updatedOrder
      }
      return order
    })

    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setUpdatingOrderId(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="page admin-page">
      <Section id="dashboard" className="hero admin-hero">
        <div className="hero-inner">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 19.9609 21 19.5304 21 19V7M3 7H21M16 11H16.01M12 11H12.01M8 11H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="header-text">
                <h1 className="title">Admin Dashboard</h1>
                <p className="subtitle">Manage orders and track deliveries</p>
              </div>
            </div>
            <div className="user-info">
              <div className="user-welcome">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Welcome, {user?.name}</span>
              </div>
              <button onClick={logout} className="btn ghost logout-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Order Status Panel */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Order Management</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-card total-orders">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 19.9609 21 19.5304 21 19V7M3 7H21M16 11H16.01M12 11H12.01M8 11H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Total Orders</h3>
                  <p className="stat-number">{orders.length}</p>
                </div>
              </div>
              <div className="stat-card active-orders">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V4L8 8H12ZM12 8L16 12H12V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V20L16 16H12ZM12 16L8 12H12V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Active Orders</h3>
                  <p className="stat-number">{orders.filter(o => o.status !== 'Delivered').length}</p>
                </div>
              </div>
              <div className="stat-card delivered-orders">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Delivered</h3>
                  <p className="stat-number">{orders.filter(o => o.status === 'Delivered').length}</p>
                </div>
              </div>
              <div className="stat-card pending-orders">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L16 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Pending</h3>
                  <p className="stat-number">{orders.filter(o => o.status === 'Packing').length}</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="filters">
              <div className="filter-group">
                <label>Filter by Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Search by ID or Name:</label>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter order ID or customer name"
                  className="search-input"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="orders-section">
              <div className="section-header">
                <h3>Order Details</h3>
                <div className="table-info">
                  <span className="result-count">{filteredOrders.length} orders found</span>
                </div>
              </div>

              <div className="orders-table-container">
                <table className="orders-table modern">
                  <thead>
                    <tr>
                      <th>
                        <div className="header-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 19.9609 21 19.5304 21 19V7M3 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Order ID
                        </div>
                      </th>
                      <th>
                        <div className="header-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Customer
                        </div>
                      </th>
                      <th>
                        <div className="header-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.657 16.657L13.414 20.9C13.2284 21.0858 13.0081 21.2224 12.7699 21.3004C12.5317 21.3784 12.2823 21.3958 12.0379 21.3515C11.7935 21.3072 11.561 21.2024 11.3579 21.0463C11.1547 20.8902 10.9869 20.6875 10.868 20.454L7.05 12.4L17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.868 20.454L17.657 16.657L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Address
                        </div>
                      </th>
                      <th>
                        <div className="header-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H8.28C8.37229 3.00006 8.46373 3.01806 8.54932 3.05306C8.63491 3.08806 8.71283 3.13951 8.77883 3.20451L10.1848 4.54551C10.2508 4.61051 10.3287 4.66196 10.4143 4.69696C10.4999 4.73196 10.5913 4.74996 10.6836 4.74996H19C19.5304 4.74996 20.0391 4.96067 20.4142 5.33574C20.7893 5.71081 21 6.22027 21 6.75071V18.2493C21 18.7797 20.7893 19.2892 20.4142 19.6643C20.0391 20.0393 19.5304 20.25 19 20.25H5C4.46957 20.25 3.96086 20.0393 3.58579 19.6643C3.21071 19.2892 3 18.7797 3 18.2493V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Contact
                        </div>
                      </th>
                      <th>
                        <div className="header-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L10.89 4.26C11.2187 4.10302 11.5852 4.0309 11.9472 4.0523C12.3092 4.0737 12.6514 4.18779 12.9284 4.37883C13.2054 4.56987 13.4041 4.82826 13.4968 5.11823C13.5895 5.4082 13.5714 5.71495 13.445 5.995L12 9.5L10.89 12.26C10.7347 12.6535 10.4571 12.9848 10.1018 13.2008C9.7464 13.4168 9.335 13.5043 8.925 13.45C8.515 13.3957 8.129 13.2029 7.825 12.9L3 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 8V15.5C3 15.8978 3.15804 16.2794 3.43934 16.5607C3.72064 16.842 4.10218 17 4.5 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Courier
                        </div>
                      </th>
                      <th>
                        <div className="header-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Date
                        </div>
                      </th>
                      <th>
                        <div className="header-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Status
                        </div>
                      </th>
                      <th>
                        <div className="header-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 11V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V11M12 15V17M9 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V13C17 12.4696 16.7893 11.9609 16.4142 11.5858C16.0391 11.2107 15.5304 11 15 11H9C8.46957 11 7.96086 11.2107 7.58579 11.5858C7.21071 11.9609 7 12.4696 7 13V19C7 19.5304 7.21071 20.0391 7.58579 20.4142C7.96086 20.7893 8.46957 21 9 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="order-row">
                        <td>
                          <div className="order-id-cell">
                            <Link
                              to={`/tracker?id=${order.id.replace('ORD-', '')}`}
                              className="order-link"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2.4578 12C3.73207 7.94291 7.52237 5 12 5C16.4776 5 20.2679 7.94291 21.5422 12C20.2679 16.0571 16.4776 19 12 19C7.52237 19 3.73207 16.0571 2.4578 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {order.id}
                            </Link>
                          </div>
                        </td>
                        <td>
                          <div className="customer-cell">
                            <div className="customer-avatar">
                              {order.orderDetails.fullname.charAt(0).toUpperCase()}
                            </div>
                            <div className="customer-info">
                              <div className="customer-name">{order.orderDetails.fullname}</div>
                              <div className="customer-email">{order.orderDetails.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="address-cell">
                            <div className="address-main">{order.orderDetails.address}</div>
                            <div className="address-secondary">{order.orderDetails.city}, {order.orderDetails.region}</div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-cell">
                            <a href={`tel:${order.orderDetails.contact}`} className="contact-link">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6408 21.8227C20.377 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09501 3.90347 2.12787 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63476 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.10999 2.00002H7.10999C7.5953 1.99523 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81413 8.02485 9.62886 8.36824 9.35999 8.64L8.08999 9.91C9.51355 12.4136 11.5864 14.4865 14.09 15.91L15.36 14.64C15.6318 14.3711 15.9752 14.1859 16.3492 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {order.orderDetails.contact}
                            </a>
                          </div>
                        </td>
                        <td>
                          <span className="courier-name">
                            {order.courier || 'Not specified'}
                          </span>
                        </td>
                        <td>
                          <div className="date-cell">
                            <div className="date-main">{formatDate(order.timestamps.submitted)}</div>
                            <div className="date-relative">Ordered</div>
                          </div>
                        </td>
                        <td>
                          <div className="status-cell">
                            <span className={`status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                              <span className="status-dot"></span>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`status-select modern ${updatingOrderId === order.id ? 'loading' : ''}`}
                              disabled={updatingOrderId === order.id}
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>
                                  {updatingOrderId === order.id ? 'Updating...' : status}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => window.open(`/tracker?id=${order.id.replace('ORD-', '')}`, '_blank')}
                              className="action-btn track-btn"
                              title="Track Order"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2.4578 12C3.73207 7.94291 7.52237 5 12 5C16.4776 5 20.2679 7.94291 21.5422 12C20.2679 16.0571 16.4776 19 12 19C7.52237 19 3.73207 16.0571 2.4578 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="no-orders">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 19.9609 21 19.5304 21 19V7M3 7H21M16 11H16.01M12 11H12.01M8 11H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                    </svg>
                    <h3>No orders found</h3>
                    <p>No orders match the current filter criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} The Bible Story — Admin Dashboard</p>
        <div className="legal-links">
          <Link to="/">Back to Home</Link>
        </div>
      </footer>
    </div>
  )
}

export default AdminDashboard