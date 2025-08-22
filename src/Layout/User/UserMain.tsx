import { Outlet } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '../Navbar';
import { Footer } from '../Footer';
import { UserSidebar } from '../UserSidebar';
import { useSendUpdateLocationMutation } from '@/store/api/clockInOut/clockinoutapi';
import { connectLocationTracking, sendLocationUpdate } from '@/utils/socket';
import { useAppSelector } from '@/hooks/useRedux';

export default function UserMain() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sendUpdateLocation] = useSendUpdateLocationMutation();
    const intervalRef = useRef<number | null>(null);
    const lastKnownLocation = useRef<{ lat: number; lng: number } | null>(null);
    const isSocketConnected = useRef(false);
    
    // Get user token from Redux store
    const user = useAppSelector((state) => state.user.user);
    const token = user?.accessToken || '';

    // Function to get current location and send updates (both API and Socket)
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

                // Only send update if location changed significantly (optional optimization)
                const hasLocationChanged = !lastKnownLocation.current || 
                    Math.abs(lastKnownLocation.current.lat - location.lat) > 0.0001 ||
                    Math.abs(lastKnownLocation.current.lng - location.lng) > 0.0001;

                if (hasLocationChanged) {
                    lastKnownLocation.current = location;
                    
                    // Send location update via API (existing functionality)
                    sendUpdateLocation(location)
                        .unwrap()
                        .then((data) => {
                            console.log(data)
                            console.log('📡 API location updated successfully:', location);
                        })
                        .catch((error) => {
                            console.error('❌ Failed to update location via API:', error);
                        });

                    // Send location update via Socket.IO (new functionality)
                    if (token && isSocketConnected.current) {
                        sendLocationUpdate(location.lat, location.lng);
                    }
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                // Fallback to last known location or default location if needed
                if (!lastKnownLocation.current) {
                    // Use default location as fallback
                    const fallbackLocation = { lat: 23.8103, lng: 90.4125 };
                    sendUpdateLocation(fallbackLocation)
                        .unwrap()
                        .then(() => {
                            console.log('📡 Fallback location sent via API:', fallbackLocation);
                        })
                        .catch((err) => {
                            console.error('❌ Failed to send fallback location via API:', err);
                        });

                    // Send fallback via Socket.IO as well
                    if (token && isSocketConnected.current) {
                        sendLocationUpdate(fallbackLocation.lat, fallbackLocation.lng);
                    }
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000 // Cache location for 1 minute
            }
        );
    }, [sendUpdateLocation, token]);

    // Set up Socket.IO connection and location tracking
    useEffect(() => {
        if (token) {
            console.log('🔌 Connecting to location tracking socket...');
            connectLocationTracking(token);
            isSocketConnected.current = true;
        }

        return () => {
            if (isSocketConnected.current) {
                console.log('🔌 Disconnecting location tracking socket...');
                // disconnectLocationTracking();
                isSocketConnected.current = false;
            }
        };
    }, [token]);

    // Set up location update interval on component mount
    useEffect(() => {
        // Send initial location update
        updateCurrentLocation();

        // Set up interval to update location every 1 minute (60000 ms)
        intervalRef.current = window.setInterval(() => {
            updateCurrentLocation();
        }, 60000);

        // Cleanup interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [updateCurrentLocation]); // Now includes updateCurrentLocation dependency

    return (
        <div className="min-h-screen  flex flex-col">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40  lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className='mt-4'>
                    <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col lg:ml-64 md:mx-4">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 mx-4 ">
                        <Outlet></Outlet>
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    )
}
