// Courier API service for real-time parcel tracking
class CourierApiService {
  constructor(courier = null) {
    this.baseUrl = import.meta.env.VITE_COURIER_API_URL || 'https://api.courier.example.com';
    this.courier = courier;
    this.apiKey = this._getCourierApiKey(courier);
    this.clientId = this._getCourierClientId(courier);
    this.clientSecret = this._getCourierClientSecret(courier);
    this.authToken = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes

    // Periodic cache cleanup
    setInterval(() => this._cleanCache(), 10 * 60 * 1000); // Clean every 10 minutes
  }

  // Get API key for specific courier
  _getCourierApiKey(courier) {
    const keyMap = {
      'J&T Express': import.meta.env.VITE_JT_EXPRESS_API_KEY,
      'LBC': import.meta.env.VITE_LBC_API_KEY,
      'Ninja Van': import.meta.env.VITE_NINJA_VAN_API_KEY,
      'GrabExpress': import.meta.env.VITE_GRAB_EXPRESS_API_KEY
    };
    return keyMap[courier] || import.meta.env.VITE_COURIER_API_KEY;
  }

  // Get client ID for specific courier
  _getCourierClientId(courier) {
    const idMap = {
      'J&T Express': import.meta.env.VITE_JT_EXPRESS_CLIENT_ID,
      'LBC': import.meta.env.VITE_LBC_CLIENT_ID,
      'Ninja Van': import.meta.env.VITE_NINJA_VAN_CLIENT_ID,
      'GrabExpress': import.meta.env.VITE_GRAB_EXPRESS_CLIENT_ID
    };
    return idMap[courier] || import.meta.env.VITE_COURIER_CLIENT_ID;
  }

  // Get client secret for specific courier
  _getCourierClientSecret(courier) {
    const secretMap = {
      'J&T Express': import.meta.env.VITE_JT_EXPRESS_CLIENT_SECRET,
      'LBC': import.meta.env.VITE_LBC_CLIENT_SECRET,
      'Ninja Van': import.meta.env.VITE_NINJA_VAN_CLIENT_SECRET,
      'GrabExpress': import.meta.env.VITE_GRAB_EXPRESS_CLIENT_SECRET
    };
    return secretMap[courier] || import.meta.env.VITE_COURIER_CLIENT_SECRET;
  }

  // Authenticate with courier API
  async authenticate() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_COURIER_CLIENT_ID,
          client_secret: import.meta.env.VITE_COURIER_CLIENT_SECRET
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      this.authToken = data.access_token;
      return true;
    } catch (error) {
      console.error('Courier API authentication failed:', error);
      throw error;
    }
  }

  // Get tracking data for a parcel
  async getTrackingData(trackingNumber) {
    return this._makeRequest(`/tracking/${trackingNumber}`);
  }

  // Get real-time location data (no caching for fresh data)
  async getRealTimeLocation(trackingNumber) {
    return this._makeRequest(`/tracking/${trackingNumber}/location`, {}, false);
  }

  // Get route data for visualization
  async getRouteData(trackingNumber) {
    return this._makeRequest(`/tracking/${trackingNumber}/route`);
  }

  // Get status updates
  async getStatusUpdates(trackingNumber, since = null) {
    const params = since ? `?since=${since}` : '';
    return this._makeRequest(`/tracking/${trackingNumber}/updates${params}`);
  }

  // Cache management methods
  _getCacheKey(endpoint, options = {}) {
    return `${endpoint}_${JSON.stringify(options)}`;
  }

  _getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  _setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear expired cache entries
  _cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }

  // Private method to make authenticated requests with retry logic
  async _makeRequest(endpoint, options = {}, useCache = true) {
    const cacheKey = this._getCacheKey(endpoint, options);

    // Check cache first for GET requests
    if (useCache && (!options.method || options.method === 'GET')) {
      const cachedData = this._getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    let attempts = 0;

    while (attempts < this.retryAttempts) {
      try {
        // Ensure we have a valid token
        if (!this.authToken) {
          await this.authenticate();
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
            ...options.headers
          }
        });

        // Handle token expiration
        if (response.status === 401) {
          this.authToken = null;
          await this.authenticate();
          attempts++; // Retry after re-authentication
          continue;
        }

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful GET responses
        if (useCache && (!options.method || options.method === 'GET')) {
          this._setCachedData(cacheKey, data);
        }

        return data;
      } catch (error) {
        attempts++;
        if (attempts >= this.retryAttempts) {
          throw new Error(`API request failed after ${attempts} attempts: ${error.message}`);
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempts));
      }
    }
  }

  // Mock data for development/testing (remove in production)
  async getMockTrackingData(trackingNumber) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Courier-specific mock data
    const courierRoutes = {
      'J&T Express': {
        locations: [
          { lat: 14.5995, lng: 120.9842, timestamp: Date.now() - 3600000, status: 'Picked up' },
          { lat: 14.6095, lng: 120.9942, timestamp: Date.now() - 1800000, status: 'In transit' },
          { lat: 14.6195, lng: 121.0042, timestamp: Date.now() - 900000, status: 'Approaching destination' },
          { lat: 14.6295, lng: 121.0142, timestamp: Date.now(), status: 'Out for delivery' }
        ],
        baseLocation: { lat: 14.6295, lng: 121.0142 }
      },
      'LBC': {
        locations: [
          { lat: 14.5895, lng: 120.9742, timestamp: Date.now() - 3600000, status: 'Picked up' },
          { lat: 14.5995, lng: 120.9842, timestamp: Date.now() - 1800000, status: 'In transit' },
          { lat: 14.6095, lng: 120.9942, timestamp: Date.now() - 900000, status: 'Approaching destination' },
          { lat: 14.6195, lng: 121.0042, timestamp: Date.now(), status: 'Out for delivery' }
        ],
        baseLocation: { lat: 14.6195, lng: 121.0042 }
      },
      'Ninja Van': {
        locations: [
          { lat: 14.5795, lng: 120.9642, timestamp: Date.now() - 3600000, status: 'Picked up' },
          { lat: 14.5895, lng: 120.9742, timestamp: Date.now() - 1800000, status: 'In transit' },
          { lat: 14.5995, lng: 120.9842, timestamp: Date.now() - 900000, status: 'Approaching destination' },
          { lat: 14.6095, lng: 120.9942, timestamp: Date.now(), status: 'Out for delivery' }
        ],
        baseLocation: { lat: 14.6095, lng: 120.9942 }
      },
      'GrabExpress': {
        locations: [
          { lat: 14.5695, lng: 120.9542, timestamp: Date.now() - 3600000, status: 'Picked up' },
          { lat: 14.5795, lng: 120.9642, timestamp: Date.now() - 1800000, status: 'In transit' },
          { lat: 14.5895, lng: 120.9742, timestamp: Date.now() - 900000, status: 'Approaching destination' },
          { lat: 14.5995, lng: 120.9842, timestamp: Date.now(), status: 'Out for delivery' }
        ],
        baseLocation: { lat: 14.5995, lng: 120.9842 }
      }
    };

    const routeData = courierRoutes[this.courier] || courierRoutes['J&T Express'];

    return {
      trackingNumber,
      currentLocation: routeData.locations[routeData.locations.length - 1],
      route: routeData.locations,
      status: 'In Transit',
      estimatedDelivery: 'Today',
      lastUpdate: new Date().toISOString(),
      courier: this.courier
    };
  }

  async getMockRealTimeLocation(trackingNumber) {
    // Courier-specific base locations
    const courierBases = {
      'J&T Express': { lat: 14.6295, lng: 121.0142 },
      'LBC': { lat: 14.6195, lng: 121.0042 },
      'Ninja Van': { lat: 14.6095, lng: 120.9942 },
      'GrabExpress': { lat: 14.5995, lng: 120.9842 }
    };

    const baseLocation = courierBases[this.courier] || courierBases['J&T Express'];

    // Simulate moving location with courier-specific base
    const variation = 0.001 * Math.sin(Date.now() / 10000); // Slow oscillation

    return {
      lat: baseLocation.lat + variation,
      lng: baseLocation.lng + variation,
      timestamp: Date.now(),
      speed: Math.random() * 50 + 10, // km/h
      heading: Math.random() * 360,
      courier: this.courier
    };
  }
}

// Factory function to create courier-specific API services
export const createCourierApi = (courier) => {
  return new CourierApiService(courier);
};

// Export singleton instance (for backward compatibility)
export default new CourierApiService();