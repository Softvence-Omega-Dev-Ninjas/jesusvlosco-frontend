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

const CreateRecognitionBagde = () => {
  // const [selectedBadge, setSelectedBadge] = useState("promotion");
  const [message, setMessage] = useState("");
  const [visibilityOption, setVisibilityOption] = useState("");
  const [notifyViewer, setNotifyViewer] = useState(false);
  const [companyMessage, setCompanyMessage] = useState(
    "XYZ company recognized K & others"
  );
  const [allowInteraction, setAllowInteraction] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const badges = [
    {
      id: "promotion",
      name: "Promotion",
      icon: bage1,
      bgColor: "bg-pink-100",
    },
    {
      id: "creative",
      name: "Creative",
      icon: bage2,
      bgColor: "bg-purple-100",
    },
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
    e.stopPropagation(); // Prevent badge selection
    setOpenModal(openModal === badgeId ? null : badgeId);
  };

  const handleEdit = (badgeId: string) => {
    console.log(`Edit badge: ${badgeId}`);
    setOpenModal(null);
    // Add your edit logic here
      // Redirect to badge library
  window.location.href = "/admin/badge-library";
  };

  // const handleDelete = (badgeId: string) => {
  //   console.log(`Delete badge: ${badgeId}`);
  //   setOpenModal(null);
    
  //   // Add your delete logic here
  // };
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
      // 👇 Place your actual delete logic here
      console.log(`Delete badge: ${badgeId}`);
      setOpenModal(null);

      // Optional: show success alert
      Swal.fire("Deleted!", "The badge has been deleted.", "success");
    }
  });
}

  return (
    <div>
      <div className="min-h-screen bg-white p-4">
        <div className="">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="text-lg font-medium text-[#4E53B1]">
              Select badge:
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Select dropdown */}
              <div className="relative w-full sm:w-auto">
                <select className="w-full cursor-pointer  appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option>Category</option>
                  <option>Performance</option>
                  <option>Achievement</option>
                  <option>Recognition</option>
                </select>
                <div className="absolute inset-y-0 cursor-pointer right-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400 cursor-pointer"
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
              
                 onClick={() => { window.location.href = "/admin/create-badge"; }}
               className="w-full cursor-pointer sm:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                Create a new badge
              </button>
            </div>
          </div>

          {/* Badge Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-6 h-[192px] rounded-2xl cursor-pointer transition-all group border-4 border-transparent hover:border-[#4E53B1] bg-[#E8E6FF]`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className=" w-20 h-20 flex justify-center items-center">
                    <img
                      src={badge.icon}
                      className="w-full h-full object-contain "
                      alt=""
                    />
                  </div>
                  <span className="text-sm font-medium text-[#4E53B1] leading-tight">
                    {badge.name}
                  </span>
                </div>

                {/* 3-dot icon - show on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThreeDotsClick(e, badge.id);
                    }}
                    className="p-1 rounded-full cursor-pointer hover:bg-white/50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>

                  {/* Modal for Edit/Delete */}
                  {openModal === badge.id && (
                    <div
                      ref={modalRef}
                      className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-50"
                    >
                      <button
                        onClick={() => handleEdit(badge.id)}
                        className="w-full px-4 py-2 cursor-pointer text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(badge.id)}
                        className="w-full px-4 py-2 text-left cursor-pointer text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form Section */}

          {/* ------new from ----- */}
          <div className="max-w-2xl space-y-6 mt-8 ">
            {/* Message textarea */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <label
                htmlFor="message"
                className="text-sm font-semibold text-[#4E53B1] pt-2 min-w-fit"
              >
                Attach a message:
              </label>

              <div className="w-full flex-1 sm:w-2/3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="message"
                  placeholder="Write your message here..."
                  className="w-full  resize-none bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={1}
                />
              </div>
            </div>

            {/* Visibility select */}
            <div className="flex flex-1 flex-col sm:flex-row items-start gap-4">
              <label
                htmlFor="visibility"
                className="text-sm font-medium text-[#4E53B1] pt-2 min-w-fit"
              >
                Recognition will be visible to
              </label>

              <div className="relative flex-1 w-full sm:w-2/3">
                <select
                  value={visibilityOption}
                  onChange={(e) => setVisibilityOption(e.target.value)}
                  id="visibility"
                  className="w-full cursor-pointer  appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                >
                  <option className="cursor-pointer" value="">Select an option</option>
                  <option className="cursor-pointer" value="everyone">Everyone</option>
                  <option className="cursor-pointer" value="team">Team only</option>
                  <option className="cursor-pointer" value="managers">Managers only</option>
                  <option className="cursor-pointer" value="private">Private</option>
                </select>

                <svg
                  className="absolute right-3 top-1/2  cursor-pointer transform -translate-y-[45%] pointer-events-none text-gray-500 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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

            {/* Notify viewer checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications"
                checked={notifyViewer}
                onChange={(e) => setNotifyViewer(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="notifications" className="text-sm text-gray-700">
                Notify viewer via push notification
              </label>
            </div>

            {/* Company message input */}
            <div className="flex  flex-col sm:flex-row items-start gap-4">
              <label className="text-sm font-medium text-[#4E53B1] pt-2 min-w-fit">
                Company Message:
              </label>
              <input
                type="text"
                value={companyMessage}
                onChange={(e) => setCompanyMessage(e.target.value)}
                placeholder="XYZ company recognized K & others"
                className="w-full flex-1 sm:w-2/3 cursor-pointer bg-white border border-gray-200 rounded-md px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Interactions checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="interactions"
                checked={allowInteraction}
                onChange={(e) => setAllowInteraction(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="interactions" className="text-sm text-gray-700">
                Allow user to like & comment on this update
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecognitionBagde;
