import bage1 from "@/assets/bage-1.png";
import bage2 from "@/assets/bage2.png";
import bage3 from "@/assets/bage3.png";
import bage4 from "@/assets/bage4.png";
import bage5 from "@/assets/bage5.png";
import bage6 from "@/assets/bage6.png";
import bage7 from "@/assets/bage7.png";
import bage8 from "@/assets/bage8.png";
import { useState } from "react";
import Swal from "sweetalert2";

const badgeImages = [
  { src: bage1, alt: "Megaphone", color: "bg-pink-200" },
  { src: bage2, alt: "Lightbulb", color: "bg-yellow-200" },
  { src: bage3, alt: "Target", color: "bg-blue-200" },
  { src: bage4, alt: "Lightning", color: "bg-orange-200" },
  { src: bage5, alt: "Trophy", color: "bg-yellow-200" },
  { src: bage6, alt: "Gold Medal", color: "bg-yellow-200" },
  { src: bage7, alt: "Star", color: "bg-purple-200" },
  { src: bage8, alt: "Medal", color: "bg-yellow-200" },
  { src: bage1, alt: "Megaphone", color: "bg-pink-200" },
  { src: bage2, alt: "Lightbulb", color: "bg-yellow-200" },
  { src: bage3, alt: "Target", color: "bg-blue-200" },
  { src: bage4, alt: "Lightning", color: "bg-orange-200" },
  { src: bage5, alt: "Trophy", color: "bg-yellow-200" },
  { src: bage6, alt: "Gold Medal", color: "bg-yellow-200" },
  { src: bage7, alt: "Star", color: "bg-purple-200" },
  { src: bage8, alt: "Medal", color: "bg-yellow-200" },
];

export default function EditBadge() {
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);
  const [badgeTitle, setBadgeTitle] = useState("");
  const [category, setCategory] = useState("");

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
        <div className="w-full lg:w-80 bg-white border  border-[#C5C5C5]  p-4 lg:p-6 lg:min-h-1/2 rounded-2xl">
          <div className="mb-6">
            <h2 className="text-md text-center py-4  text-gray-800 mb-4">
              Your custom badge
            </h2>
            <div className="w-full h-50 border-2 border-dashed border-[#C5C5C5] rounded-lg flex items-center justify-center bg-[#F5F5F5]">
              {selectedBadge !== null ? (
                <div
                  className={`w-40 h-40 rounded-lg  flex items-center justify-center p-2`}
                >
                  <img
                    src={badgeImages[selectedBadge].src || "/placeholder.svg"}
                    alt={badgeImages[selectedBadge].alt}
                    className="w-40 h-40 object-contain"
                  />
                </div>
              ) : (
                <div className="text-gray-400 text-sm">Select an icon</div>
              )}
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <div>
              <input
                id="badge-title"
                type="text"
                value={badgeTitle}
                onChange={(e) => setBadgeTitle(e.target.value)}
                className="w-full px-3 py-3 border border-[#C5C5C5] rounded-xl focus:outline-none focus:ring-2 focus:ring-back focus:border-back"
                placeholder="Enter badge title"
              />
            </div>

            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full px-3 py-3 border text-[#484848] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-back cursor-pointer focus:border-back"
              >
                <option value="">Select category</option>
                <option value="achievement">Achievement</option>
                <option value="award">Award</option>
                <option value="milestone">Milestone</option>
                <option value="recognition">Recognition</option>
              </select>
            </div>

            <label className="w-full flex items-center justify-between px-4 py-3 border text-[#484848] border-[#C5C5C5] rounded-xl text-sm font-medium hover:bg-purple-150 focus:outline-none focus:ring-2 focus:ring-black transition-colors cursor-pointer">
              <input type="file" className="hidden" />
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
                Upload Custom Badge
              </div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-8">
            <button
              onClick={() =>
                Swal.fire({
                  icon: "success",
                  title: "Badge created successfully!",
                  showConfirmButton: false,
                  timer: 1500,
                })
              }
              className="flex-1 py-2 bg-[#4E53B1] text-white rounded-md hover:bg-[#2b2d55] cursor-pointer"
            >
              Create badge
            </button>
            <button className="flex-1 py-2 border border-gray-300 hover:text-white text-gray-700 rounded-md hover:bg-[#2b2d55] cursor-pointer ">
              Close
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="grid grid-cols-2   sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-5">
            {badgeImages.map((badge, index) => (
              <button
                key={index}
                onClick={() => setSelectedBadge(index)}
                className={`w-full aspect-square rounded-xl bg-[#E8E6FF] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer p-3 ${
                  selectedBadge === index
                    ? "ring-4 ring-[#4E53B1] ring-offset-2"
                    : ""
                }`}
              >
                <img
                  src={badge.src || "/placeholder.svg"}
                  alt={badge.alt}
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
