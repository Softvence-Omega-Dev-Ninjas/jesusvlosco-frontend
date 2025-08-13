import React, { useEffect, useRef, useState } from "react";
import bage1 from "@/assets/bage-1.png";
import bage2 from "@/assets/bage2.png";
import bage3 from "@/assets/bage3.png";
import bage4 from "@/assets/bage4.png";
import bage5 from "@/assets/bage5.png";
import bage6 from "@/assets/bage6.png";
import bage7 from "@/assets/bage7.png";
import bage8 from "@/assets/bage8.png";
import Swal from "sweetalert2";
import { useGetAllBadgeQuery } from "@/store/api/admin/recognation/recognationApi";
import { IBadge, IRecognation } from "@/types/recognation";
import { SectionGrid } from "@/pages/BadgeLibrary";
import RecognationCard from "@/pages/recognation/RecognationCard";
interface IProp {
  formData: IRecognation;
  handleChange: (
    key:
      | "badgeId"
      | "message"
      | "visibility"
      | "shouldNotify"
      | "isAllowedToLike",
    value: any
  ) => void;
}
const CreateRecognitionBagde = ({ formData, handleChange }: IProp) => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetAllBadgeQuery(null);
  console.log({ data, isLoading });
  const badgess = data?.data;
  const badges = [
    { id: "promotion", name: "Promotion", icon: bage1, bgColor: "bg-pink-100" },
    { id: "creative", name: "Creative", icon: bage2, bgColor: "bg-purple-100" },
    {
      id: "well-done",
      name: "Well-done!",
      icon: bage3,
      bgColor: "bg-blue-100",
    },
    {
      id: "happy-holiday",
      name: "Happy holiday",
      icon: bage4,
      bgColor: "bg-purple-100",
    },
    {
      id: "top-performer",
      name: "Top performer",
      icon: bage5,
      bgColor: "bg-purple-100",
    },
    {
      id: "creative-star",
      name: "Creative",
      icon: bage6,
      bgColor: "bg-purple-100",
    },
    {
      id: "outstanding",
      name: "Outstanding services",
      icon: bage7,
      bgColor: "bg-purple-100",
    },
    {
      id: "employee-month",
      name: "Employee of the month",
      icon: bage8,
      bgColor: "bg-purple-100",
    },
  ];

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenModal(null);
      }
    };

    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  const handleThreeDotsClick = (e: React.MouseEvent, badgeId: string) => {
    e.stopPropagation();
    setOpenModal(openModal === badgeId ? null : badgeId);
  };

  const handleEdit = (badgeId: string) => {
    console.log(`Edit badge: ${badgeId}`);
    setOpenModal(null);
    window.location.href = "/admin/badge-library";
  };

  const handleDelete = (badgeId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Delete badge: ${badgeId}`);
        setOpenModal(null);
        Swal.fire("Deleted!", "The badge has been deleted.", "success");
      }
    });
  };

  const badgeChanged = (id: string) => {
    handleChange("badgeId", id);
    // console.log()
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-lg font-medium text-[#4E53B1]">Select badge:</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          {/* Select dropdown */}
          <div className="relative w-full sm:w-auto">
            <select className="w-full cursor-pointer appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option>Category</option>
              <option>Performance</option>
              <option>Achievement</option>
              <option>Recognition</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Create button */}
          <button
            onClick={() => {
              window.location.href = "/admin/create-badge";
            }}
            className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            Create a new badge
          </button>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4  xl:grid-cols-6 gap-6">
        {badgess?.map((card: any) => (
          <RecognationCard
            selectedCard={badgess.find(
              (el: IBadge) => el.id === formData.badgeId
            )}
            badgeChanged={badgeChanged}
            key={card.id}
            card={card}
          />
        ))}
      </div>

      {/* Form Section */}
      <div className="max-w-2xl space-y-6 mt-8">
        {/* Message textarea */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label
            htmlFor="message"
            className="text-sm font-semibold text-[#4E53B1] pt-2 min-w-fit"
          >
            Attach a message:
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            id="message"
            placeholder="Write your message here..."
            className="w-full resize-none bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
        </div>

        {/* Visibility select */}
        <div className="flex flex-1 flex-col sm:flex-row items-start gap-4">
          <label
            htmlFor="visibility"
            className="text-sm font-medium text-[#4E53B1] pt-2 min-w-fit"
          >
            Recognition will be visible to
          </label>
          <select
            value={formData.visibility}
            onChange={(e) => handleChange("visibility", e.target.value)}
            id="visibility"
            className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            <option value="everyone">Everyone</option>
            <option value="team">Team only</option>
            <option value="managers">Managers only</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Notify viewer */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="notifications"
            checked={formData.shouldNotify}
            onChange={(e) => handleChange("shouldNotify", e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="notifications" className="text-sm text-gray-700">
            Notify viewer via push notification
          </label>
        </div>

        {/* Company message */}
        {/* <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="text-sm font-medium text-[#4E53B1] pt-2 min-w-fit">
            Company Message:
          </label>
          <input
            type="text"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="XYZ company recognized K & others"
            className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div> */}

        {/* Allow interactions */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="interactions"
            checked={formData.isAllowedToLike}
            onChange={(e) => handleChange("isAllowedToLike", e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="interactions" className="text-sm text-gray-700">
            Allow user to like & comment on this update
          </label>
        </div>
      </div>
    </div>
  );
};

export default CreateRecognitionBagde;
