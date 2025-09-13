import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Header } from "../Navbar";
import { Footer } from "../Footer";
import { UserSidebar } from "../UserSidebar";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";
import { useRequireLocation } from "@/hooks/useRequireLocation";
import { useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";

export default function UserMain() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(true);

  const user = useAppSelector(selectUser);
  const locationAllowed = useRequireLocation(user);

  // Handler to retry location request
  const handleRetryLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {
        // Successfully got location
        setShowLocationModal(false);
      },
      () => {
        // Still denied
        toast("Failed to get location. Please allow location access.", {
          duration: 3000,
        });
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="mt-4">
          <UserSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:ml-64 md:mx-4">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 mx-4">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>

      {/* Bottom-right location modal */}
      {user && locationAllowed === false && showLocationModal && (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col gap-2">
          <p className="text-md text-red-600">
            Location access is required for Clock In/Clock Out. Please enable
            location access in your browser settings.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleRetryLocation}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => setShowLocationModal(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
