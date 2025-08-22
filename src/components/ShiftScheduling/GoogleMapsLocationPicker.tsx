import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, X, Navigation } from "lucide-react";

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

interface GoogleMapsLocationPickerProps {
  value?: LocationCoordinates | null;
  onChange: (location: LocationCoordinates | null) => void;
  placeholder?: string;
  className?: string;
  apiKey: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 40.7128, // New York City coordinates as default
  lng: -74.006,
};

const GoogleMapsLocationPicker: React.FC<GoogleMapsLocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Click to select location on map",
  className = "",
  apiKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    value ? { lat: value.latitude, lng: value.longitude } : defaultCenter
  );
  const [selectedPosition, setSelectedPosition] =
    useState<google.maps.LatLngLiteral | null>(
      value ? { lat: value.latitude, lng: value.longitude } : null
    );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [addressText, setAddressText] = useState(value?.address || "");

  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  // Initialize geocoder when maps API is loaded
  React.useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  // Update address display when value changes
  React.useEffect(() => {
    if (value) {
      setAddressText(
        value.address ||
          `${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`
      );
      setSelectedPosition({ lat: value.latitude, lng: value.longitude });
      setMapCenter({ lat: value.latitude, lng: value.longitude });
    } else {
      setAddressText("");
      setSelectedPosition(null);
    }
  }, [value]);

  // Reverse geocode coordinates to get address
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    if (!geocoderRef.current) return null;

    try {
      const response = await geocoderRef.current.geocode({
        location: { lat, lng },
      });

      if (response.results && response.results.length > 0) {
        return response.results[0].formatted_address;
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
    return null;
  }, []);

  // Handle map click to select location
  const handleMapClick = useCallback(
    async (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        setSelectedPosition({ lat, lng });

        // Get address for the coordinates
        const address = await reverseGeocode(lat, lng);

        const locationData: LocationCoordinates = {
          latitude: lat,
          longitude: lng,
          address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        };

        onChange(locationData);
      }
    },
    [onChange, reverseGeocode]
  );

  // Get current location using browser's geolocation API
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setMapCenter({ lat, lng });
        setSelectedPosition({ lat, lng });

        // Get address for current location
        const address = await reverseGeocode(lat, lng);

        const locationData: LocationCoordinates = {
          latitude: lat,
          longitude: lng,
          address:
            address ||
            `Current Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
        };

        onChange(locationData);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Unable to get your current location. Please select a location on the map."
        );
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onChange, reverseGeocode]);

  // Clear selected location
  const clearLocation = useCallback(() => {
    setSelectedPosition(null);
    setAddressText("");
    onChange(null);
  }, [onChange]);

  // Handle confirm selection
  const handleConfirm = () => {
    setIsOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className={`${className}`}>
        <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">
              Loading Google Maps...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Input Field */}
      <div className="relative">
        <input
          type="text"
          value={addressText}
          readOnly
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md p-2 pr-10 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MapPin
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          size={18}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Map Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Location
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  <Navigation size={14} />
                  {isGettingLocation ? "Getting..." : "Current Location"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={selectedPosition ? 15 : 10}
                onClick={handleMapClick}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: false,
                }}
              >
                {selectedPosition && (
                  <Marker
                    position={selectedPosition}
                    animation={google.maps.Animation.DROP}
                  />
                )}
              </GoogleMap>

              {/* Instructions overlay */}
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-md p-3 shadow-md max-w-xs">
                <p className="text-sm text-gray-700">
                  <strong>Click anywhere on the map</strong> to select a
                  location, or use the "Current Location" button to use your GPS
                  location.
                </p>
              </div>
            </div>

            {/* Selected Location Info */}
            {selectedPosition && (
              <div className="p-4 border-t bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Latitude:</span>
                    <span className="ml-2">
                      {selectedPosition.lat.toFixed(6)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Longitude:
                    </span>
                    <span className="ml-2">
                      {selectedPosition.lng.toFixed(6)}
                    </span>
                  </div>
                  <div className="md:col-span-1">
                    <span className="font-medium text-gray-700">Address:</span>
                    <span className="ml-2 text-xs">
                      {value?.address || "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-600">
                {selectedPosition
                  ? "Location selected"
                  : "Click on the map to select a location"}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearLocation}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Clear
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedPosition}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsLocationPicker;
