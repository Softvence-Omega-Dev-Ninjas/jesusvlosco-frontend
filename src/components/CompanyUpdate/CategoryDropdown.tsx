import React, { useState } from "react";

const CategoryDropdown: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const handleSelect = (category: string) => {
        setSelectedCategory(category);
        setDropdownOpen(false);
        setShowForm(false);
    };

    return (
        <div className="relative w-full max-w-md">
            {/* Dropdown Button */}
            <button
                onClick={toggleDropdown}
                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-left"
            >
                {selectedCategory || "Select category"}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow z-10 p-2 text-sm space-y-2">
                    {[
                        "Project progress update",
                        "Safety & compliance update",
                        "Labour & workforce updates",
                        "New leave policy update",
                    ].map((item) => (
                        <label key={item} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === item}
                                onChange={() => handleSelect(item)}
                            />
                            {item}
                        </label>
                    ))}

                    {/* Create New Category */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 text-indigo-600 font-medium hover:underline pt-2  w-full"
                    >
                        <span>➕</span> Create new category
                    </button>
                </div>
            )}

            {/* Create New Category Form */}
            {showForm && (
                <div className="absolute top-full mt-2 w-full sm:w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-20">
                    <label className="block mb-2 text-sm font-medium">Category name</label>
                    <input
                        type="text"
                        placeholder="Enter category title here"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md text-sm"
                    />
                    <label className="block mb-2 text-sm font-medium">Description</label>
                    <textarea
                        placeholder="Description"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                    />
                    <button
                        className="px-4 py-2 text-white bg-indigo-600 rounded-md text-sm hover:bg-indigo-700"
                        onClick={() => {
                            setShowForm(false);
                            setDropdownOpen(false);
                        }}
                    >
                        Save
                    </button>

                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
