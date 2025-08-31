import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, X, Navigation, Search, Loader } from "lucide-react";

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
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  // Initialize geocoder and search services when maps API is loaded
  React.useEffect(() => {
    if (isLoaded) {
      console.log('Google Maps API loaded successfully');

      if (!geocoderRef.current) {
        geocoderRef.current = new google.maps.Geocoder();
        console.log('Geocoder initialized');
      }

      // Check if Places library is available
      if (typeof google.maps.places === "undefined") {
        console.error("Google Maps Places library is not available. This may be due to:");
        console.error("1. Places API not enabled for your API key");
        console.error("2. Incorrect API key");
        console.error("3. Network connectivity issues");
        console.error("4. API quota exceeded");
        return;
      }

      if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        console.log('AutocompleteService initialized');
      }
    } else {
      console.log('Google Maps API not yet loaded');
    }
  }, [isLoaded]);

  // Initialize PlacesService when map is loaded
  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (
      !placesServiceRef.current &&
      typeof google.maps.places !== "undefined" &&
      typeof google.maps.places.PlacesService !== "undefined"
    ) {
      placesServiceRef.current = new google.maps.places.PlacesService(map);
    } else if (typeof google.maps.places === "undefined" || typeof google.maps.places.PlacesService === "undefined") {
      console.error("Google Maps Places library is not loaded. Please check your API key and libraries configuration.");
    }
  }, []);

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
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    onChange(null);
  }, [onChange]);

  // Fallback search using Geocoder API
  const searchWithGeocoder = useCallback(async (query: string) => {
    if (!geocoderRef.current) {
      console.error('Geocoder not available');
      setIsSearching(false);
      return;
    }

    try {
      console.log('Searching with Geocoder for:', query);

      const response = await geocoderRef.current.geocode({
        address: query,
        // Add location bias
        bounds: {
          north: mapCenter.lat + 0.1,
          south: mapCenter.lat - 0.1,
          east: mapCenter.lng + 0.1,
          west: mapCenter.lng - 0.1,
        },
      });

      setIsSearching(false);

      if (response.results && response.results.length > 0) {
        // Convert geocoder results to suggestion format
        const mockSuggestions = response.results.slice(0, 5).map((result, index) => ({
          place_id: result.place_id || `geocoder-${index}`,
          description: result.formatted_address,
          structured_formatting: {
            main_text: result.formatted_address.split(',')[0],
            secondary_text: result.formatted_address.split(',').slice(1).join(',').trim(),
          },
          types: result.types || [],
        }));

        setSuggestions(mockSuggestions as google.maps.places.AutocompletePrediction[]);
        setShowSuggestions(true);
        console.log('Geocoder suggestions set:', mockSuggestions.length);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        console.log('No geocoder results found');
      }
    } catch (error) {
      console.error('Geocoder search failed:', error);
      setIsSearching(false);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [mapCenter]);

  // Search for location suggestions
  const searchLocations = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);

    try {
      // Try Places API first
      if (autocompleteServiceRef.current) {
        const request = {
          input: query,
          // Add location bias for better results
          location: new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
          radius: 50000, // 50km radius
        };

        console.log('Searching with Places API for:', query);

        autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
          setIsSearching(false);
          console.log('Places API search status:', status);
          console.log('Places API predictions:', predictions);

          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
            console.log('Places API suggestions set:', predictions.length);
          } else {
            console.warn('Places API failed, trying Geocoder fallback. Status:', status);
            // Fallback to Geocoder API
            searchWithGeocoder(query);
          }
        });
      } else {
        console.log('Places API not available, using Geocoder fallback');
        // Fallback to Geocoder API
        searchWithGeocoder(query);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setIsSearching(false);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [mapCenter, searchWithGeocoder]);  // Handle search input changes with debouncing
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
      console.error('PlacesService not initialized, trying to initialize...');
      // If PlacesService is not available, try geocoding as fallback
      if (geocoderRef.current) {
        try {
          const geocodeResult = await geocoderRef.current.geocode({ placeId: placeId });
          if (geocodeResult.results && geocodeResult.results.length > 0) {
            const result = geocodeResult.results[0];
            const location = result.geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            
            setSelectedPosition({ lat, lng });
            setMapCenter({ lat, lng });
            
            const locationData: LocationCoordinates = {
              latitude: lat,
              longitude: lng,
              address: result.formatted_address || description,
            };

            setAddressText(locationData.address || '');
            setSearchQuery(description);
            setShowSuggestions(false);
            console.log('Location selected via geocoding:', locationData);
            onChange(locationData);
            return;
          }
        } catch (error) {
          console.error('Geocoding fallback failed:', error);
        }
      }
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
          const lat = location.lat();
          const lng = location.lng();
          
          setSelectedPosition({ lat, lng });
          setMapCenter({ lat, lng });
          
          const locationData: LocationCoordinates = {
            latitude: lat,
            longitude: lng,
            address: place.formatted_address || place.name || description,
          };

          setAddressText(locationData.address || '');
          setSearchQuery(place.name || description);
          setShowSuggestions(false);
          console.log('Location selected via PlacesService:', locationData);
          onChange(locationData);
        }
      } else {
        console.error('Place details request failed:', status);
      }
    });
  }, [onChange]);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion: google.maps.places.AutocompletePrediction) => {
    console.log('Suggestion clicked:', suggestion.description);
    // Immediately hide suggestions but keep modal open
    setShowSuggestions(false);
    setSearchQuery(suggestion.structured_formatting.main_text);
    
    // Small delay to ensure map and services are ready
    setTimeout(() => {
      getPlaceDetails(suggestion.place_id, suggestion.description);
    }, 100);
  }, [getPlaceDetails]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

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

            {/* Search Section */}
            <div className="p-4 border-b bg-gray-50">
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for restaurants, addresses, landmarks..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    {isSearching && <Loader className="animate-spin h-4 w-4 text-blue-500" />}
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

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
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
              
              <p className="text-xs text-gray-600 mt-2">
                💡 Search for a location above or click anywhere on the map below
              </p>
            </div>

            {/* Map Container */}
            <div className="relative">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={selectedPosition ? 15 : 10}
                onClick={handleMapClick}
                onLoad={onMapLoad}
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
                  <strong>Search above</strong> or <strong>click anywhere on the map</strong> to select a location. You can also use the "Current Location" button to use your GPS location.
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
