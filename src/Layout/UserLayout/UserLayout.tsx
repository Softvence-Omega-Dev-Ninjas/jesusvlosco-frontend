import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import User from '@/pages/User'; // Assuming this path is correct
import Admin from '@/pages/Admin'; // Assuming this path is correct

export const UserLayout = () => {
    // State to keep track of the active tab: 'user' or 'admin'
    // Initialize with 'user' or 'admin' directly.
    const [activeTab, setActiveTab] = useState('user'); // Corrected default to 'user'
    const location = useLocation();

    const renderContent = () => {
        // Check if the current path includes '/user-profile'
        if (location.pathname.includes('/user-profile')) {
            return (
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-3">User Profile</h2>
                    {/* Add User Profile specific content here, or render a dedicated UserProfile component */}
                    <p className="text-gray-700">Detailed user profile information will appear here.</p>
                </div>
            );
        }

        // If not on '/user-profile' path, proceed with tab-switching logic
        if (activeTab === 'user') {
            return <User />;
        } else if (activeTab === 'admin') {
            return <Admin />;
        }
        return null; // Fallback
    };

    // Determine if the tab buttons should be displayed
    // They should not be displayed if the current path includes '/user-profile'
    const showTabButtons = !location.pathname.includes('/user-profile');

    return (
        <div className="md:p-6 mx-3">
            {/* The h1 was 'Communication' previously, assuming you want 'User Management' here */}
            <h1 className="text-3xl font-bold mb-6">User Management</h1>

            {/* Conditionally render tab buttons and the "Add +" section */}
            {showTabButtons && (
                <div className="flex  items-center mb-6"> {/* Added items-center for vertical alignment */}
                    <div className='flex gap-4'>
                        {/* User Tab Button */}
                        <button
                            onClick={() => setActiveTab('user')} // Correctly set to 'user'
                            className={`py-2 px-4 rounded-md transition duration-200 ${activeTab === 'user' // Condition is now 'user'
                                ? 'bg-blue-600 text-white shadow-md' // Using blue-600 as per your previous example
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            User
                        </button>

                        {/* Admin Tab Button */}
                        <button
                            onClick={() => setActiveTab('admin')} // Correctly set to 'admin'
                            className={`py-2 px-4 rounded-md transition duration-200 ${activeTab === 'admin' // Condition is now 'admin'
                                ? 'bg-blue-600 text-white shadow-md' // Using blue-600 as per your previous example
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Admin
                        </button>
                    </div>


                </div>
            )}

            {/* Conditionally render content based on activeTab or location */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
};