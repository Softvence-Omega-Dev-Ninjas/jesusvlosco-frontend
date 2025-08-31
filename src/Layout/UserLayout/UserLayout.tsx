import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import User from '@/pages/User'; // Assuming this path is correct
import Admin from '@/pages/Admin'; // Assuming this path is correct
import SuperAdmin from '@/pages/SuperAdmin'; // Import SuperAdmin component
import UserProfile from '@/pages/UserProfile';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export const UserLayout = () => {
    // State to keep track of the active tab: 'user' or 'admin'
    // Initialize with 'user' or 'admin' directly.
    const [activeTab, setActiveTab] = useState('user');
    const user = useSelector((state: RootState) => state.user.user);
    console.log(user?.role) // Corrected default to 'user'
    const location = useLocation();
    const navigate = useNavigate();

    const renderContent = () => {
        // Check if the current path includes '/user-profile'
        if (location.pathname.includes('/user-profile')) {
            return (
                <UserProfile></UserProfile>
            );
        }

        // If not on '/user-profile' path, proceed with tab-switching logic
        if (activeTab === 'user') {
            return <User />;
        } else if (activeTab === 'admin') {
            return <Admin />
        } else if (activeTab === 'superadmin') {
            return <SuperAdmin />
        }
        return null; // Fallback
    };

    // Determine if the tab buttons should be displayed
    // They should not be displayed if the current path includes '/user-profile'
    const showTabButtons = !location.pathname.includes('/user-profile');

    return (
        <div className="md:p-6 mx-3 ">
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
                                ? 'bg-[#4E53B1] text-white shadow-md' // Using blue-600 as per your previous example
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Employee
                        </button>

                        {/* Admin Tab Button */}
                        <button
                            onClick={() => setActiveTab('admin')} // Correctly set to 'admin'
                            className={`py-2 px-4 rounded-md transition duration-200 ${activeTab === 'admin' // Condition is now 'admin'
                                ? 'bg-[#4E53B1] text-white shadow-md' // Using blue-600 as per your previous example
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Admins
                        </button>

                        {/* Super Admin Tab Button - Only show if user is SUPER_ADMIN */}
                        {user?.role === 'SUPER_ADMIN' && (
                            <button
                                onClick={() => setActiveTab('superadmin')}
                                className={`py-2 px-4 rounded-md transition duration-200 ${activeTab === 'superadmin'
                                    ? 'bg-[#4E53B1] text-white shadow-md'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                Super Admin
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/admin/manage-teams')} // Correctly set to 'admin'
                            className={`py-2 px-4 rounded-md transition duration-200 bg-gray-200 text-gray-800 hover:bg-gray-300
                                }`}
                        >
                            Manage Teams
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