import {
  useGetAllBadgeQuery,
  useGetSingleBadgeQuery,
  useUpdateBadgeMutation,
} from "@/store/api/admin/recognation/recognationApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const badgeCategories = [
  { value: "MILESTONE", label: "Milestone" },
  { value: "GOOD_JOB", label: "Good Job" },
  { value: "ANNIVERSARY", label: "Anniversary" },
  { value: "PROMOTION", label: "Promotion" },
  { value: "ACHIEVEMENT", label: "Achievement" },
  { value: "AWARD", label: "Award" },
  { value: "RECOGNITION", label: "Recognition" },
];

export default function EditBadge() {
  const { id } = useParams();
  const { data: badgeData, isLoading: isBadgeLoading } =
    useGetSingleBadgeQuery({ id });
  const { data: allBadges } = useGetAllBadgeQuery(null);

  const [updateBadge, { isLoading: isUpdating }] = useUpdateBadgeMutation();
console.log({id,badgeData})
  const [badgeTitle, setBadgeTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (badgeData?.data) {
      setBadgeTitle(badgeData.data.title || "");
      setCategory(badgeData.data.category || "");
      // setFileName(badgeData.data.iconImage || "");
    }
  }, [badgeData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files!.length > 0) {
      // setFileName(e.target.files[0].name);
      setFile((e.target.files)![0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", badgeTitle);
    formData.append("category", category);
    if (file) {
      formData.append("iconImage", file);
    }

    try {
      const result = await updateBadge({ id, body: formData }).unwrap();
      console.log({result})
      if (result.success) {
        toast.success("Badge updated successfully");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  if (isBadgeLoading) return <p>Loading badge...</p>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex w-1/2 mt-8 flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-[#4E53B1]">Edit Badge</h1>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border border-[#C5C5C5] p-4 lg:p-6 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-8 flex-1">
            {/* Badge Title */}
            <input
              type="text"
              value={badgeTitle}
              onChange={(e) => setBadgeTitle(e.target.value)}
              required
              className="w-full px-3 py-3 border border-[#C5C5C5] rounded-xl focus:outline-none"
              placeholder="Enter badge title"
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="">Select category</option>
              {badgeCategories.map((el) => (
                <option key={el.value} value={el.value}>
                  {el.label}
                </option>
              ))}
            </select>

            {/* File Upload */}
            <input
              type="file"
              id="badgeUpload"
              name="badgeFile"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="badgeUpload"
              className="w-full flex items-center justify-between px-4 py-3 border text-[#484848] border-[#C5C5C5] rounded-xl cursor-pointer"
            >
              {file ? file?.name.slice(0,20) : "Upload Custom Badge"}
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-2 bg-[#4E53B1] text-white rounded-md hover:bg-[#2b2d55]"
            >
              {isUpdating ? "Updating..." : "Update Badge"}
            </button>
          </form>
        </div>

        {/* All Badges Preview */}
           <div className="flex-1 p-4 lg:p-6">
          <div className="grid grid-cols-2   sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-5">
            {allBadges?.data?.map((badge: any, index: number) => (
              <button
                key={index}
                className={`w-full aspect-square hover:ring-4 hover:ring-[#4E53B1] hover:ring-offset-2 rounded-xl bg-[#E8E6FF] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer p-3 `}
              >
                <img
                  src={badge?.iconImage}
                  alt={badge?.title}
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-20 lg:h-20 object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
