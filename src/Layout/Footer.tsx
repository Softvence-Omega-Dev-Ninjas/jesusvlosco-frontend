import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500">
          © {currentYear} <span className="font-medium">Company Name.com</span> All rights reserved.
        </div>


      </div>
    </footer>
  );
};