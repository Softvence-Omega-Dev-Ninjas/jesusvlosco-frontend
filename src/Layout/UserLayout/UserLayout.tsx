import React, { useState } from 'react';

// Assuming you have an Admin component for the Admin view
// If not, you can just render a simple <div> for now
const AdminContent = () => {
    return (
        <div className="p-4 bg-white rounded-lg shadow mt-4">
            <h2 className="text-xl font-semibold">Admin Panel Content</h2>
            <p className="text-gray-700">This is the content for the Admin user type.</p>
        </div>
    );
};

// Assuming you have a User component for the User view
const UserContent = () => {
    return (
        <div className="p-4 bg-white rounded-lg shadow mt-4">
            <h2 className="text-xl font-semibold">User Dashboard Content</h2>
            <p className="text-gray-700">This is the content for the standard User type.</p>
        </div>
    );
};

export default function UserLayout() {
    // State to keep track of the active tab: 'user' or 'admin'
    const [activeTab, setActiveTab] = useState('user'); // Default to 'user'

    const renderContent = () => {
        if (activeTab === 'user') {
            return <UserContent />;
        } else if (activeTab === 'admin') {
            return <AdminContent />;
        }
        return null; // Fallback in case of unexpected activeTab value
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">User Management Layout</h1>

            <div className="flex justify-between space-x-4 mb-6">
                {/* User Tab Button */}
                <div className='flex gap-4'>
                    <button
                        onClick={() => setActiveTab('user')}
                        className={`py-2 px-4 rounded-md transition duration-200 ${activeTab === 'user'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        User
                    </button>

                    {/* Admin Tab Button */}
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`py-2 px-4 rounded-md transition duration-200 ${activeTab === 'admin'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        Admin
                    </button>
                </div>
                <div>
                    Add +
                </div>

            </div>

            {/* Render content based on activeTab */}
            {renderContent()}
        </div>
    );
}