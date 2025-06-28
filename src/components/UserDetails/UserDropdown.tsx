// src/components/common/UserDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react"; // For the dropdown arrow icon

// Import placeholder avatars. You should replace these with your actual image paths.


export interface UserOption {
  name: string;
  avatar: string; // Path to the avatar image
}

interface UserDropdownProps {
  options: UserOption[];
  initialValue?: string;
  onSelect: (value: string) => void;
  label?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  options,
  initialValue,
  onSelect,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialValue || "");
  const [selectedValue, setSelectedValue] = useState(initialValue || "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on the search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Effect to set the initial value when the component mounts or initialValue changes
  useEffect(() => {
    if (initialValue) {
      setSelectedValue(initialValue);
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handler for when a user option is selected from the list
  const handleSelect = (option: UserOption) => {
    setSelectedValue(option.name);
    setSearchTerm(option.name);
    onSelect(option.name); // Call the onSelect prop with the selected user's name
    setIsOpen(false); // Close the dropdown
  };

  // Handler for changes in the search input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true); // Open the dropdown when typing
  };

  // Handler for when the input field gains focus
  const handleInputFocus = () => {
    setIsOpen(true); // Open the dropdown when input is focused
    inputRef.current?.select(); // Select existing text for easy replacement
  };

  // Find the currently selected user object to display their avatar in the input field
  const currentSelectedUser = options.find(user => user.name === selectedValue);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label htmlFor="user-search-input" className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Display avatar of the selected user in the input field, if available */}
        {currentSelectedUser?.avatar && (
          <img
            src={currentSelectedUser.avatar}
            alt={currentSelectedUser.name}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full object-cover"
          />
        )}
        {/* Search input field */}
        <input
          id="user-search-input"
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search users..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {/* Dropdown arrow icon */}
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {/* Dropdown list of filtered users */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
          <ul className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.name}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-3 ${
                    selectedValue === option.name ? "bg-gray-50 text-indigo-600" : "text-gray-700"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {/* Avatar for each user in the list */}
                  <img
                    src={option.avatar}
                    alt={option.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{option.name}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No users found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;