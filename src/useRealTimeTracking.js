import { useState, useEffect, useCallback, useRef } from 'react';
import { createCourierApi } from './courierApi';

function useRealTimeTracking(trackingNumber, courier, isActive = false) {
  const [trackingData, setTrackingData] = useState(null);
  const [realTimeLocation, setRealTimeLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const intervalRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const pollInterval = 30000; // 30 seconds (reduced frequency for better performance)
  const retryDelay = 5000; // 5 seconds

  // Create courier-specific API service
  const courierApi = useRef(createCourierApi(courier)).current;

  // Fetch tracking data
  const fetchTrackingData = useCallback(async () => {
    if (!trackingNumber) return;

    try {
      setIsLoading(true);
      setError(null);

      // Use mock data for development
      const data = await courierApi.getMockTrackingData(trackingNumber);
      setTrackingData(data);
      setIsConnected(true);
      retryCountRef.current = 0;
    } catch (err) {
      console.error('Failed to fetch tracking data:', err);
      setError(err.message);
      setIsConnected(false);

      // Retry logic
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(() => fetchTrackingData(), retryDelay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [trackingNumber]);

  // Fetch real-time location
  const fetchRealTimeLocation = useCallback(async () => {
    if (!trackingNumber || !isActive) return;

    try {
      // Use mock data for development
      const location = await courierApi.getMockRealTimeLocation(trackingNumber);
      setRealTimeLocation(location);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to fetch real-time location:', err);
      setIsConnected(false);
    }
  }, [trackingNumber, isActive]);

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

    // Initial fetch
    fetchTrackingData();
    fetchRealTimeLocation();

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      fetchRealTimeLocation();
    }, pollInterval);
  }, [fetchTrackingData, fetchRealTimeLocation]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchTrackingData();
    fetchRealTimeLocation();
  }, [fetchTrackingData, fetchRealTimeLocation]);

  // Effect to handle polling based on isActive
  useEffect(() => {
    if (isActive && trackingNumber) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isActive, trackingNumber, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    trackingData,
    realTimeLocation,
    isLoading,
    error,
    isConnected,
    refresh,
    startPolling,
    stopPolling
  };
}

export default useRealTimeTracking;