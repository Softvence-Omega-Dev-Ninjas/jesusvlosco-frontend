import { EyeIcon, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import RemotePolicyCard from "./RemotePolicyCard";
// import CategoryFilter from "./CategoryFilter";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { ResponsePanel } from "./ResponsePanel";
import {
  useDeleteAnnouncementMutation,
  useFetchAnnouncementQuery,
} from "@/store/api/admin/announcement/announcementApi";
import Swal from "sweetalert2";
import { toast } from "sonner";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showResponseId, setShowResponseId] = useState<string | null>(null);
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();
  const [publishedFrom, setPublishFrom] = useState<string>("");
  const [publishedTo, setPublishTo] = useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // console.log(new Date(publishedFrom).toISOString());

  const itemsPerPage = 5;
  const totalPages = Math.ceil(announcementList.length / itemsPerPage);
  const currentAnnouncements = announcementList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { data: announcementData, refetch } = useFetchAnnouncementQuery({
    page: currentPage,
    limit: 10,
    searchValue,
    publishedFrom:
      publishedFrom.length > 0 && new Date(publishedFrom).toISOString(),
    publishedTo: publishedTo.length > 0 && new Date(publishedTo).toISOString(),
  });

  useEffect(() => {
    if (announcementData) {
      setAnnouncementList(announcementData.data);
    }
  }, [announcementData, currentPage, searchValue, publishedTo, publishedFrom]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteSelected = async (announcementId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { data } = await deleteAnnouncement(announcementId);
      // console.log(data);

      if (data?.success) {
        refetch();
        await Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleCloseResponse = () => {
    setShowResponseId(null);
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      {/* Delete Mode Bar */}
      {/* {showDeleteMode && (
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
      )} */}

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

          <div className="flex gap-2 relative">
            {/* <CategoryFilter /> */}
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center gap-1"
            >
              <img src="/filter_list.png" alt="Filter" className="w-4 h-4" />
              Filter
            </button>

            {showFilterDropdown && (
              <div
                ref={filterRef}
                className="absolute bg-white top-full right-0 mt-2 w-80 border border-gray-200 shadow-lg p-4 pb-6 z-10 rounded-xl"
              >
                <h2 className="text-base font-semibold text-gray-800 mb-3">
                  Filter by Publish Date
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Published From */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">
                      Published from
                    </label>
                    <input
                      type="date"
                      value={publishedFrom}
                      onChange={(e) => setPublishFrom(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Published To */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">
                      Published to
                    </label>
                    <input
                      type="date"
                      value={publishedTo}
                      onChange={(e) =>
                        // setPublishTo(new Date(e.target.value).toISOString())
                        setPublishTo(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                  </div>
                </div>

                {/* Apply Button */}
                {/* <div className="flex justify-end mt-4">
                  <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    Apply Filter
                  </button>
                </div> */}
              </div>
            )}

            {/* <CalendarDropdown /> */}

            {/* 3-dot button */}
            {/* <div className="relative">
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
            </div> */}
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
                {/* {showDeleteMode && (
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
                )} */}

                {selectedId === a.id ? (
                  <RemotePolicyCard
                    announcement={a}
                    onClose={() => setSelectedId(null)}
                  />
                ) : (
                  <>
                    <div className={`flex gap-4`}>
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

                    {/* {!showDeleteMode && ( */}
                    <div className="lg:grid flex lg:-mt-14  mt-4 justify-end gap-3">
                      <button
                        onClick={() => setShowResponseId(a.id)}
                        className="px-4 py-1 text-sm border border-indigo-400 rounded text-indigo-400 hover:bg-gray-100 flex items-center cursor-pointer"
                      >
                        <EyeIcon className="h-4 w-4 mr-1.5" />
                        Response
                      </button>
                      <button
                        onClick={() => setSelectedId(a.id)}
                        className="px-4 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
                      >
                        Read receipt
                      </button>

                      <button
                        onClick={() => handleDeleteSelected(a.id)}
                        className="bg-white border-red-400 border text-red-400 duration-200 py-1 rounded hover:text-white text-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-red-400"
                      >
                        <Trash size={15} />
                        Delete
                      </button>
                    </div>
                    {/* )} */}
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
