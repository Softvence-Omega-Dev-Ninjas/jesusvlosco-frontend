import React, { useState } from "react";

const categories = [
  "Safety & compliance update",
  "Labour & workforce updates",
  "New leave policy update",
];

const CategoryFilter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"category" | "team">("category");

  return (
    <div className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 border text-white border-gray-300 rounded-md hover:bg-gray-100 text-sm"
        style={{ backgroundColor: "rgba(78, 83, 177, 1)" }}
      >
        All Categories
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setActiveTab("category")}
              className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === "category"
                  ? "border-indigo-800 text-white bg-indigo-800 rounded-tl-lg"
                  : "border-transparent text-gray-600"
              }`}
            >
              Category wise
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === "team"
                  ? "border-indigo-800 text-white bg-indigo-800 rounded-tr-lg"
                  : "border-transparent text-gray-600"
              }`}
            >
              Team wise
            </button>
          </div>

          {/* Dropdown content */}
          <div className="p-4 space-y-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="form-checkbox text-indigo-600" />
              All category
            </label>

            {activeTab === "category" &&
              categories.map((cat, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input type="checkbox" className="form-checkbox text-indigo-600" />
                  {cat}
                </label>
              ))}

            {activeTab === "team" &&
              ["Team A", "Team B", "Team C", "Team D"].map((team, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input type="checkbox" className="form-checkbox text-indigo-600" />
                  {team}
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
