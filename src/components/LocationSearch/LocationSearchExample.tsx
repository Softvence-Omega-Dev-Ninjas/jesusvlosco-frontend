import React, { useState } from 'react';
import LocationSearchComponent from './LocationSearchComponent';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  placeId?: string;
  formattedAddress?: string;
}

const LocationSearchExample: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const handleLocationSelect = (location: LocationData) => {
    console.log('📍 Selected Location:', location);
    setSelectedLocation(location);
    
    // You can now use this location data for your application
    // For example, send it to your API, update state, etc.
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🔍 Location Search Example
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for a location:
            </label>
            <LocationSearchComponent
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
              onLocationSelect={handleLocationSelect}
              placeholder="Search for restaurants, addresses, landmarks..."
              className="w-full"
              showMap={true}
            />
          </div>
          
          {selectedLocation && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ✅ Location Selected!
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-green-700">Name:</span>
                  <span className="ml-2 text-green-800">{selectedLocation.address}</span>
                </div>
                <div>
                  <span className="font-medium text-green-700">Full Address:</span>
                  <span className="ml-2 text-green-800">{selectedLocation.formattedAddress}</span>
                </div>
                <div>
                  <span className="font-medium text-green-700">Coordinates:</span>
                  <span className="ml-2 text-green-800">
                    {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                  </span>
                </div>
                {selectedLocation.placeId && (
                  <div>
                    <span className="font-medium text-green-700">Place ID:</span>
                    <span className="ml-2 text-green-800 font-mono text-xs">
                      {selectedLocation.placeId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🚀 Features:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>**Real-time search** with Google Places API autocomplete</li>
          <li>**Click on map** to select any location</li>
          <li>**Current location** detection with GPS</li>
          <li>**Accurate coordinates** and detailed address information</li>
          <li>**Debounced search** for better performance</li>
          <li>**Responsive design** works on desktop and mobile</li>
        </ul>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          💡 Usage Tips:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
          <li>Start typing to see autocomplete suggestions</li>
          <li>Click the navigation icon to use your current location</li>
          <li>Click anywhere on the map to select that exact spot</li>
          <li>The component returns detailed location data including coordinates</li>
          <li>Perfect for address selection, restaurant finding, or any location-based features</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationSearchExample;
