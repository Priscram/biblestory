import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different statuses
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const statusIcons = {
  'Picked up': createCustomIcon('#ff6b6b'),
  'In transit': createCustomIcon('#4ecdc4'),
  'Approaching destination': createCustomIcon('#45b7d1'),
  'Out for delivery': createCustomIcon('#96ceb4'),
  'Delivered': createCustomIcon('#feca57')
};

function ParcelMap({ trackingData, realTimeLocation, isLoading, error }) {
  const [mapCenter, setMapCenter] = useState([14.6091, 121.0223]); // Default to Manila
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    if (realTimeLocation) {
      setMapCenter([realTimeLocation.lat, realTimeLocation.lng]);
      setMapZoom(15);
    } else if (trackingData?.route && trackingData.route.length > 0) {
      const lastLocation = trackingData.route[trackingData.route.length - 1];
      setMapCenter([lastLocation.lat, lastLocation.lng]);
      setMapZoom(13);
    }
  }, [trackingData, realTimeLocation]);

  if (isLoading) {
    return (
      <div className="map-container loading">
        <div className="map-loading">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container error">
        <div className="map-error">
          <p>Unable to load map: {error}</p>
          <p>Please check your internet connection and try again.</p>
        </div>
      </div>
    );
  }

  const routePoints = trackingData?.route?.map(point => [point.lat, point.lng]) || [];
  const realTimePoint = realTimeLocation ? [realTimeLocation.lat, realTimeLocation.lng] : null;

  return (
    <div className="parcel-map-container">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '400px', width: '100%' }}
        className="parcel-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route polyline */}
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            color="#4ecdc4"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        {/* Route markers */}
        {trackingData?.route?.map((point, index) => (
          <Marker
            key={`route-${index}`}
            position={[point.lat, point.lng]}
            icon={statusIcons[point.status] || createCustomIcon('#cccccc')}
          >
            <Popup>
              <div className="route-popup">
                <strong>{point.status}</strong>
                <br />
                <small>{new Date(point.timestamp).toLocaleString()}</small>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Real-time location marker */}
        {realTimeLocation && (
          <Marker
            position={realTimePoint}
            icon={createCustomIcon('#ff4757')}
          >
            <Popup>
              <div className="realtime-popup">
                <strong>Current Location</strong>
                <br />
                <small>Speed: {realTimeLocation.speed?.toFixed(1)} km/h</small>
                <br />
                <small>Last update: {new Date(realTimeLocation.timestamp).toLocaleTimeString()}</small>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map legend */}
      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ff4757' }}></div>
            <span>Current Location</span>
          </div>
          <div className="legend-item">
            <div className="legend-color route-line"></div>
            <span>Route Path</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4ecdc4' }}></div>
            <span>Route Points</span>
          </div>
        </div>
      </div>

      {/* Status information */}
      {trackingData && (
        <div className="map-status">
          <div className="status-item">
            <span className="status-label">Status:</span>
            <span className="status-value">{trackingData.status}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Estimated Delivery:</span>
            <span className="status-value">{trackingData.estimatedDelivery}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Last Update:</span>
            <span className="status-value">{new Date(trackingData.lastUpdate).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParcelMap;