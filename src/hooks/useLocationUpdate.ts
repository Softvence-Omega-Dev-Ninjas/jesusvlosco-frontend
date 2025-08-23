import { useEffect, useRef, useCallback } from 'react';
import { useSendUpdateLocationMutation } from '@/store/api/clockInOut/clockinoutapi';

interface LocationUpdateOptions {
  intervalMinutes?: number; // Update interval in minutes (default: 1)
  enableLocationOptimization?: boolean; // Only send if location changed significantly (default: true)
  fallbackLocation?: { lat: number; lng: number }; // Fallback location if geolocation fails
  onLocationUpdate?: (location: { lat: number; lng: number }) => void; // Callback when location is updated
  onError?: (error: GeolocationPositionError) => void; // Callback when geolocation fails
}

interface UseLocationUpdateReturn {
  startTracking: () => void;
  stopTracking: () => void;
  updateLocation: () => void;
  isTracking: boolean;
}

/**
 * Custom hook for automatic location updates
 * This hook will automatically send the user's current location to the server
 * at specified intervals without affecting the UI
 */
export const useLocationUpdate = (options: LocationUpdateOptions = {}): UseLocationUpdateReturn => {
  const {
    intervalMinutes = 1,
    enableLocationOptimization = true,
    fallbackLocation = { lat: 23.8103, lng: 90.4125 },
    onLocationUpdate,
    onError
  } = options;

  const [sendUpdateLocation] = useSendUpdateLocationMutation();
  const intervalRef = useRef<number | null>(null);
  const lastKnownLocation = useRef<{ lat: number; lng: number } | null>(null);
  const isTrackingRef = useRef<boolean>(false);

  // Function to get current location and send update
  const updateCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Check if location changed significantly (optional optimization)
        const hasLocationChanged = !enableLocationOptimization || 
          !lastKnownLocation.current || 
          Math.abs(lastKnownLocation.current.lat - location.lat) > 0.0001 ||
          Math.abs(lastKnownLocation.current.lng - location.lng) > 0.0001;

        if (hasLocationChanged) {
          lastKnownLocation.current = location;
          
          // Send location update silently
          sendUpdateLocation(location)
            .unwrap()
            .then(() => {
              console.log('Location updated successfully:', location);
              onLocationUpdate?.(location);
            })
            .catch((error) => {
              console.error('Failed to update location:', error);
            });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        onError?.(error);
        
        // Fallback to default location if needed
        if (!lastKnownLocation.current && fallbackLocation) {
          sendUpdateLocation(fallbackLocation)
            .unwrap()
            .then(() => {
              console.log('Fallback location sent:', fallbackLocation);
              onLocationUpdate?.(fallbackLocation);
            })
            .catch((err) => {
              console.error('Failed to send fallback location:', err);
            });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache location for 1 minute
      }
    );
  }, [sendUpdateLocation, enableLocationOptimization, fallbackLocation, onLocationUpdate, onError]);

  // Start location tracking
  const startTracking = useCallback(() => {
    if (isTrackingRef.current) return;

    isTrackingRef.current = true;
    
    // Send initial location update
    updateCurrentLocation();

    // Set up interval to update location
    const intervalMs = intervalMinutes * 60 * 1000;
    intervalRef.current = window.setInterval(() => {
      updateCurrentLocation();
    }, intervalMs);

    console.log(`Location tracking started. Updates every ${intervalMinutes} minute(s).`);
  }, [updateCurrentLocation, intervalMinutes]);

  // Stop location tracking
  const stopTracking = useCallback(() => {
    if (!isTrackingRef.current) return;

    isTrackingRef.current = false;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    console.log('Location tracking stopped.');
  }, []);

  // Manual location update
  const updateLocation = useCallback(() => {
    updateCurrentLocation();
  }, [updateCurrentLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    startTracking,
    stopTracking,
    updateLocation,
    isTracking: isTrackingRef.current
  };
};

export default useLocationUpdate;
