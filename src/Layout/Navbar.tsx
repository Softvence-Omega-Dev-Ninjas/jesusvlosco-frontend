import React from 'react';
import { Search, Bell, Settings, ChevronDown, Menu } from 'lucide-react';
import UserDropdown from './User/UserDropdown';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white  border-b border-gray-200 px-6 py-4 rounded-2xl md:mx-2">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Page title */}
        <div className="flex-1 lg:flex-none">
          <h1 className="md:text-2xl font-semibold text-gray-900 md:ml-4 lg:ml-0">Dashboard</h1>
        </div>

        {/* Search and user section */}
        <div className="flex items-center space-x-4">
          {/* Search bar - hidden on small screens */}
          <div className="hidden md:flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Mobile search button */}
          <button className="hidden md:block p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 hidden md:block rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>

          {/* User profile */}
          <UserDropdown />
          {/* <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">NB</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Natasha Bunny</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
          </div> */}
        </div>
      </div>
    </header>
  );
};