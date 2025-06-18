import { EyeIcon } from 'lucide-react';
import React from 'react';

const announcements = [
    {
        time: ' 02:00',
        title: 'New Leave Policy Effective July 2025',
        description:
            'We’ve updated our leave policy to provide more flexible options for parental leave and personal days. Please review the detailed policy...',
        tags: ['All', 'New leave policy update'],
    },
    {
        time: ' 02:00',
        title: 'Upcoming Company Retreat',
        description:
            'Our annual company retreat will be held from August 15–17 at Lakeview Resort. Registration opens next week...',
        tags: ['Team B', 'Construction equipment updates'],
    },
    {
        time: ' 03:00',
        title: 'Emergency Evacuation Drill',
        description:
            'An emergency evacuation drill will take place at 3:00 to ensure all workers are familiar with the emergency procedures...',
        tags: ['Team C', 'Emergency Alert Update'],
    },
    {
        time: ' 05:00',
        title: 'Team Meeting Scheduled for Next Week: Project 2 Overview',
        description:
            'A team meeting will be held to discuss the progress, upcoming tasks, and resource requirements for Project 2. The meeting will also cover ...',
        tags: ['Team D', 'Internal Communication Update'],
    },
    {
        time: ' 02:00',
        title: 'Mandatory Safety Training on Scaffold Safety',
        description:
            'All employees are required to attend a safety training session on scaffold safety. This is a mandatory training as part of our ongoing commitments to ...',
        tags: ['All', 'Safety & Compliance Updates'],
    },
    {
        time: ' 02:00',
        title: 'Weather Delay: Heavy Rain Forecasted for March 22–23',
        description:
            'Due to the heavy rain forecasted for March 22–23, construction work on Site A will be delayed by 2 days. This may affect our progress on ...',
        tags: ['All', 'Weather & Site Conditions'],
    },
];

const AnnouncementList: React.FC = () => {
    return (
        <div className="max-w-8xl mx-auto px-4 py-8">
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
                    <button className="px-4 py-2 border text-white border-gray-300 rounded-md  hover:bg-gray-100 text-sm" style={{ backgroundColor: 'rgba(78, 83, 177, 1)' }}>All Categories</button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center gap-1">
                        <img src="/filter_list.png" alt="" className="w-4 h-4 mr-1" />
                        Filter
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center">
                        <img src="/calendar.png" alt="Filter icon" className="w-4 h-4 mr-1" />
                        Date
                        <img src="/arrow.png" alt="Sort icon" className="w-4 h-4 ml-1" />
                    </button>
                    <button className="px-4 py-2 border  border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center justify-center">
                        <span className="flex flex-col space-y-1">
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        </span>
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                {announcements.map((a, i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className='flex gap-4'>
                            <div className='mt-2 border-r-1 border-gray-300 px-2 '><p className="text-sm text-gray-400">Today <br />{a.time}</p></div>
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-900 mt-1">
                                    {a.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {a.description}


                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-6">
                                    {a.tags.map((tag, j) => (
                                        <span
                                            key={j}
                                            className="bg-blue-100  px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(232, 230, 255, 1)' }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid  justify-end gap-3  -mt-14 ">
                            <button className="px-4 py-1 text-sm border border-indigo-400 rounded text-indigo-400 hover:bg-gray-100 flex items-center">
                                <EyeIcon className="h-4 w-4 mr-1.5" />
                                Response
                            </button>
                            <button style={{ backgroundColor: 'rgba(78, 83, 177, 1)' }} className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Read receipt</button>
                        </div>
                    </div>
                ))}
            </div>
           

            <div className="flex justify-end items-center border border-gray-300 py-2 px-4 rounded-lg gap-1 mt-8">
                {/* Previous Button */}
                <button
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Page Numbers */}
                <button className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm">1</button>
                <button className="px-3 py-1 rounded-md bg-indigo-500 text-white text-sm font-medium">2</button>
                <button className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm">3</button>
                <span className="px-1 text-gray-400">...</span>
                <button className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm">8</button>

                {/* Next Button */}
                <button
                    className="p-2 rounded-md hover:bg-gray-100"
                    aria-label="Next page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AnnouncementList;
