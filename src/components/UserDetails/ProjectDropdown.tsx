// src/components/common/ProjectDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react"; // Assuming lucide-react is installed

interface ProjectDropdownProps {
  options: string[];
  initialValue?: string;
  onSelect: (value: string) => void;
  label?: string;
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  options,
  initialValue,
  onSelect,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialValue || "");
  const [selectedValue, setSelectedValue] = useState(initialValue || "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input field

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setSearchTerm(option); // Update search term to selected value
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true); // Open dropdown if typing
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // Select all text in the input when focused
    inputRef.current?.select();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label htmlFor="project-search-input" className="text-sm font-medium text-gray-700 mb-1 block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id="project-search-input"
          ref={inputRef}
          type="text"
        
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search projects..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
     
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
        <div className="relative w-full max-w-xs">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none "
      />
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
          <ul className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedValue === option ? "bg-gray-50 text-indigo-600" : "text-gray-700"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No projects found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectDropdown;