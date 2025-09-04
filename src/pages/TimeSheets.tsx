
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet's core CSS
import React, { useState, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  LocationPinIcon,
  SearchIcon,
} from "@/components/TimeSheets/Icons";

// --- Leaflet Default Icon Fix (IMPORTANT for marker display) ---
// This is necessary because Webpack/Vite might not correctly bundle Leaflet's default icons.
// These URLs point to Leaflet's CDN, ensuring the icons load correctly.
import PendingRequestModal from "@/components/TimeSheets/PendingRequestModal";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { useGetAllTimeClockAdminQuery, useGetAllTimeSheetAdminQuery } from "@/store/api/admin/time-clock/timeClockApi";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: shadow,
});
// --- End Leaflet Default Icon Fix ---

// Add custom CSS for user markers and enhanced popups
const markerStyles = `
  .custom-user-marker-with-pointer {
    background: none !important;
    border: none !important;
  }
  .custom-user-marker-with-pointer img {
    border-radius: 50% !important;
  }
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
    border: 1px solid #e5e7eb !important;
    min-width: 300px !important;
    max-width: 350px !important;
  }
  .custom-popup .leaflet-popup-content {
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    max-height: 400px !important;
    overflow-y: auto !important;
  }
  .custom-popup .leaflet-popup-tip {
    border-top-color: #fff !important;
  }
  .custom-popup .leaflet-popup-close-button {
    color: #6b7280 !important;
    font-size: 18px !important;
    font-weight: bold !important;
    width: 24px !important;
    height: 24px !important;
    right: 8px !important;
    top: 8px !important;
  }
  .custom-popup .leaflet-popup-close-button:hover {
    color: #374151 !important;
    background: #f3f4f6 !important;
    border-radius: 50% !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = markerStyles;
  document.head.appendChild(styleSheet);
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: shadow,
});
// --- End Leaflet Default Icon Fix ---

// 2. INTERFACES
interface TimeSheetEntry {
  id?: string; // Add optional id field for React key
  user: {
    id: string;
    name: string;
    email: string;
    profileUrl?: string;
  };
  shift: {
    title: string;
    location: string;
  } | null;
  clockIn: string;
  clockOut: string;
  clockInLng: number;
  clockInLat: number;
  totalHours: string;
  regularHours: string;
  overTime: string;
  regularPayment: string;
  overTimePayment: string;
  totalPayment: string;
}



// 3. TIMESHEETS COMPONENT
export default function TimeSheets() {
  
  // 3.1. STATE MANAGEMENT
  const [searchQuery, setSearchQuery] = useState<string>("");
  // State for selected date (use simple date string for input)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
  );
  
  // Map reference for programmatic control
  const mapRef = useRef<L.Map | null>(null);
  
  // Format date for API (convert YYYY-MM-DD to ISO string)
  const formatDateForAPI = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const { data } = useGetAllTimeClockAdminQuery(null);
  const { data: timeSheetData } = useGetAllTimeSheetAdminQuery(formatDateForAPI(selectedDate));
  console.log("Time Sheet Data:", timeSheetData);
  console.log("Time Sheet Entries:", timeSheetData?.data);
  console.log("Selected Date (formatted for API):", formatDateForAPI(selectedDate));

  const pendingTimeClockRequest = data?.data?.filter(
    (el: { shiftStatus: string }) => el.shiftStatus === "DRAFT"
  );
  console.log({ pendingTimeClockRequest });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // New state for modal visibility

  // 3.3. DERIVED DATA & HELPERS
  // Transform API data to display format
  const timeSheetEntries: TimeSheetEntry[] = timeSheetData?.data || [];
  
  // Helper function to format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Filter timesheet data based on search query
  const filteredTimeSheetData: TimeSheetEntry[] = timeSheetEntries.filter(
    (entry: TimeSheetEntry) => {
      // Safely get user name with null checks
      const userName = entry?.user?.name?.toLowerCase() || '';
      
      // Safely get shift info with null checks
      const shiftTitle = entry?.shift?.title?.toLowerCase() || '';
      const shiftLocation = entry?.shift?.location?.toLowerCase() || '';
      
      const query = searchQuery.toLowerCase();
      
      return userName.includes(query) ||
             shiftTitle.includes(query) ||
             shiftLocation.includes(query);
    }
  );

  // Helper function to get unique user locations for map markers
  const getUniqueUserLocations = () => {
    const uniqueUsers = new Map();
    
    filteredTimeSheetData.forEach((entry: TimeSheetEntry) => {
      const userId = entry.user.id;
      const userName = entry.user.name;
      const lat = entry.clockInLat;
      const lng = entry.clockInLng;
      const profileUrl = entry.user.profileUrl;
      const shiftTitle = entry.shift?.title || 'No Shift Assigned';
      
      // Only add if we have valid coordinates and haven't seen this user yet
      if (lat && lng && !uniqueUsers.has(userId)) {
        uniqueUsers.set(userId, {
          id: userId,
          name: userName,
          lat: lat,
          lng: lng,
          profileUrl: profileUrl,
          shiftTitle: shiftTitle,
          clockIn: entry.clockIn,
          clockOut: entry.clockOut
        });
      }
    });
    
    return Array.from(uniqueUsers.values());
  };

  const uniqueUserLocations = getUniqueUserLocations();
  console.log("Unique User Locations for Map:", uniqueUserLocations);

  // Custom map icons
  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  // Custom icon for user locations (user image with location marker)
  const createUserIcon = (profileUrl: string | undefined, userName: string) => {
    const imageUrl = profileUrl || 'https://randomuser.me/api/portraits/men/77.jpg';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 55px;
          height: 60px;
        ">
          <!-- Location marker pointer -->
          <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-top: 25px solid #1b24d1;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            z-index: 1;
          "></div>

          <!-- Circular user image -->
          <div style="
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid #11bb5a;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
            z-index: 2;
          ">
            <img
              src="${imageUrl}"
              alt="${userName}"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
              "
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div style="
              display: none;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
            ">
              ${initials}
            </div>
          </div>
        </div>
      `,
      className: 'custom-user-marker-with-pointer',
      iconSize: [55, 60],
      iconAnchor: [27.5, 60], // Center bottom of the marker
      popupAnchor: [0, -60] // Popup appears above the marker
    });
  };

  const handlePendingRequestsClick = (): void => {
    setIsModalOpen(true); // Open the modal when button is clicked
  };

  const closeModal = (): void => {
    setIsModalOpen(false); // Close the modal
  };

  // Handle marker click - zoom to max level and center on location
  const handleMarkerClick = (lat: number, lng: number) => {
    if (mapRef.current) {
      const map = mapRef.current;
      // Set view to the clicked location with maximum zoom level (18-19 is typical max for most tile servers)
      map.setView([lat, lng], 18, {
        animate: true,
        duration: 1.0 // Smooth animation duration in seconds
      });
    }
  };

  // Map Configuration
  const defaultCoordinates: [number, number] = [ 51.1514578, -114.0825065]; // Corrected coordinates for central Dhaka
  const mapZoom = 11; // Good initial zoom level for city view
  const mapStyle = {
    height: "650px", // Adjusted height to be visually balanced
    width: "100%",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  // 3.4. RENDER METHOD (JSX Structure)
  return (
    <div
      className={`py-4 bg-gray-50  min-h-screen ${
        isModalOpen ? "overflow-hidden" : ""
      }`}
    >
      {/* Main content with conditional opacity */}
      <div
        className={`${
          isModalOpen ? "opacity-50  pointer-events-none" : ""
        } transition-all duration-300`}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Time Clock</h2>

        {/* --- DASHBOARD HEADER SECTION --- */}
        <section className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          {/* Date Picker */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">Select Date:</span>
            <div className="relative">
              <input
                type="date"
                className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                value={selectedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSelectedDate(e.target.value)
                }
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
              />
            </div>
          </div>

          {/* Search and Pending Requests */}
          <div className="flex flex-col  sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Pending Requests Button (Badge) */}
            <button
              onClick={handlePendingRequestsClick}
              className="relative cursor-pointer flex items-center justify-center px-4 py-2 rounded-full border border-yellow-500 text-yellow-700 font-semibold text-sm bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200 whitespace-nowrap"
            >
              <span className="absolute -top-2 -left-2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                {pendingTimeClockRequest?.length}
              </span>
              <span className="block leading-tight">Pending Requests</span>
            </button>

            <div className="relative w-full bg-white sm:w-auto">
              {/* Search Input */}
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* --- MAIN TABLE CONTENT SECTION --- */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]"
                  >
                    Shift
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Clock In
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Clock Out
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Total Hours
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Regular
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Total Overtime
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Paid Time-off
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]"
                  >
                    Regular Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTimeSheetData.length > 0 ? (
                  // Use real API data
                  filteredTimeSheetData.map((entry: TimeSheetEntry, index: number) => {
                    // Safely extract user data with null checks
                    const userName = entry?.user?.name || 'Unknown User';
                    const profileUrl = entry?.user?.profileUrl || 'https://randomuser.me/api/portraits/men/77.jpg';
                    
                    // Safely extract shift data with null checks
                    const shiftTitle = entry?.shift?.title || 'No Shift Assigned';
                    const shiftLocation = entry?.shift?.location || 'No Location';
                    
                    // Use entry.id if available, otherwise fall back to user.id + index
                    const rowKey = entry.id || `${entry.user.id}-${index}`;
                    
                    return (
                    <tr key={rowKey} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={profileUrl}
                              alt={userName}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shiftTitle}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <LocationPinIcon className="w-4 h-4 mr-1" />
                          {shiftLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(entry.clockIn || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(entry.clockOut || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.totalHours || '0'} hours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.regularHours || '0'} hours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.overTime || '0'} hours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        N/A
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${parseFloat(entry.regularPayment || '0').toFixed(2)}
                      </td>
                    </tr>
                    );
                  })
                ) : (
                  // Show message when no data is available
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-medium mb-2">No timesheet data found</div>
                        <div className="text-sm">Please select a different date or check if there are any entries for the selected period.</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- REAL MAP SECTION --- */}
        <section className="mt-6 ">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Employee Locations ({uniqueUserLocations.length} users)
            </h3>
            {uniqueUserLocations.length > 0 && (
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                � = Employee Profile Image (Circular)
              </div>
            )}
          </div>
          
          {uniqueUserLocations.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                📍 No employee locations found for the selected date. Select a different date to view employee locations on the map.
              </p>
            </div>
          )}
          
          <MapContainer
            key="employee-locations-map"
            center={uniqueUserLocations.length > 0 ? [uniqueUserLocations[0].lat, uniqueUserLocations[0].lng] : defaultCoordinates}
            zoom={uniqueUserLocations.length > 0 ? 12 : mapZoom}
            style={mapStyle}
            scrollWheelZoom={true}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {uniqueUserLocations.map((userLocation) => (
              <Marker
                key={userLocation.id}
                position={[userLocation.lat, userLocation.lng]}
                icon={createUserIcon(userLocation.profileUrl, userLocation.name)}
                eventHandlers={{
                  click: () => handleMarkerClick(userLocation.lat, userLocation.lng)
                }}
              >
                <Popup 
                  maxWidth={350} 
                  minWidth={300}
                  maxHeight={400}
                  className="custom-popup"
                  closeButton={true}
                  autoClose={false}
                  closeOnEscapeKey={true}
                >
                  <div className="p-4 min-w-[300px] max-w-[340px]">
                    <div className="flex items-center space-x-3 mb-4">
                      {userLocation.profileUrl && (
                        <img 
                          src={userLocation.profileUrl} 
                          alt={userLocation.name}
                          className="w-14 h-14 rounded-full border-2 border-blue-200 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-lg truncate">{userLocation.name}</h4>
                        <p className="text-sm text-blue-600 font-medium truncate">{userLocation.shiftTitle}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-green-600 font-medium mb-1">Clock In</p>
                            <p className="text-green-800 font-semibold text-sm">{formatTime(userLocation.clockIn)}</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-red-600 font-medium mb-1">Clock Out</p>
                            <p className="text-red-800 font-semibold text-sm">{formatTime(userLocation.clockOut)}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 font-medium mb-2">📍 GPS Coordinates</p>
                          <p className="text-gray-800 font-mono text-sm break-all">
                            {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                          </p>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-blue-600 font-medium mb-2">📅 Work Date</p>
                          <p className="text-blue-800 text-sm font-medium">
                            {new Date(userLocation.clockIn).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center font-medium">
                        🔍 Zoomed to maximum level for precise location
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Fallback marker when no user locations available */}
            {uniqueUserLocations.length === 0 && (
              <Marker position={defaultCoordinates} icon={customIcon}>
                <Popup>No employee locations found for the selected date.</Popup>
              </Marker>
            )}
          </MapContainer>
        </section>

      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <PendingRequestModal
            isOpen={isModalOpen}
            onClose={closeModal}
            activityData={pendingTimeClockRequest}
          />
        </div>
      )}
    </div>
  );
}
