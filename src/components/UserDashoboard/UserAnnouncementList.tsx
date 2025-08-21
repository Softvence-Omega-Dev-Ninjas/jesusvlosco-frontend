import React, { useState, useMemo, useEffect } from 'react';
import CategoryFilter from '../CompanyUpdate/CategoryFilter';
import UserCalendarDropdown from './UserCalendarDropdown';
import { UserResponsePanel } from './UserResponsePanel';
import UserRemotePolicyCard from './UserRemotePolicyCard';
import { useGetAllAnnounceQuery } from '@/store/api/user/compnayUpdateAndAnnounce';
import { toast } from 'sonner';
import { useGetSingleCompanyAnnounceQuery } from '@/store/api/user/singleCompanyAnnounce';

type Announcement = {
    id: string;
    title: string;
    description: string;
    publishedNow: boolean;
    publishedAt: string;
};

const UserAnnouncementList: React.FC = () => {
    const { data } = useGetAllAnnounceQuery(undefined);
    console.log(data)

    // const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showResponseId, setShowResponseId] = useState<string | null>(null);

    // const { data: singleAnnounce } = useGetSingleCompanyAnnounceQuery(selectedId, {
    //     skip: !selectedId,
    // });
    const [selectedId, setSelectedId] = useState<string | null>(null);

const { data: singleAnnounce } = useGetSingleCompanyAnnounceQuery(
  selectedId ?? "", // Fallback to empty string
  {
    skip: !selectedId, // Skip fetching if there's no ID
  }
);


    console.log(singleAnnounce)

    useEffect(() => {
        if (data?.success) {
            toast.success(data.message);
        }
    }, [data]);

    const announcementList = useMemo(() => {
        if (!data?.data) return [];
        return Array.isArray(data.data) ? data.data : [data.data];
    }, [data]);

    const itemsPerPage = 5;
    const totalPages = Math.ceil(announcementList.length / itemsPerPage);
    const currentAnnouncements = announcementList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCloseResponse = () => {
        setShowResponseId(null);
    };

    return (
        <div className="max-w-8xl mx-auto px-4 py-8">
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
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <CategoryFilter />
                        <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center gap-1">
                            <img src="/filter_list.png" alt="Filter" className="w-4 h-4" />
                            Filter
                        </button>
                        <UserCalendarDropdown />
                    </div>
                </div>
            )}

            {/* Announcement List or Response Panel */}
            <div className="space-y-4 mb-8">
                {currentAnnouncements.map((a: Announcement) => {
                    const time = a.publishedAt
                        ? new Date(a.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—';

                    return (
                        <div
                            key={a.id}
                            className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative"
                        >
                            {showResponseId === a.id ? (
                                <UserResponsePanel announcement={a} onClose={handleCloseResponse} />
                            ) : (
                                <>
                                    {selectedId === a.id ? (
                                        <UserRemotePolicyCard singleAnnouce={singleAnnounce} onClose={() => setSelectedId(null)} />
                                    ) : (
                                        <>
                                            <div className="flex gap-4">
                                                <div className="mt-2 border-r border-gray-300 px-2">
                                                    <p className="text-sm text-gray-400">
                                                        Today
                                                        <br />
                                                        {time}
                                                    </p>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-indigo-900 mt-1">{a.title}</h3>
                                                    <p
                                                        className="text-sm text-gray-600 mt-1 line-clamp-2"
                                                        dangerouslySetInnerHTML={{ __html: a.description }}
                                                    />
                                                </div>
                                            </div>

                                            {!showResponseId && (
                                                <div className="lg:grid flex lg:-mt-14 lg:mb-10 mt-4 justify-end gap-3">
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
                    );
                })}
            </div>

            {/* Pagination */}
            {!showResponseId && totalPages > 1 && (
                <div className="flex justify-center sm:justify-end items-center border border-gray-300 py-2 px-4 rounded-lg gap-1 mt-8">
                    <button
                        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                            <button
                                key={pageNumber}
                                className={`px-3 py-1 rounded-md text-sm ${
                                    currentPage === pageNumber ? 'bg-indigo-500 text-white font-medium' : 'hover:bg-gray-100'
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
                                    currentPage === totalPages ? 'bg-indigo-500 text-white font-medium' : 'hover:bg-gray-100'
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
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserAnnouncementList;
