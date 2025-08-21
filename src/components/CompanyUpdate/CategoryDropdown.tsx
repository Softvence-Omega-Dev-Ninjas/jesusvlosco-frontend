/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateCategoryMutation, useFetchCategoriesQuery } from "@/store/api/admin/announcement/categoryApi";
import { useState } from "react";
import { toast } from "sonner";

const CategoryDropdown = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: any | null;
  setSelectedCategory: (arg0: string) => void;
}) => {
  const [showForm, setShowForm] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [createCategory] = useCreateCategoryMutation();
  const { data: categoriesData } = useFetchCategoriesQuery([]);
  console.log("categoryData========>", categoriesData);
  const categories = categoriesData?.data;
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleSelect = (category: any) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    const { data } = await createCategory({
      name: categoryName,
      description: categoryDescription,
    });

    if (data?.success) {
      toast.success(data.message);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Dropdown Button */}
      <button onClick={toggleDropdown} className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-left">
        {selectedCategory?.name || "Select category"}
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow z-10 p-2 text-sm space-y-2">
          {categories?.map((category: { id: string; name: string }) => (
            <label key={category?.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                // checked={selectedCategory?.name === category?.name}
                onChange={() => handleSelect(category)}
              />
              {category?.name}
            </label>
          ))}

          {/* Create New Category */}
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-indigo-600 font-medium hover:underline pt-2  w-full">
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
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-md text-sm"
          />
          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            placeholder="Description"
            onChange={(e) => setCategoryDescription(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-md text-sm"
            rows={3}
          />
          <button
            className="px-4 py-2 text-white bg-indigo-600 rounded-md text-sm hover:bg-indigo-700"
            onClick={() => {
              handleSubmit();
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
