// Google Maps Location Service for accurate location detection
import { Loader } from '@googlemaps/js-api-loader';

interface LocationResult {
  latitude: number;
  longitude: number;
  address: string;
  accuracy?: number;
  timestamp: number;
}

interface LocationError {
  code: number;
  message: string;
}

// Initialize Google Maps API
let isGoogleMapsLoaded = false;
let geocoder: google.maps.Geocoder | null = null;

const initializeGoogleMaps = async (): Promise<void> => {
  if (isGoogleMapsLoaded && geocoder) return;

  try {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    await loader.load();
    geocoder = new google.maps.Geocoder();
    isGoogleMapsLoaded = true;
  } catch (error) {
    console.error('Error loading Google Maps API:', error);
    throw new Error('Failed to load Google Maps API');
  }
};

// Get address from coordinates using Google Maps Geocoding API
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  if (!geocoder) {
    await initializeGoogleMaps();
  }

  if (!geocoder) {
    throw new Error('Google Maps Geocoder not available');
  }

  try {
    const response = await geocoder.geocode({
      location: { lat, lng }
    });

    if (response.results && response.results.length > 0) {
      return response.results[0].formatted_address;
    } else {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

// Get current location with high accuracy using browser geolocation + Google Maps
export const getCurrentLocationWithGoogleMaps = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by this browser'
      } as LocationError);
      return;
    }

    // Use high accuracy geolocation options
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 seconds timeout (increased from 15s)
      maximumAge: 0 // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Get accurate address using Google Maps Geocoding API
          const address = await reverseGeocode(latitude, longitude);

          const result: LocationResult = {
            latitude,
            longitude,
            address,
            accuracy,
            timestamp: Date.now()
          };

          resolve(result);
        } catch (geocodingError) {
          // If reverse geocoding fails, still return the coordinates
          console.warn('Reverse geocoding failed:', geocodingError);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          });
        }
      },
      (error) => {
        let errorMessage = 'Unknown location error';
        
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

        reject({
          code: error.code,
          message: errorMessage
        } as LocationError);
      },
      options
    );
  });
};

// Get current location using only browser geolocation (fallback method)
export const getCurrentLocationFallback = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by this browser'
      } as LocationError);
      return;
    }

    // Use high accuracy geolocation options
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout (shorter for fallback)
      maximumAge: 60000 // Allow cached position for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const result: LocationResult = {
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, // Simple coordinate format
          accuracy,
          timestamp: Date.now()
        };

        resolve(result);
      },
      (error) => {
        let errorMessage = 'Unknown location error';

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

        reject({
          code: error.code,
          message: errorMessage
        } as LocationError);
      },
      options
    );
  });
};

// Utility function to format location for API
export const formatLocationForAPI = (location: LocationResult) => {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address,
    accuracy: location.accuracy,
    timestamp: new Date(location.timestamp).toISOString()
  };
};

// Validate if coordinates are within reasonable bounds
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
