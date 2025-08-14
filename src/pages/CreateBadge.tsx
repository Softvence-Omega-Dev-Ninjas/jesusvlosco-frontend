import {
  useAddBadgeMutation,
  useGetAllBadgeQuery,
} from "@/store/api/admin/recognation/recognationApi";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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

export default function CreateBadge() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  console.log({category})
  const [badgeTitle, setBadgeTitle] = useState("");
  const { data, isLoading } = useGetAllBadgeQuery(null);
  const badges = data?.data;
  const [createBadge, { isLoading: isCreateBadgeLoading }] =
    useAddBadgeMutation();
  console.log(data, isLoading);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: any) => {
    if (e.target.files?.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("badgeTitle") as HTMLInputElement)
      ?.value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement)
      ?.value;

    const file = (form.elements.namedItem("badgeFile") as HTMLInputElement)
      ?.files?.[0];
    console.log({ title, category, file });
    if (!file) {
      toast.error("Upload a image");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("iconImage", file);
    try {
      const result = await createBadge(formData).unwrap();
      console.log({ result });
      if (result.success) {
        toast.success("Badge created successfully");
        form.reset();
        setFileName("");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.log("Error", error);
    }
  };

  // console.log({ badgeTitle, category });
  return (
    <div className="min-h-screen ">
      {/* header  */}
      <div className="flex w-1/2  mt-8 flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-[#4E53B1]">Badge library</h1>
        <div className="">
          <span className="text-sm text-[#4E53B1]">Select icon</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white  border  border-[#C5C5C5]  p-4 lg:p-6 lg:min-h-1/2 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-8 flex-1">
            {/* Badge Title */}
            <div>
              <input
                id="badge-title"
                name="badgeTitle"
                type="text"
                required
                value={badgeTitle}
                onChange={(e) => setBadgeTitle(e.target.value)}
                className="w-full px-3 py-3 border border-[#C5C5C5] rounded-xl focus:outline-none focus:ring-2 focus:ring-back focus:border-back"
                placeholder="Enter badge title"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                id="category"
                name="category"
                required
                value={category!}
                className=" w-full px-3 py-3 border text-[#484848] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-back cursor-pointer focus:border-back"
              >
                <option disabled >
                  Select category
                </option>
                {badgeCategories.map((el) => (
                  <option value={el.value}>{el.label}</option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <input
                type="file"
                id="badgeUpload"
                name="badgeFile"
                className="hidden"
                onChange={handleFileChange}
              />

              <label
                htmlFor="badgeUpload"
                className="w-full flex items-center justify-between px-4 py-3 border text-[#484848] border-[#C5C5C5] rounded-xl text-sm font-medium hover:bg-purple-150 focus:outline-none focus:ring-2 focus:ring-black transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-[#484848]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {fileName.length === 0 ? " Upload Custom Badge" : fileName}
                </div>
                {/* {fileName && (
                  <span className="text-xs text-gray-500 ml-2 truncate">
                    {fileName}
                  </span>
                )} */}
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-2 mt-8">
              <button
                type="submit"
                disabled={isCreateBadgeLoading}
                className="flex-1 py-2 disabled:opacity-80  bg-[#4E53B1] text-white rounded-md hover:bg-[#2b2d55] cursor-pointer"
              >
                {isCreateBadgeLoading ? "Creating..." : "Create badge"}
              </button>
              <button className="flex-1 py-2 border border-gray-300 hover:text-white text-gray-700 rounded-md hover:bg-[#2b2d55] cursor-pointer ">
                Close
              </button>
            </div>
          </form>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="grid grid-cols-2   sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-5">
            {badges?.map((badge: any, index: number) => (
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
