
import { Edit3, Facebook, Twitter, Chrome } from 'lucide-react';

export default function AdminProfile() {
  return (
    <div className=" mx-auto p-6  min-h-screen">
      {/* Personal Information Section */}
      <div className=" border border-gray-200 rounded-md mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
              <Edit3 size={16} />
              Edit
            </button>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-64 h-64 rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <input 
                  type="text" 
                  value="Brooklyn Simmons" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value="(907) 555-0101" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  value="michelle.rivera@example.com" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className=" rounded-md  border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Password</h2>
              <p className="text-sm text-gray-600 mt-1">Change your password to keep your account secure</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Change password
            </button>
          </div>
        </div>
      </div>

      {/* Link Accounts Section */}
      <div className=" rounded-lg  border border-gray-200">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Link accounts</h2>
            <p className="text-sm text-gray-600 mt-1">Connect your account with social logins</p>
          </div>
          
          <div className="space-y-4">
            {/* Facebook */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Facebook size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Facebook</h3>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Connect
              </button>
            </div>

            {/* Twitter */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Twitter size={20} className="text-gray-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Twitter</h3>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Connect
              </button>
            </div>

            {/* Google */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Chrome size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Google</h3>
                  <p className="text-sm text-gray-500">Connected</p>
                </div>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}