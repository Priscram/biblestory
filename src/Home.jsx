import React, { useRef, useState, useEffect } from 'react'
import { isValidPhoneNumber } from 'react-phone-number-input'
import PhoneInputWithCountry from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Link } from 'react-router-dom'
import AddressSelector from './AddressSelector'

// Section component for consistent styling
function Section({ id, className, children }) {
  return (
    <section id={id} className={`section ${className || ''}`}>
      {children}
    </section>
  )
}

function Home() {
   // videoRef points to the HTMLVideoElement so we can read current time and duration
   const videoRef = useRef(null)

   // UI states for when different sections should appear
   const [showCTA, setShowCTA] = useState(false)
   const [showSocial, setShowSocial] = useState(false)
   const [showProductImage, setShowProductImage] = useState(false)
   const [showBenefits, setShowBenefits] = useState(false)
   const [showObjections, setShowObjections] = useState(false)
   const [showDocs, setShowDocs] = useState(false)
   const [showGuarantee, setShowGuarantee] = useState(false)
   const [showQuality, setShowQuality] = useState(false)
   const [showTransform, setShowTransform] = useState(false)
   const [showBuyForm, setShowBuyForm] = useState(false)
   const [formSubmitted, setFormSubmitted] = useState(false)

   // Flag to ensure halfway trigger happens only once
   const [hasTriggered, setHasTriggered] = useState(false)

   const [consentGiven, setConsentGiven] = useState(false)
   const [selectedCountry, setSelectedCountry] = useState('')

  // Form state for COD order
  const [order, setOrder] = useState({
    fullname: '',
    address: '',
    region: '',
    city: '',
    contact: '',
    email: '',
    courier: 'J&T Express',
    notes: '',
    privacyAgreement: false
  })

  // Debug logging for video duration and path resolution
  useEffect(() => {
     const v = videoRef.current
     if (v) {
        const onLoadedMetadata = () => {
           console.log('Video loaded. Duration:', v.duration, 'seconds')
        }
        const onError = () => {
           console.error('Video failed to load. Current src:', v.currentSrc)
           console.error('BASE_URL:', import.meta.env.BASE_URL)
           console.error('Expected path:', `${import.meta.env.BASE_URL}bible-story-presentation.mp4`)
        }
        v.addEventListener('loadedmetadata', onLoadedMetadata)
        v.addEventListener('error', onError)
        return () => {
           v.removeEventListener('loadedmetadata', onLoadedMetadata)
           v.removeEventListener('error', onError)
        }
     }
  }, [])


  // Share functions
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };
  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out The Bible Story 10-Volume Set');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };
  const shareOnInstagram = () => {
    window.open('https://www.instagram.com/', '_blank');
  };

  // Analytics logging function
  const logAnalyticsEvent = (eventType, data = {}) => {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      ...data
    };
    const existing = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    existing.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(existing));
  };

  // Handle video time updates. When the video reaches halfway, trigger the UI elements.
  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    const halfway = v.duration ? v.duration / 2 : null
    // If duration is available and we've reached halfway OR video is already ended
    if (halfway && v.currentTime >= halfway && !hasTriggered) {
      triggerAll()
      setHasTriggered(true)
    }
  }

  // If the video ends, reset to poster image and trigger UI elements
  const handleEnded = () => {
    const v = videoRef.current
    if (v) {
      // Reset to beginning and pause to display poster image
      v.currentTime = 0
      v.pause()

      // Ensure poster image is displayed by briefly loading it
      setTimeout(() => {
        if (v.paused && v.currentTime === 0) {
          // Force poster display by triggering a load event
          v.load()
        }
      }, 100)
    }
    triggerAll()
  }

  // Centralized function to reveal sections (idempotent)
  function triggerAll() {
    setShowCTA(true)
    setShowSocial(true)
    setShowProductImage(true)
    setShowBenefits(true)
    setShowObjections(true)
    setShowDocs(true)
    setShowGuarantee(true)
    setShowQuality(true)
    setShowTransform(true)
  }

  // Basic handler for form input changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setOrder(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // Sanitize and submit form for Cash on Delivery
  async function handleSubmit(e) {
    e.preventDefault()

    // Sanitize inputs
    const sanitizedOrder = {
      ...order,
      fullname: order.fullname.trim(),
      address: order.address.trim(),
      contact: order.contact.trim().replace(/[^\d+\-\s]/g, ''), // Allow only digits, +, -, space
      email: order.email.trim().toLowerCase(),
      notes: order.notes.trim()
    }

    // Validation
    if (!sanitizedOrder.fullname || !sanitizedOrder.address || !sanitizedOrder.region || !sanitizedOrder.city || !sanitizedOrder.contact || !sanitizedOrder.email) {
      alert('Please fill in all required fields: name, address, region, city, contact, and email.')
      return
    }
    if (!isValidPhoneNumber(sanitizedOrder.contact)) {
      alert('Please enter a valid phone number for the selected country.')
      return
    }
    if (!sanitizedOrder.privacyAgreement) {
      alert('Please agree to the Privacy Policy to proceed.')
      return
    }

    try {
      // Simulate submission to database API (replace with actual fetch when backend is ready)
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(sanitizedOrder)
      // })
      // if (!response.ok) {
      //   throw new Error('Submission failed')
      // }

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

      // Generate order ID and tracking
      const orderId = 'ORD-' + Date.now();
      const trackingNumber = sanitizedOrder.courier.toUpperCase().replace(/\s/g, '') + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      // Store order in localStorage
      const orderData = {
        id: orderId,
        status: 'Packing',
        trackingNumber,
        courier: sanitizedOrder.courier,
        orderDetails: sanitizedOrder,
        timestamps: {
          submitted: new Date().toISOString(),
          packing: new Date().toISOString()
        }
      };
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Log analytics event
      logAnalyticsEvent('form_submission', { courier: sanitizedOrder.courier, orderId })

      console.log('COD Order Submitted:', sanitizedOrder, 'Order ID:', orderId)
      setOrder({ ...order, orderId }) // Store orderId for confirmation
      setFormSubmitted(true)
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('There was an error submitting your order. Please try again.')
    }
  }

  // Instructions for the junior dev appear in comments below the return
  return (
    <div className="page">
      {/* HERO SECTION */}
      <Section id="hero" className="hero">
        <div className="hero-inner">
          <h1 className="title">The Bible Story — 10 Volume Set</h1>
          <p className="subtitle">Retold for children by Arthur S. Maxwell — timeless stories, beautiful illustrations.</p>

          {/* VIDEO: Replace 'bible-story-intro.mp4' in the public folder with your actual promo video.
              If you don't have a video yet, you can use a small sample or leave the poster image.
              Important: Vite serves files in public/ from the project root. */}
          <div className="video-wrap">
            <video
              ref={videoRef}
              className="video"
              controls
              controlsList="nodownload"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              poster="/bible_story_10_volumes_by_Arthur_S._Maxwell.jpg"
            >
              <source src={`${import.meta.env.BASE_URL}bible-story-presentation.mp4`} type="video/mp4" />
              {/* If the browser can't play the video, show fallback text */}
              Your browser does not support the video tag. Please replace /public/bible-story-presentation.mp4 with your MP4.
            </video>
            {showCTA && (
              <div className="video-overlay">
                <button className="btn primary glow overlay-btn" onClick={() => setShowBuyForm(true)}>
                  Order Now
                </button>
              </div>
            )}
          </div>

          {/* CTA appears when showCTA is true (video halfway or ended) */}
          {showCTA && (
            <div className="cta-row">
              <button className="btn primary" onClick={() => setShowBuyForm(true)}>
                Get the 10-Volume Set — Cash on Delivery
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* SOCIAL PROOFS */}
      {showSocial && (
        <Section id="social-proofs" className="bg-soft">
          <h2>Trusted by Families, Teachers & Churches</h2>
          <div className="social-grid">
            <blockquote className="quote">
              "This set shaped our family's nightly routine — children are more compassionate and curious."
              <footer>- Parent, 3 kids</footer>
            </blockquote>
            <blockquote className="quote">
              "A fantastic resource for Sunday school and home. So thorough and engaging."
              <footer>- Pastor / Teacher</footer>
            </blockquote>
            <blockquote className="quote">
              "Beautiful art and faithful retellings — an heirloom set."
              <footer>- Librarian</footer>
            </blockquote>
          </div>
        </Section>
      )}

      {/* PRODUCT IMAGE */}
      {showProductImage && (
        <Section id="product-image">
          <h2>Product: The Bible Story (10 Volumes)</h2>
          {/* Replace /product.jpg in public/ with a photo of the boxed set */}
          <img src="/bible_story_10_volumes_by_Arthur_S._ Maxwell.jpg" alt="Bible Story 10 volume set" className="product-image" />
        </Section>
      )}

      {/* BENEFITS */}
      {showBenefits && (
        <Section id="benefits" className="bg-soft">
          <h2>Benefits</h2>
          <ul className="benefits-list">
            <li><strong>Spiritual growth:</strong> Builds familiarity with Scripture and Christian values.</li>
            <li><strong>Character education:</strong> Stories teach honesty, courage, and kindness.</li>
            <li><strong>Literacy boost:</strong> Narrative reading increases vocabulary and comprehension.</li>
            <li><strong>Family bonding:</strong> Ideal for morning or bedtime traditions.</li>
          </ul>
        </Section>
      )}

      {/* OBJECTIONS */}
      {showObjections && (
        <Section id="objections">
          <h2>Common Concerns — Answered</h2>
          <div className="qa-grid">
            <div className="qa">
              <h3>"I'm busy — will this take too long?"</h3>
              <p>Each chapter is short (3–5 minutes). Even reading three times a week yields transformational results for family faith.</p>
            </div>
            <div className="qa">
              <h3>"Is it age-appropriate?"</h3>
              <p>Designed for children 6–12, but perfect as a read-aloud for younger kids and helpful for teens revisiting basics.</p>
            </div>
            <div className="qa">
              <h3>"What about denominational differences?"</h3>
              <p>The stories are faithful to the Bible text and emphasize core Christian truths valued across many denominations.</p>
            </div>
          </div>
        </Section>
      )}

      {/* RECOMMENDING DOCS / IMAGES */}
      {showDocs && (
        <Section id="docs" className="bg-soft">
          <h2>Recommended & Endorsed</h2>
          <div className="endorsers">
            <img src="/endorser1.jpg" alt="Pastor endorsement" />
            <img src="/endorser2.jpg" alt="Teacher endorsement" />
            <img src="/endorser3.jpg" alt="Parent endorsement" />
          </div>
        </Section>
      )}

      {/* PRODUCT GUARANTEE */}
      {showGuarantee && (
        <Section id="guarantee">
          <h2>Product Guarantee</h2>
          <p>This set is sold as-is to preserve the integrity of Arthur S. Maxwell's original edition.</p>
        </Section>
      )}

      {/* QUALITY ASSURANCE */}
      {showQuality && (
        <Section id="quality" className="bg-soft">
          <h2>Quality Assurance</h2>
          <p>Hardbound covers, premium paper, and 1,200 full-color illustrations make this a durable, long-lasting family collection.</p>
        </Section>
      )}

      {/* TRANSFORMATIONAL GUARANTEE */}
      {showTransform && (
        <Section id="transform">
          <h2>Transformational Promise</h2>
          <p>Reading together every morning and bedtime — even as little as three times a week — helps shape a child's character and faith.</p>
        </Section>
      )}

      {/* BUY NOW / FORM */}
      {showBuyForm && (
        <Section id="buy-form" className="modal">
          <div className="modal-inner">
            <h2>Cash on Delivery — Order Form</h2>
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="order-form">
                <label>
                  Full name
                  <input name="fullname" value={order.fullname} onChange={handleChange} placeholder="Jane Doe" />
                </label>

                <label>
                  Shipping Address
                  <AddressSelector
                    onAddressChange={(address) => setOrder(prev => ({ ...prev, address }))}
                    onCountryChange={(countryIsoCode) => setOrder(prev => ({ ...prev, shippingCountry: countryIsoCode }))}
                    onRegionChange={(regionIsoCode) => setOrder(prev => ({ ...prev, region: regionIsoCode }))}
                    onCityChange={(cityName) => setOrder(prev => ({ ...prev, city: cityName }))}
                  />
                </label>

                <label>
                  Contact number
                  <PhoneInputWithCountry
                    value={order.contact}
                    onChange={(value) => setOrder(prev => ({ ...prev, contact: value || '' }))}
                    placeholder="Enter phone number"
                    defaultCountry="PH"
                  />
                </label>
                <label>
                  Email address
                  <input name="email" type="email" value={order.email} onChange={handleChange} placeholder="your.email@example.com" />
                </label>
                <label>
                  Choose courier
                  <select name="courier" value={order.courier} onChange={handleChange}>
                    <option>J&T Express</option>
                    <option>LBC</option>
                    <option>Ninja Van</option>
                    <option>GrabExpress</option>
                  </select>
                </label>
                <label>
                  Notes (optional)
                  <input name="notes" value={order.notes} onChange={handleChange} placeholder="Leave at guard, ring doorbell, etc." />
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="privacyAgreement" checked={order.privacyAgreement} onChange={handleChange} />
                  I agree to the <Link to="/privacy" target="_blank">Privacy Policy</Link>
                </label>

                <div className="form-actions">
                  <button type="submit" className="btn primary">Submit COD Order</button>
                  <button type="button" className="btn ghost" onClick={() => setShowBuyForm(false)}>Cancel</button>
                </div>
              </form>
            ) : (
             <div className="confirmation">
               <p>Thank you — your order has been received. A sales rep will call you to confirm payment on delivery.</p>
               {order.orderId && <p><strong>Your Order ID:</strong> {order.orderId}</p>}
               {order.orderId && <p><Link to={`/tracker?id=${order.orderId.replace('ORD-', '')}`} className="tracker-link">Track your order here</Link></p>}
               <button className="btn" onClick={() => { setShowBuyForm(false); setFormSubmitted(false); setOrder({fullname:'',address:'',region:'',city:'',contact:'',email:'',courier:'J&T Express',notes:'',privacyAgreement:false}) }}>Close</button>
             </div>
           )}
          </div>
        </Section>
      )}


      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} The Bible Story — Sales Page Demo</p>
        <p>Contact: <a href="mailto:marketing@biblestory.ph">marketing@biblestory.ph</a></p>
        <div className="legal-links">
          <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link> | <Link to="/refund">Refund Policy</Link> | <Link to="/cookies">Cookie Policy</Link>
        </div>
        <div className="social-share">
          <h3>Share this page</h3>
          <div className="share-buttons">
            <button onClick={shareOnFacebook} className="share-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button onClick={shareOnLinkedIn} className="share-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
            <button onClick={shareOnTwitter} className="share-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            <button onClick={shareOnInstagram} className="share-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </button>
          </div>
        </div>
        <p className="small">Developer notes: Replace media files in the /public folder; the code is commented for easy editing. </p>
      </footer>
    </div>
  )
}

export default Home