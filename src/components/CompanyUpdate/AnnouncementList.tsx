import { EyeIcon } from "lucide-react";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import RemotePolicyCard from "./RemotePolicyCard";
import CategoryFilter from "./CategoryFilter";
import CalendarDropdown from "./CalendarDropdown";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { ResponsePanel } from "./ResponsePanel";
import { useFetchAnnouncementQuery } from "@/store/api/admin/announcement/announcementApi";

// const announcementsData = [
//   {
//     id: 1,
//     time: "02:0",

//     title: "New Leave Policy Effective July 2025",
//     description:
//       "We’ve updated our leave policy to provide more flexible options for parental leave and personal days. Please review the detailed policy...",
//     tags: ["All", "New leave policy update"],
//   },
//   {
//     id: 2,
//     time: "02:00",
//     title: "Upcoming Company Retreat",
//     description:
//       "Our annual company retreat will be held from August 15–17 at Lakeview Resort. Registration opens next week...",
//     tags: ["Team B", "Construction equipment updates"],
//   },
//   {
//     id: 3,
//     time: "03:00",
//     title: "Emergency Evacuation Drill",
//     description:
//       "An emergency evacuation drill will take place at 3:00 to ensure all workers are familiar with the emergency procedures...",
//     tags: ["Team C", "Emergency Alert Update"],
//   },
//   {
//     id: 4,
//     time: "05:00",
//     title: "Team Meeting Scheduled for Next Week: Project 2 Overview",
//     description:
//       "A team meeting will be held to discuss the progress, upcoming tasks, and resource requirements for Project 2. The meeting will also cover ...",
//     tags: ["Team D", "Internal Communication Update"],
//   },
//   {
//     id: 5,
//     time: "02:00",
//     title: "Mandatory Safety Training on Scaffold Safety",
//     description:
//       "All employees are required to attend a safety training session on scaffold safety. This is a mandatory training as part of our ongoing commitments to ...",
//     tags: ["All", "Safety & Compliance Updates"],
//   },
//   {
//     id: 6,
//     time: "02:00",
//     title: "Weather Delay: Heavy Rain Forecasted for March 22–23",
//     description:
//       "Due to the heavy rain forecasted for March 22–23, construction work on Site A will be delayed by 2 days. This may affect our progress on ...",
//     tags: ["All", "Weather & Site Conditions"],
//   },
// ];

export interface Author {
  id: string;
  phone: string;
  employeeID: number;
  email: string;
  role: "ADMIN" | "USER" | string; // extend if you have fixed roles
  isLogin: boolean;
  lastLoginAt: string; // ISO date
  password: string;
  otp: string | null;
  otpExpiresAt: string | null;
  isVerified: boolean;
  pinCode: string | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Count {
  likedUser: number;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  publishedNow: boolean;
  publishedAt: Date; // ISO date or null
  sendEmailNotification: boolean;
  enabledReadReceipt: boolean;
  likeCount: number;
  viewCount: number;
  isForAllUsers: boolean;
  createdBy: string;
  categoryId: string;
  time: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: Category;
  attachments: File[]; // adjust if backend defines attachment structure
  _count: Count;
}

const AnnouncementList: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showResponseId, setShowResponseId] = useState<string | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(announcementList.length / itemsPerPage);
  const currentAnnouncements = announcementList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { data: announcementData } = useFetchAnnouncementQuery({
    page: currentPage,
    limit: 10,
    searchValue,
  });

  useEffect(() => {
    if (announcementData) {
      setAnnouncementList(announcementData.data);
    }
  }, [announcementData, currentPage, searchValue]);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  //   const handleDeleteSelected = () => {
  //     setAnnouncementList((prev) =>
  //       prev.filter((a) => !selectedIds.includes(a.id))
  //     );
  //     setSelectedIds([]);
  //     setShowDeleteMode(false);
  //   };

  const handleCloseResponse = () => {
    setShowResponseId(null);
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      {/* Delete Mode Bar */}
      {showDeleteMode && (
        <div className="flex justify-between items-center  bg-red-50 p-3 rounded-lg border border-red-300 mb-4">
          <p className="text-sm text-red-600 font-medium">
            {selectedIds.length} selected
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center  gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            <RiDeleteBin6Line className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}

      {/* Search and Filters */}
      {!showResponseId && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="relative w-full sm:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <CategoryFilter />
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center gap-1">
              <img src="/filter_list.png" alt="Filter" className="w-4 h-4" />
              Filter
            </button>
            <CalendarDropdown />

            {/* 3-dot button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center justify-center"
              >
                <span className="flex flex-col space-y-1">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                </span>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      setShowDeleteMode(true);
                      setShowMenu(false);
                    }}
                    className="w-full min-w-max flex gap-2 px-4 py-2 text-sm text-indigo-800 hover:bg-gray-100 text-left"
                  >
                    <RiDeleteBin6Line className="mt-0.5" />
                    Delete chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Announcement List or Response Panel */}
      <div className="space-y-4 mb-8">
        {currentAnnouncements.map((a: Announcement) => (
          <div
            key={a.id}
            className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative"
          >
            {showResponseId === a.id ? (
              <ResponsePanel announcement={a} onClose={handleCloseResponse} />
            ) : (
              <>
                {showDeleteMode && (
                  <div className="absolute left-4 top-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(a.id as unknown as number)}
                      onChange={() =>
                        handleCheckboxChange(a.id as unknown as number)
                      }
                      className="w-4 mb-6 h-4"
                    />
                    <RiDeleteBin6Line className="mt-0.5" />
                  </div>
                )}

                {selectedId === a.id ? (
                  <RemotePolicyCard
                    announcement={a}
                    onClose={() => setSelectedId(null)}
                  />
                ) : (
                  <>
                    <div
                      className={`flex gap-4 ${showDeleteMode ? "pl-10" : ""}`}
                    >
                      <div className="mt-2 border-r border-gray-300 px-2">
                        <p className="text-sm text-gray-400">
                          {new Date(a.publishedAt).getTime() > Date.now()
                            ? "Tomorrow"
                            : "Today"}
                          <br />
                          {a.publishedAt
                            ? new Date(a.publishedAt).toLocaleTimeString()
                            : new Date(a.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-indigo-900 mt-1">
                          {a.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {a.description}
                        </p>
                        {/* <div className="flex flex-wrap items-center gap-2 mt-6">
                          {a.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div> */}
                      </div>
                    </div>

                    {!showDeleteMode && (
                      <div className="lg:grid flex lg:-mt-14 lg:mb-10 mt-4 justify-end gap-3">
                        <button
                          onClick={() => setShowResponseId(a.id)}
                          className="px-4 py-1 text-sm border border-indigo-400 rounded text-indigo-400 hover:bg-gray-100 flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-1.5" />
                          Response
                        </button>
                        <button
                          onClick={() => setSelectedId(a.id)}
                          className="px-4 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Read receipt
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination - Only show when not viewing response */}
      {!showResponseId && (
        <div className="flex justify-center sm:justify-end items-center border border-gray-300 py-2 px-4 rounded-lg gap-1 mt-8">
          <button
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === pageNumber
                    ? "bg-indigo-500 text-white font-medium"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="px-1 text-gray-400">...</span>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages
                    ? "bg-indigo-500 text-white font-medium"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          //   handleDeleteSelected();
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default AnnouncementList;
