import React, { useState, useEffect } from "react";
import { useGetAllCategoriesQuery } from "@/store/api/user/getAllCategories";

type TCategory = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type CategoryFilterProps = {
  onCategory: (categories: TCategory[]) => void;
};

const UserCategoryFilter: React.FC<CategoryFilterProps> = ({ onCategory }) => {
  const { data } = useGetAllCategoriesQuery(undefined);
  const categories: TCategory[] = data?.data || [];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Handle checkbox toggle
  const toggleCategory = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // When selected changes, call onCategory with selected categories
  useEffect(() => {
    const selectedCategories = categories.filter((cat) => selected.has(cat.id));
    onCategory(selectedCategories);
  }, [selected, categories, onCategory]);

  // Handle select all
  const toggleSelectAll = () => {
    if (selected.size === categories.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(categories.map((c) => c.id)));
    }
  };

  return (
    <div className="relative inline-block text-left me-20">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 border text-white border-gray-300 rounded-md hover:bg-gray-100 text-sm"
        style={{ backgroundColor: "rgba(78, 83, 177, 1)" }}
      >
        All Categories
      </button>

      {open && (
        <div className="absolute mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-3 text-sm max-h-60 overflow-y-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox text-indigo-600"
                checked={selected.size === categories.length && categories.length > 0}
                onChange={toggleSelectAll}
              />
              All categories
            </label>

            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600"
                  checked={selected.has(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCategoryFilter;
