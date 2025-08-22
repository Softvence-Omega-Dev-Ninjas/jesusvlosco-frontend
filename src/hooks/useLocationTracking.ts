import { useEffect, useCallback, useRef } from 'react';
import { connectLocationTracking, sendLocationUpdate } from '@/utils/socket';

interface UseLocationTrackingOptions {
  interval?: number; // Interval in minutes (default: 1)
  enabled?: boolean; // Whether to enable location tracking (default: true)
  highAccuracy?: boolean; // Whether to use high accuracy (default: true)
  token: string; // Authentication token
}

interface LocationTrackingResult {
  isTracking: boolean;
  lastLocation: { lat: number; lng: number } | null;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
}

export const useLocationTracking = ({
  interval = 1,
  enabled = true,
  highAccuracy = true,
  token
}: UseLocationTrackingOptions): LocationTrackingResult => {
  const intervalRef = useRef<number | null>(null);
  const isTrackingRef = useRef(false);
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const errorRef = useRef<string | null>(null);

  // Get current location and send via socket
  const sendCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser';
      console.error('⚠️', error);
      errorRef.current = error;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        lastLocationRef.current = { lat, lng };
        errorRef.current = null;
        
        // Send location update via Socket.IO
        sendLocationUpdate(lat, lng);
        
        console.log(`📍 Location sent via socket: ${lat}, ${lng}`);
      },
      (error) => {
        let errorMessage = 'Unknown geolocation error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        console.error('❌ Geolocation error:', errorMessage);
        errorRef.current = errorMessage;
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 30000 // Cache location for 30 seconds
      }
    );
  }, [highAccuracy]);

  // Start location tracking
  const startTracking = useCallback(() => {
    if (isTrackingRef.current || !token) return;

    console.log(`🎯 Starting location tracking (every ${interval} minute${interval > 1 ? 's' : ''})`);
    
    // Connect to location tracking socket
    connectLocationTracking(token);
    
    // Send initial location immediately
    sendCurrentLocation();
    
    // Set up interval to send location updates
    intervalRef.current = setInterval(() => {
      sendCurrentLocation();
    }, interval * 60 * 1000); // Convert minutes to milliseconds
    
    isTrackingRef.current = true;
  }, [interval, token, sendCurrentLocation]);

  // Stop location tracking
  const stopTracking = useCallback(() => {
    if (!isTrackingRef.current) return;

    console.log('🛑 Stopping location tracking');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Disconnect location tracking socket
    // disconnectLocationTracking();
    
    isTrackingRef.current = false;
  }, []);

  // Auto-start tracking when enabled and token is available
  useEffect(() => {
    if (enabled && token) {
      startTracking();
    } else {
      stopTracking();
    }

    // Cleanup on unmount
    return () => {
      stopTracking();
    };
  }, [enabled, token, startTracking, stopTracking]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // disconnectLocationTracking();
    };
  }, []);

  return {
    isTracking: isTrackingRef.current,
    lastLocation: lastLocationRef.current,
    error: errorRef.current,
    startTracking,
    stopTracking
  };
};

export default useLocationTracking;
