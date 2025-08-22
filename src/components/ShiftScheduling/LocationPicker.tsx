import React, { useState, useEffect } from 'react';
import { MapPin, Target, Search } from 'lucide-react';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationPickerProps {
  value?: LocationCoordinates | null;
  onChange: (location: LocationCoordinates | null) => void;
  placeholder?: string;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Enter location or coordinates",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Update local state when value prop changes
  useEffect(() => {
    if (value) {
      setManualLat(value.latitude.toString());
      setManualLng(value.longitude.toString());
      setSearchQuery(value.address || `${value.latitude}, ${value.longitude}`);
    }
  }, [value]);

  // Get current location using browser's geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: `Current Location (${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)})`
        };
        onChange(coords);
        setSearchQuery(coords.address);
        setIsGettingLocation(false);
        setIsOpen(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your current location. Please enter coordinates manually.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Handle manual coordinate input
  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude values.');
      return;
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90 degrees.');
      return;
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180 degrees.');
      return;
    }

    const coords = {
      latitude: lat,
      longitude: lng,
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    };
    
    onChange(coords);
    setSearchQuery(coords.address);
    setIsOpen(false);
  };

  // Handle address search (you can integrate with a geocoding service like Google Maps)
  const handleAddressSearch = () => {
    if (!searchQuery.trim()) return;

    // For demonstration, we'll parse if it looks like coordinates
    const coordsMatch = searchQuery.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (coordsMatch) {
      const lat = parseFloat(coordsMatch[1]);
      const lng = parseFloat(coordsMatch[2]);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const coords = {
          latitude: lat,
          longitude: lng,
          address: searchQuery
        };
        onChange(coords);
        setIsOpen(false);
        return;
      }
    }

    // Here you would typically integrate with a geocoding service
    // For now, we'll just alert that this feature needs API integration
    alert('Address geocoding requires integration with a mapping service (Google Maps, Mapbox, etc.)');
  };

  const clearLocation = () => {
    onChange(null);
    setSearchQuery('');
    setManualLat('');
    setManualLng('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Input Field */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MapPin 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          size={18}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          {/* Current Location Button */}
          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-50 rounded-md mb-3 disabled:opacity-50"
          >
            <Target size={16} className="text-blue-500" />
            <span className="text-sm">
              {isGettingLocation ? 'Getting location...' : 'Use current location'}
            </span>
          </button>

          {/* Address Search */}
          <div className="mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search address or enter coordinates"
                className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
              />
              <button
                onClick={handleAddressSearch}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Search size={14} />
              </button>
            </div>
          </div>

          {/* Manual Coordinates */}
          <div className="border-t pt-3">
            <p className="text-xs text-gray-600 mb-2">Or enter coordinates manually:</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="-90 to 90"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="-180 to 180"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleManualCoordinates}
                className="flex-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
              >
                Set Coordinates
              </button>
              <button
                onClick={clearLocation}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
              >
                Close
              </button>
            </div>
          </div>

          {/* Selected Location Display */}
          {value && (
            <div className="border-t pt-3 mt-3">
              <p className="text-xs text-gray-600 mb-1">Selected Location:</p>
              <div className="text-sm">
                <p><strong>Latitude:</strong> {value.latitude.toFixed(6)}</p>
                <p><strong>Longitude:</strong> {value.longitude.toFixed(6)}</p>
                {value.address && <p><strong>Address:</strong> {value.address}</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LocationPicker;
