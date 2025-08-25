import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Search, MapPin, Navigation, X, Loader } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  placeId?: string;
  formattedAddress?: string;
}

interface LocationSearchComponentProps {
  apiKey: string;
  onLocationSelect: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  showMap?: boolean;
  initialLocation?: LocationData | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 40.7128, // New York City coordinates as default
  lng: -74.006,
};

const LocationSearchComponent: React.FC<LocationSearchComponentProps> = ({
  apiKey,
  onLocationSelect,
  placeholder = "Search for a location...",
  className = "",
  showMap = true,
  initialLocation = null,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(initialLocation);
  const [mapCenter, setMapCenter] = useState(
    initialLocation ? { lat: initialLocation.latitude, lng: initialLocation.longitude } : defaultCenter
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  // Initialize Google Maps services
  useEffect(() => {
    if (isLoaded) {
      if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      }
      if (!geocoderRef.current) {
        geocoderRef.current = new google.maps.Geocoder();
      }
    }
  }, [isLoaded]);

  // Initialize PlacesService when map is loaded
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (!placesServiceRef.current) {
      placesServiceRef.current = new google.maps.places.PlacesService(map);
    }
  }, []);

  // Search for location suggestions
  const searchLocations = useCallback(async (query: string) => {
    if (!autocompleteServiceRef.current || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const request = {
        input: query,
      };

      autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
        setIsSearching(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      });
    } catch (error) {
      console.error('Error searching locations:', error);
      setIsSearching(false);
      setSuggestions([]);
    }
  }, []);

  // Handle search input changes with debouncing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  }, [searchLocations]);

  // Get detailed information about a selected place
  const getPlaceDetails = useCallback(async (placeId: string, description: string) => {
    if (!placesServiceRef.current) {
      console.error('PlacesService not initialized');
      return;
    }

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['geometry', 'formatted_address', 'name', 'place_id'],
    };

    placesServiceRef.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry) {
        const location = place.geometry.location;
        if (location) {
          const locationData: LocationData = {
            latitude: location.lat(),
            longitude: location.lng(),
            address: place.name || description,
            formattedAddress: place.formatted_address || description,
            placeId: place.place_id,
          };

          setSelectedLocation(locationData);
          setMapCenter({ lat: location.lat(), lng: location.lng() });
          setSearchQuery(place.name || description);
          setShowSuggestions(false);
          onLocationSelect(locationData);
        }
      }
    });
  }, [onLocationSelect]);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion: google.maps.places.AutocompletePrediction) => {
    getPlaceDetails(suggestion.place_id, suggestion.description);
  }, [getPlaceDetails]);

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

        // Reverse geocode to get address
        if (geocoderRef.current) {
          try {
            const response = await geocoderRef.current.geocode({
              location: { lat, lng },
            });

            const address = response.results?.[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            const locationData: LocationData = {
              latitude: lat,
              longitude: lng,
              address: 'Current Location',
              formattedAddress: address,
            };

            setSelectedLocation(locationData);
            setMapCenter({ lat, lng });
            setSearchQuery('Current Location');
            onLocationSelect(locationData);
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
          }
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your current location. Please search for a location instead.");
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onLocationSelect]);

  // Handle map click
  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (event.latLng && geocoderRef.current) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      try {
        const response = await geocoderRef.current.geocode({
          location: { lat, lng },
        });

        const address = response.results?.[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        const locationData: LocationData = {
          latitude: lat,
          longitude: lng,
          address: 'Selected Location',
          formattedAddress: address,
        };

        setSelectedLocation(locationData);
        setSearchQuery(address);
        onLocationSelect(locationData);
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
      }
    }
  }, [onLocationSelect]);

  // Clear search and selection
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSelectedLocation(null);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  if (!isLoaded) {
    return (
      <div className={`${className}`}>
        <div className="w-full border border-gray-300 rounded-md p-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <Loader className="animate-spin h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Loading Google Maps...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {isSearching && <Loader className="animate-spin h-4 w-4 text-blue-500" />}
            <button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-50"
              title="Use current location"
            >
              <Navigation size={16} />
            </button>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 text-gray-400 flex-shrink-0" size={16} />
                  <div>
                    <div className="font-medium text-gray-900">
                      {suggestion.structured_formatting.main_text}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.structured_formatting.secondary_text}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start gap-2">
            <MapPin className="mt-1 text-blue-500 flex-shrink-0" size={16} />
            <div className="flex-1">
              <div className="font-medium text-blue-900">{selectedLocation.address}</div>
              <div className="text-sm text-blue-700">{selectedLocation.formattedAddress}</div>
              <div className="text-xs text-blue-600 mt-1">
                Lat: {selectedLocation.latitude.toFixed(6)}, Lng: {selectedLocation.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Display */}
      {showMap && (
        <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={selectedLocation ? 15 : 10}
            onClick={handleMapClick}
            onLoad={onMapLoad}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: false,
            }}
          >
            {selectedLocation && (
              <Marker
                position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
                animation={google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
          
          {/* Map Instructions */}
          <div className="p-2 bg-gray-50 border-t">
            <p className="text-xs text-gray-600">
              💡 You can also click anywhere on the map to select a location
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearchComponent;
